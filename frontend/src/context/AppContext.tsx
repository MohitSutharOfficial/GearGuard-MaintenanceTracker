import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { equipmentService } from '../services/equipment';
import { requestService } from '../services/requests';
import { teamService } from '../services/teams';
import { Equipment, MaintenanceRequest, MaintenanceTeam } from '../types';

interface AppContextType {
  equipment: Equipment[];
  requests: MaintenanceRequest[];
  teams: MaintenanceTeam[];
  loading: boolean;
  error: string | null;
  
  // Equipment operations
  addEquipment: (equipment: Omit<Equipment, 'id'>) => Promise<void>;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
  getEquipmentById: (id: string) => Equipment | undefined;
  refreshEquipment: () => Promise<void>;
  
  // Request operations
  addRequest: (request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRequest: (id: string, request: Partial<MaintenanceRequest>) => Promise<void>;
  updateRequestStage: (id: string, stage: MaintenanceRequest['stage']) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  getRequestsByEquipment: (equipmentId: string) => MaintenanceRequest[];
  refreshRequests: () => Promise<void>;
  
  // Team operations
  addTeam: (team: Omit<MaintenanceTeam, 'id'>) => Promise<void>;
  updateTeam: (id: string, team: Partial<MaintenanceTeam>) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  refreshTeams: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [teams, setTeams] = useState<MaintenanceTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load data independently - don't let one failure stop others
      await Promise.allSettled([
        refreshEquipment(),
        refreshRequests(),
        refreshTeams(),
      ]);
    } catch (err: any) {
      console.error('Error loading data:', err);
      // Continue anyway - individual fetches handle their own errors
    } finally {
      setLoading(false);
    }
  };

  // Equipment operations
  const refreshEquipment = async () => {
    try {
      const data = await equipmentService.getAll();
      const equipmentArray = Array.isArray(data) ? data : [];
      setEquipment(equipmentArray.map(transformEquipment));
    } catch (err: any) {
      console.error('Error loading equipment:', err);
      setEquipment([]);
      // Don't throw - allow app to continue
    }
  };

  const addEquipment = async (newEquipment: Omit<Equipment, 'id'>) => {
    try {
      const created = await equipmentService.create({
        name: newEquipment.name,
        code: newEquipment.serialNumber || `EQ-${Date.now()}`,
        serialNumber: newEquipment.serialNumber,
        categoryId: newEquipment.category,
        maintenanceTeamId: newEquipment.maintenanceTeamId,
        location: newEquipment.location,
        manufacturer: newEquipment.department,
        model: newEquipment.employee,
        purchaseDate: newEquipment.purchaseDate,
        warrantyExpiry: newEquipment.warrantyExpiry,
        status: newEquipment.status === 'active' ? 'OPERATIONAL' : 
                newEquipment.status === 'maintenance' ? 'UNDER_MAINTENANCE' : 'UNUSABLE'
      });
      setEquipment([...equipment, transformEquipment(created)]);
    } catch (err: any) {
      setError(err.message || 'Failed to create equipment');
      throw err;
    }
  };

  const updateEquipment = async (id: string, updates: Partial<Equipment>) => {
    try {
      const serviceUpdates: any = {};
      if (updates.name) serviceUpdates.name = updates.name;
      if (updates.serialNumber) serviceUpdates.code = updates.serialNumber;
      if (updates.location) serviceUpdates.location = updates.location;
      if (updates.status) {
        serviceUpdates.status = updates.status === 'active' ? 'OPERATIONAL' : 
                                 updates.status === 'maintenance' ? 'UNDER_MAINTENANCE' : 'UNUSABLE';
      }
      const updated = await equipmentService.update(id, serviceUpdates);
      setEquipment(equipment.map(eq => eq.id === id ? transformEquipment(updated) : eq));
    } catch (err: any) {
      setError(err.message || 'Failed to update equipment');
      throw err;
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      await equipmentService.delete(id);
      setEquipment(equipment.filter(eq => eq.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete equipment');
      throw err;
    }
  };

  const getEquipmentById = (id: string) => equipment.find(eq => eq.id === id);

  // Request operations
  const refreshRequests = async () => {
    try {
      const data = await requestService.getAll();
      const requestsArray = Array.isArray(data) ? data : [];
      setRequests(requestsArray.map(transformRequest));
    } catch (err: any) {
      console.error('Error loading requests:', err);
      setRequests([]);
      // Don't throw - allow app to continue
    }
  };

  const addRequest = async (newRequest: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await requestService.create({
        subject: newRequest.subject,
        description: newRequest.description,
        type: newRequest.type.toUpperCase() as 'CORRECTIVE' | 'PREVENTIVE',
        priority: (newRequest.priority || 'medium').toUpperCase() as any,
        equipmentId: newRequest.equipmentId,
        technician: newRequest.assignedToName || null,
        scheduledDate: newRequest.scheduledDate,
        duration: newRequest.duration
      });
      setRequests([...requests, transformRequest(created)]);
    } catch (err: any) {
      setError(err.message || 'Failed to create request');
      throw err;
    }
  };

  const updateRequest = async (id: string, updates: Partial<MaintenanceRequest>) => {
    try {
      const serviceUpdates: any = {};
      if (updates.subject) serviceUpdates.subject = updates.subject;
      if (updates.description) serviceUpdates.description = updates.description;
      if (updates.priority) serviceUpdates.priority = updates.priority.toUpperCase();
      if (updates.assignedToName) serviceUpdates.technician = updates.assignedToName;
      if (updates.scheduledDate) serviceUpdates.scheduledDate = updates.scheduledDate;
      if (updates.duration) serviceUpdates.duration = updates.duration;
      
      const updated = await requestService.update(id, serviceUpdates);
      setRequests(requests.map(req => req.id === id ? transformRequest(updated) : req));
    } catch (err: any) {
      setError(err.message || 'Failed to update request');
      throw err;
    }
  };

  const updateRequestStage = async (id: string, stage: MaintenanceRequest['stage']) => {
    try {
      // Pass stage directly - database uses lowercase with underscores already
      const updated = await requestService.updateStage(id, stage);
      setRequests(requests.map(req => req.id === id ? transformRequest(updated) : req));
    } catch (err: any) {
      setError(err.message || 'Failed to update request stage');
      throw err;
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      await requestService.delete(id);
      setRequests(requests.filter(req => req.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete request');
      throw err;
    }
  };

  const getRequestsByEquipment = (equipmentId: string) => 
    requests.filter(req => req.equipmentId === equipmentId);

  // Team operations
  const refreshTeams = async () => {
    try {
      const data = await teamService.getAll();
      const teamsArray = Array.isArray(data) ? data : [];
      setTeams(teamsArray.map(transformTeam));
    } catch (err: any) {
      console.error('Error loading teams:', err);
      setTeams([]);
      // Don't throw - allow app to continue with empty teams
    }
  };

  const addTeam = async (newTeam: Omit<MaintenanceTeam, 'id'>) => {
    try {
      const created = await teamService.create({
        name: newTeam.name,
        description: newTeam.category
      });
      setTeams([...teams, transformTeam(created)]);
    } catch (err: any) {
      setError(err.message || 'Failed to create team');
      throw err;
    }
  };

  const updateTeam = async (id: string, updates: Partial<MaintenanceTeam>) => {
    try {
      const serviceUpdates: any = {};
      if (updates.name) serviceUpdates.name = updates.name;
      if (updates.category) serviceUpdates.description = updates.category;
      
      const updated = await teamService.update(id, serviceUpdates);
      setTeams(teams.map(team => team.id === id ? transformTeam(updated) : team));
    } catch (err: any) {
      setError(err.message || 'Failed to update team');
      throw err;
    }
  };

  const deleteTeam = async (id: string) => {
    try {
      await teamService.delete(id);
      setTeams(teams.filter(team => team.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete team');
      throw err;
    }
  };

  return (
    <AppContext.Provider value={{
      equipment,
      requests,
      teams,
      loading,
      error,
      addEquipment,
      updateEquipment,
      deleteEquipment,
      getEquipmentById,
      refreshEquipment,
      addRequest,
      updateRequest,
      updateRequestStage,
      deleteRequest,
      getRequestsByEquipment,
      refreshRequests,
      addTeam,
      updateTeam,
      deleteTeam,
      refreshTeams,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

// Transform functions to convert API data to frontend format
function transformEquipment(data: any): Equipment {
  return {
    id: data.id.toString(),
    name: data.name,
    serialNumber: data.serial_number || data.code,
    category: data.category?.name || data.category_id?.toString() || '',
    department: data.manufacturer || '',
    employee: data.model || '',
    purchaseDate: data.purchase_date,
    warrantyExpiry: data.warranty_expiry,
    location: data.location || '',
    status: data.status === 'OPERATIONAL' ? 'active' : 
            data.status === 'UNDER_MAINTENANCE' ? 'maintenance' : 'scrapped',
    maintenanceTeamId: data.maintenance_team_id?.toString() || '',
    openRequestsCount: data.maintenance_requests?.filter((r: any) => 
      r.stage === 'NEW' || r.stage === 'IN_PROGRESS'
    ).length || 0,
  };
}

function transformRequest(data: any): MaintenanceRequest {
  const scheduledDate = data.scheduled_date ? new Date(data.scheduled_date) : null;
  const now = new Date();
  
  return {
    id: data.id.toString(),
    subject: data.subject,
    type: data.type.toLowerCase() as 'corrective' | 'preventive',
    equipmentId: data.equipment_id?.toString() || data.equipmentId?.toString() || '',
    equipmentName: data.equipment_name || data.equipment?.name || '',
    equipmentCategory: data.equipment_category || data.equipment?.category || '',
    maintenanceTeamId: data.maintenance_team_id?.toString() || '',
    maintenanceTeamName: data.maintenance_team_name || data.team?.name || '',
    assignedTo: data.technician_id?.toString(),
    assignedToName: data.technician || null,
    scheduledDate: data.scheduled_date,
    stage: data.stage.toLowerCase() as any, // Keep underscores as-is
    priority: data.priority.toLowerCase() as any,
    duration: data.duration || 0,
    hoursSpent: 0,
    description: data.description || '',
    createdAt: data.created_at,
    completedAt: data.updated_at,
    isOverdue: scheduledDate ? scheduledDate < now && data.stage !== 'REPAIRED' : false,
  };
}

function transformTeam(data: any): MaintenanceTeam {
  return {
    id: data.id.toString(),
    name: data.name,
    category: data.description || 'General',
    members: data.members || [],
  };
}
