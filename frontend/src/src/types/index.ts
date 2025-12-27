// Equipment Types
export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  category: string;
  department: string;
  employee: string;
  purchaseDate: string;
  warrantyExpiry: string;
  location: string;
  status: 'active' | 'maintenance' | 'scrapped';
  maintenanceTeamId: string;
  openRequestsCount: number;
}

// Maintenance Team Types
export interface MaintenanceTeam {
  id: string;
  name: string;
  category: 'Mechanics' | 'Electricians' | 'IT Support' | 'General';
  members: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'technician' | 'manager';
  avatar?: string;
}

// Maintenance Request Types
export type RequestType = 'corrective' | 'preventive';
export type RequestStage = 'new' | 'in-progress' | 'repaired' | 'scrap';

export interface MaintenanceRequest {
  id: string;
  subject: string;
  type: RequestType;
  equipmentId: string;
  equipmentName: string;
  equipmentCategory: string;
  maintenanceTeamId: string;
  maintenanceTeamName: string;
  scheduledDate?: string;
  assignedTo?: string;
  assignedToName?: string;
  stage: RequestStage;
  priority: 'low' | 'medium' | 'high';
  duration: number; // in hours
  hoursSpent: number;
  description: string;
  createdAt: string;
  completedAt?: string;
  isOverdue: boolean;
}

// Kanban Board Types
export interface KanbanColumn {
  id: RequestStage;
  title: string;
  cards: MaintenanceRequest[];
}

// Calendar Event Type
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: RequestType;
  equipmentName: string;
}

// Report Types
export interface ReportData {
  teamStats: TeamStats[];
  equipmentStats: EquipmentStats[];
}

export interface TeamStats {
  teamName: string;
  totalRequests: number;
  completed: number;
  inProgress: number;
}

export interface EquipmentStats {
  category: string;
  totalRequests: number;
  corrective: number;
  preventive: number;
}

// Form Types
export interface EquipmentFormData {
  name: string;
  serialNumber: string;
  category: string;
  department: string;
  employee: string;
  purchaseDate: string;
  warrantyExpiry: string;
  location: string;
  maintenanceTeamId: string;
}

export interface RequestFormData {
  subject: string;
  type: RequestType;
  equipmentId: string;
  scheduledDate?: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
}
