// Database Types
export interface DatabaseResponse<T> {
  data: T | null;
  error: Error | null;
  count?: number;
}

// Equipment Types
export enum EquipmentStatus {
  ACTIVE = 'active',
  UNDER_REPAIR = 'under_repair',
  SCRAPPED = 'scrapped'
}

export interface Equipment {
  id: string;
  serial_number: string;
  name: string;
  category: string;
  department: string;
  employee: string | null;
  location: string;
  purchase_date: string;
  warranty_expiry: string;
  status: EquipmentStatus;
  maintenance_team_id: string;
  created_at: string;
  updated_at: string;
}

// Maintenance Request Types
export enum RequestType {
  CORRECTIVE = 'corrective',
  PREVENTIVE = 'preventive'
}

export enum RequestStage {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  REPAIRED = 'repaired',
  SCRAP = 'scrap',
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed'
}

export enum RequestPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface MaintenanceRequest {
  id: string;
  subject: string;
  type: RequestType;
  description: string;
  stage: RequestStage;
  priority: RequestPriority;
  equipment_id: string;
  equipment_name: string;
  equipment_category: string;
  maintenance_team_id: string;
  maintenance_team_name: string;
  technician: string | null;
  scheduled_date: string | null;
  duration: number;
  hours_spent: number;
  notes: string | null;
  scrap_reason: string | null;
  created_at: string;
  completed_at: string | null;
  updated_at: string;
}

// User Types
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  TECHNICIAN = 'technician'
}

export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Maintenance Team Types
export interface MaintenanceTeam {
  id: string;
  name: string;
  description: string | null;
  specialization: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  is_team_leader: boolean;
  joined_at: string;
}
