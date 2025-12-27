export interface UserPayload {
  id: string;
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
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface EquipmentFilters {
  categoryId?: string;
  teamId?: string;
  status?: string;
}

export interface RequestFilters {
  type?: string;
  stage?: string;
  equipmentId?: string;
  technicianId?: string;
  teamId?: string;
}

export interface CreateMaintenanceRequest {
  subject: string;
  description?: string;
  type: 'CORRECTIVE' | 'PREVENTIVE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  equipmentId: string;
  technicianId?: string;
  scheduledDate?: Date;
  notes?: string;
}

export interface UpdateMaintenanceRequest {
  subject?: string;
  description?: string;
  type?: 'CORRECTIVE' | 'PREVENTIVE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  equipmentId?: string;
  technicianId?: string;
  scheduledDate?: Date;
  duration?: number;
  stage?: 'NEW' | 'IN_PROGRESS' | 'REPAIRED' | 'SCRAP';
  notes?: string;
}
