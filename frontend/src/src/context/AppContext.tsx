import { createContext, ReactNode, useContext, useState } from 'react';
import { Equipment, MaintenanceRequest, MaintenanceTeam } from '../types';

interface AppContextType {
  equipment: Equipment[];
  requests: MaintenanceRequest[];
  teams: MaintenanceTeam[];
  addEquipment: (equipment: Equipment) => void;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => void;
  addRequest: (request: MaintenanceRequest) => void;
  updateRequest: (id: string, request: Partial<MaintenanceRequest>) => void;
  updateRequestStage: (id: string, stage: MaintenanceRequest['stage']) => void;
  getEquipmentById: (id: string) => Equipment | undefined;
  getRequestsByEquipment: (equipmentId: string) => MaintenanceRequest[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const mockTeams: MaintenanceTeam[] = [
  {
    id: '1',
    name: 'Mechanics',
    category: 'Mechanics',
    members: [
      { id: '1', name: 'John Smith', email: 'john@company.com', role: 'technician' },
      { id: '2', name: 'Mike Johnson', email: 'mike@company.com', role: 'manager' }
    ]
  },
  {
    id: '2',
    name: 'Electricians',
    category: 'Electricians',
    members: [
      { id: '3', name: 'Sarah Williams', email: 'sarah@company.com', role: 'technician' }
    ]
  },
  {
    id: '3',
    name: 'IT Support',
    category: 'IT Support',
    members: [
      { id: '4', name: 'David Brown', email: 'david@company.com', role: 'technician' },
      { id: '5', name: 'Lisa Davis', email: 'lisa@company.com', role: 'manager' }
    ]
  }
];

const mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'CNC Machine',
    serialNumber: 'CNC-001',
    category: 'Manufacturing',
    department: 'Production',
    employee: 'John Doe',
    purchaseDate: '2023-01-15',
    warrantyExpiry: '2025-01-15',
    location: 'Factory Floor A',
    status: 'active',
    maintenanceTeamId: '1',
    openRequestsCount: 2
  },
  {
    id: '2',
    name: 'Laptop Dell XPS',
    serialNumber: 'LT-456',
    category: 'Computer',
    department: 'IT',
    employee: 'Jane Smith',
    purchaseDate: '2024-03-20',
    warrantyExpiry: '2027-03-20',
    location: 'Office 3B',
    status: 'active',
    maintenanceTeamId: '3',
    openRequestsCount: 0
  },
  {
    id: '3',
    name: 'Printer HP LaserJet',
    serialNumber: 'PR-789',
    category: 'Office Equipment',
    department: 'Administration',
    employee: 'Bob Wilson',
    purchaseDate: '2022-06-10',
    warrantyExpiry: '2024-06-10',
    location: 'Office 2A',
    status: 'maintenance',
    maintenanceTeamId: '3',
    openRequestsCount: 1
  }
];

const mockRequests: MaintenanceRequest[] = [
  {
    id: '1',
    subject: 'Leaking Oil',
    type: 'corrective',
    equipmentId: '1',
    equipmentName: 'CNC Machine',
    equipmentCategory: 'Manufacturing',
    maintenanceTeamId: '1',
    maintenanceTeamName: 'Mechanics',
    stage: 'new',
    priority: 'high',
    duration: 4,
    hoursSpent: 0,
    description: 'Machine is leaking oil from the hydraulic system',
    createdAt: '2024-12-20T10:00:00Z',
    isOverdue: false
  },
  {
    id: '2',
    subject: 'Routine Checkup',
    type: 'preventive',
    equipmentId: '1',
    equipmentName: 'CNC Machine',
    equipmentCategory: 'Manufacturing',
    maintenanceTeamId: '1',
    maintenanceTeamName: 'Mechanics',
    scheduledDate: '2024-12-30',
    stage: 'new',
    priority: 'medium',
    duration: 2,
    hoursSpent: 0,
    description: 'Monthly routine maintenance checkup',
    createdAt: '2024-12-15T08:00:00Z',
    isOverdue: false
  },
  {
    id: '3',
    subject: 'Paper Jam Issue',
    type: 'corrective',
    equipmentId: '3',
    equipmentName: 'Printer HP LaserJet',
    equipmentCategory: 'Office Equipment',
    maintenanceTeamId: '3',
    maintenanceTeamName: 'IT Support',
    assignedTo: '4',
    assignedToName: 'David Brown',
    stage: 'in-progress',
    priority: 'low',
    duration: 1,
    hoursSpent: 0.5,
    description: 'Frequent paper jams occurring',
    createdAt: '2024-12-25T14:00:00Z',
    isOverdue: false
  },
  {
    id: '4',
    subject: 'Motor Replacement',
    type: 'corrective',
    equipmentId: '1',
    equipmentName: 'CNC Machine',
    equipmentCategory: 'Manufacturing',
    maintenanceTeamId: '1',
    maintenanceTeamName: 'Mechanics',
    assignedTo: '1',
    assignedToName: 'John Smith',
    stage: 'repaired',
    priority: 'high',
    duration: 8,
    hoursSpent: 8,
    description: 'Main motor needed replacement',
    createdAt: '2024-12-10T09:00:00Z',
    completedAt: '2024-12-18T17:00:00Z',
    isOverdue: false
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [equipment, setEquipment] = useState<Equipment[]>(mockEquipment);
  const [requests, setRequests] = useState<MaintenanceRequest[]>(mockRequests);
  const [teams] = useState<MaintenanceTeam[]>(mockTeams);

  const addEquipment = (newEquipment: Equipment) => {
    setEquipment([...equipment, newEquipment]);
  };

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    setEquipment(equipment.map(eq => eq.id === id ? { ...eq, ...updates } : eq));
  };

  const addRequest = (newRequest: MaintenanceRequest) => {
    setRequests([...requests, newRequest]);
    // Update equipment open requests count
    const eq = equipment.find(e => e.id === newRequest.equipmentId);
    if (eq) {
      updateEquipment(eq.id, { openRequestsCount: eq.openRequestsCount + 1 });
    }
  };

  const updateRequest = (id: string, updates: Partial<MaintenanceRequest>) => {
    setRequests(requests.map(req => req.id === id ? { ...req, ...updates } : req));
  };

  const updateRequestStage = (id: string, stage: MaintenanceRequest['stage']) => {
    const request = requests.find(r => r.id === id);
    if (request) {
      const updates: Partial<MaintenanceRequest> = { stage };
      
      // If moving to repaired or scrap, mark as completed
      if (stage === 'repaired' || stage === 'scrap') {
        updates.completedAt = new Date().toISOString();
        
        // Update equipment open requests count
        const eq = equipment.find(e => e.id === request.equipmentId);
        if (eq && eq.openRequestsCount > 0) {
          updateEquipment(eq.id, { openRequestsCount: eq.openRequestsCount - 1 });
        }
      }
      
      updateRequest(id, updates);
    }
  };

  const getEquipmentById = (id: string) => equipment.find(eq => eq.id === id);

  const getRequestsByEquipment = (equipmentId: string) => 
    requests.filter(req => req.equipmentId === equipmentId);

  return (
    <AppContext.Provider value={{
      equipment,
      requests,
      teams,
      addEquipment,
      updateEquipment,
      addRequest,
      updateRequest,
      updateRequestStage,
      getEquipmentById,
      getRequestsByEquipment
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
