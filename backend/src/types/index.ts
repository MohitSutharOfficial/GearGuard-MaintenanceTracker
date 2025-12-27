export interface UserPayload {
  id: number;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

export interface EquipmentFilters {
  categoryId?: number;
  teamId?: number;
  status?: string;
}

export interface RequestFilters {
  type?: string;
  stage?: string;
  equipmentId?: number;
  technicianId?: number;
  teamId?: number;
}

export interface CreateMaintenanceRequest {
  subject: string;
  description?: string;
  type: 'CORRECTIVE' | 'PREVENTIVE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  equipmentId: number;
  technicianId?: number;
  scheduledDate?: Date;
  notes?: string;
}

export interface UpdateMaintenanceRequest {
  subject?: string;
  description?: string;
  type?: 'CORRECTIVE' | 'PREVENTIVE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  equipmentId?: number;
  technicianId?: number;
  scheduledDate?: Date;
  duration?: number;
  stage?: 'NEW' | 'IN_PROGRESS' | 'REPAIRED' | 'SCRAP';
  notes?: string;
}
