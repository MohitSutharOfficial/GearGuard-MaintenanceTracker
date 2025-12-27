# Data Models Document

## Overview

This document defines all data structures, TypeScript interfaces, database schemas, and data relationships for the GearGuard system.

## TypeScript Interfaces (Frontend)

### Equipment Entity

```typescript
interface Equipment {
  // Identifiers
  id: string;                    // UUID
  serialNumber: string;          // Unique, e.g., "CNC-001"
  
  // Basic Information
  name: string;                  // Equipment name
  category: string;              // Equipment category
  department: string;            // Owning department
  employee: string;              // Responsible employee
  location: string;              // Physical location
  
  // Dates
  purchaseDate: string;          // ISO date string
  warrantyExpiry: string;        // ISO date string
  
  // Status
  status: EquipmentStatus;       // active | under_repair | scrapped
  
  // Relationships
  maintenanceTeamId: string;     // FK to MaintenanceTeam
  
  // Computed Fields
  openRequestsCount: number;     // Count of open requests
  
  // Audit (future)
  createdAt?: string;            // ISO timestamp
  updatedAt?: string;            // ISO timestamp
}

enum EquipmentStatus {
  ACTIVE = 'active',
  UNDER_REPAIR = 'under_repair',
  SCRAPPED = 'scrapped'
}
```

**Field Constraints**:
```typescript
const equipmentConstraints = {
  name: {
    minLength: 1,
    maxLength: 255,
    required: true
  },
  serialNumber: {
    minLength: 1,
    maxLength: 50,
    required: true,
    unique: true,
    pattern: /^[A-Z0-9-]+$/
  },
  category: {
    required: true,
    enum: [
      'Manufacturing',
      'Computer',
      'Vehicle',
      'HVAC',
      'Electrical',
      'Other'
    ]
  },
  department: {
    required: true,
    maxLength: 100
  },
  employee: {
    required: false,
    maxLength: 255
  },
  location: {
    required: true,
    maxLength: 255
  },
  purchaseDate: {
    required: true,
    type: 'date',
    maxDate: 'today'
  },
  warrantyExpiry: {
    required: true,
    type: 'date',
    minDate: 'purchaseDate'
  },
  maintenanceTeamId: {
    required: true,
    foreignKey: 'MaintenanceTeam.id'
  }
};
```

**Example Instance**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "serialNumber": "CNC-001",
  "name": "CNC Milling Machine",
  "category": "Manufacturing",
  "department": "Production",
  "employee": "John Smith",
  "location": "Factory Floor A",
  "purchaseDate": "2023-01-15",
  "warrantyExpiry": "2026-01-15",
  "status": "active",
  "maintenanceTeamId": "abc-123",
  "openRequestsCount": 2,
  "createdAt": "2023-01-15T10:00:00Z",
  "updatedAt": "2024-12-27T14:30:00Z"
}
```

### MaintenanceRequest Entity

```typescript
interface MaintenanceRequest {
  // Identifiers
  id: string;                       // UUID
  
  // Basic Information
  subject: string;                  // Request title
  type: RequestType;                // corrective | preventive
  description: string;              // Detailed description
  
  // Workflow
  stage: RequestStage;              // Current workflow stage
  priority: RequestPriority;        // Urgency level
  
  // Equipment Reference
  equipmentId: string;              // FK to Equipment
  equipmentName: string;            // Denormalized for display
  equipmentCategory: string;        // Denormalized for display
  
  // Team Assignment
  maintenanceTeamId: string;        // FK to MaintenanceTeam
  maintenanceTeamName: string;      // Denormalized for display
  technician?: string;              // Assigned technician name
  
  // Scheduling
  scheduledDate?: string;           // ISO date (required for preventive)
  
  // Time Tracking
  duration?: number;                // Hours spent (logged on completion)
  hoursSpent: number;               // Total hours (cumulative)
  
  // Dates
  createdAt: string;                // ISO timestamp
  completedAt?: string;             // ISO timestamp (when completed)
  
  // Computed Fields
  isOverdue: boolean;               // Calculated based on scheduledDate
  
  // Notes (future)
  notes?: string;                   // Completion notes
  scrapReason?: string;             // If scrapped
}

enum RequestType {
  CORRECTIVE = 'corrective',
  PREVENTIVE = 'preventive'
}

enum RequestStage {
  // Corrective stages
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  REPAIRED = 'repaired',
  SCRAP = 'scrap',
  
  // Preventive stages
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed'
}

enum RequestPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}
```

**Field Constraints**:
```typescript
const requestConstraints = {
  subject: {
    minLength: 1,
    maxLength: 255,
    required: true
  },
  type: {
    required: true,
    enum: ['corrective', 'preventive'],
    immutable: true  // Cannot change after creation
  },
  description: {
    required: false,
    maxLength: 5000
  },
  stage: {
    required: true,
    enum: Object.values(RequestStage),
    defaultValue: {
      corrective: 'new',
      preventive: 'scheduled'
    }
  },
  priority: {
    requiredIf: { type: 'corrective' },
    enum: ['low', 'medium', 'high', 'urgent']
  },
  equipmentId: {
    required: true,
    foreignKey: 'Equipment.id'
  },
  maintenanceTeamId: {
    required: true,
    foreignKey: 'MaintenanceTeam.id'
  },
  technician: {
    requiredIf: { stage: 'in_progress' },
    maxLength: 255
  },
  scheduledDate: {
    requiredIf: { type: 'preventive' },
    type: 'date',
    minDate: 'today'
  },
  duration: {
    requiredIf: { stage: ['repaired', 'completed', 'scrap'] },
    min: 0.1,
    max: 999.9
  }
};
```

**Example Instances**:

```json
// Corrective Request
{
  "id": "req-001",
  "subject": "CNC Machine Motor Failure",
  "type": "corrective",
  "description": "Motor not starting, unusual noise before failure",
  "stage": "in_progress",
  "priority": "high",
  "equipmentId": "eq-001",
  "equipmentName": "CNC Milling Machine",
  "equipmentCategory": "Manufacturing",
  "maintenanceTeamId": "team-001",
  "maintenanceTeamName": "Mechanical Team",
  "technician": "Mike Johnson",
  "hoursSpent": 2.5,
  "createdAt": "2024-12-26T08:00:00Z",
  "isOverdue": false
}

// Preventive Request
{
  "id": "req-002",
  "subject": "Quarterly HVAC Inspection",
  "type": "preventive",
  "description": "Check filters, clean coils, test controls",
  "stage": "scheduled",
  "equipmentId": "eq-012",
  "equipmentName": "Rooftop HVAC Unit",
  "equipmentCategory": "HVAC",
  "maintenanceTeamId": "team-003",
  "maintenanceTeamName": "HVAC Team",
  "scheduledDate": "2025-01-15",
  "hoursSpent": 0,
  "createdAt": "2024-12-20T10:00:00Z",
  "isOverdue": false
}
```

### MaintenanceTeam Entity

```typescript
interface MaintenanceTeam {
  // Identifiers
  id: string;                    // UUID
  
  // Basic Information
  name: string;                  // Team name
  specialization: string;        // Area of expertise
  description: string;           // Team description
  
  // Members
  members: string[];             // Array of technician names
  
  // Visual
  color: string;                 // Hex color for UI
  
  // Audit (future)
  createdAt?: string;            // ISO timestamp
  updatedAt?: string;            // ISO timestamp
}
```

**Field Constraints**:
```typescript
const teamConstraints = {
  name: {
    minLength: 1,
    maxLength: 100,
    required: true,
    unique: true
  },
  specialization: {
    required: true,
    maxLength: 100
  },
  description: {
    required: false,
    maxLength: 500
  },
  members: {
    required: true,
    minItems: 1,
    itemType: 'string',
    itemMaxLength: 255
  },
  color: {
    required: true,
    pattern: /^#[0-9A-F]{6}$/i
  }
};
```

**Example Instance**:
```json
{
  "id": "team-001",
  "name": "Mechanical Team",
  "specialization": "Mechanical & Heavy Machinery",
  "description": "Handles all mechanical equipment maintenance and repairs",
  "members": [
    "Mike Johnson",
    "Sarah Williams",
    "Tom Brown"
  ],
  "color": "#3b82f6",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## Database Schema (PostgreSQL)

### Equipment Table

```sql
CREATE TABLE equipment (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Information
  serial_number VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  employee VARCHAR(255),
  location VARCHAR(255) NOT NULL,
  
  -- Dates
  purchase_date DATE NOT NULL,
  warranty_expiry DATE NOT NULL,
  
  -- Status
  status VARCHAR(50) DEFAULT 'active' NOT NULL,
  CHECK (status IN ('active', 'under_repair', 'scrapped')),
  
  -- Foreign Keys
  maintenance_team_id UUID NOT NULL REFERENCES maintenance_teams(id),
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_equipment_serial ON equipment(serial_number);
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_equipment_team ON equipment(maintenance_team_id);
CREATE INDEX idx_equipment_category ON equipment(category);
CREATE INDEX idx_equipment_department ON equipment(department);

-- Triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER equipment_updated_at
BEFORE UPDATE ON equipment
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
```

### Maintenance Requests Table

```sql
CREATE TABLE maintenance_requests (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Information
  subject VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  CHECK (type IN ('corrective', 'preventive')),
  description TEXT,
  
  -- Workflow
  stage VARCHAR(50) DEFAULT 'new' NOT NULL,
  CHECK (stage IN ('new', 'in_progress', 'repaired', 'scrap', 'scheduled', 'completed')),
  priority VARCHAR(50),
  CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Foreign Keys
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  maintenance_team_id UUID NOT NULL REFERENCES maintenance_teams(id),
  technician_id UUID REFERENCES users(id),
  
  -- Scheduling
  scheduled_date TIMESTAMP,
  
  -- Time Tracking
  duration NUMERIC(5, 1),
  hours_spent NUMERIC(5, 1) DEFAULT 0 NOT NULL,
  
  -- Notes
  notes TEXT,
  scrap_reason TEXT,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMP,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_request_equipment ON maintenance_requests(equipment_id);
CREATE INDEX idx_request_team ON maintenance_requests(maintenance_team_id);
CREATE INDEX idx_request_stage ON maintenance_requests(stage);
CREATE INDEX idx_request_type ON maintenance_requests(type);
CREATE INDEX idx_request_priority ON maintenance_requests(priority);
CREATE INDEX idx_request_scheduled ON maintenance_requests(scheduled_date);
CREATE INDEX idx_request_created ON maintenance_requests(created_at);

-- Composite indexes for common queries
CREATE INDEX idx_request_equipment_stage ON maintenance_requests(equipment_id, stage);
CREATE INDEX idx_request_team_stage ON maintenance_requests(maintenance_team_id, stage);

-- Trigger
CREATE TRIGGER request_updated_at
BEFORE UPDATE ON maintenance_requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
```

### Maintenance Teams Table

```sql
CREATE TABLE maintenance_teams (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Information
  name VARCHAR(100) UNIQUE NOT NULL,
  specialization VARCHAR(100) NOT NULL,
  description TEXT,
  
  -- Visual
  color VARCHAR(7) NOT NULL,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_team_name ON maintenance_teams(name);

-- Trigger
CREATE TRIGGER team_updated_at
BEFORE UPDATE ON maintenance_teams
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
```

### Team Members Table (Future)

```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES maintenance_teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  CHECK (role IN ('lead', 'member')),
  joined_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  UNIQUE(team_id, user_id)
);

-- Indexes
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
```

### Users Table (Future)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  CHECK (role IN ('admin', 'manager', 'technician', 'viewer')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  last_login TIMESTAMP
);

-- Indexes
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_role ON users(role);
```

## Data Relationships

### Entity Relationship Diagram

```
┌─────────────────┐
│     Users       │
│  (Future)       │
└────────┬────────┘
         │
         │ created_by
         ▼
┌─────────────────────┐        ┌──────────────────────┐
│ Maintenance Teams   │◄───────│ Team Members         │
│                     │   1:N  │ (Future)             │
│ - id                │        │ - team_id (FK)       │
│ - name              │        │ - user_id (FK)       │
│ - specialization    │        └──────────────────────┘
└──────────┬──────────┘
           │
           │ 1:N
           │
           ▼
    ┌──────────────────┐
    │   Equipment      │
    │                  │
    │ - id             │
    │ - serial_number  │
    │ - name           │
    │ - team_id (FK)   │◄─────────┐
    └──────┬───────────┘           │
           │                       │
           │ 1:N                   │ equipment_id (FK)
           │                       │
           ▼                       │
    ┌──────────────────────────┐  │
    │ Maintenance Requests     │──┘
    │                          │
    │ - id                     │
    │ - subject                │
    │ - type                   │
    │ - stage                  │
    │ - equipment_id (FK)      │
    │ - team_id (FK)           │
    │ - technician_id (FK)     │
    └──────────────────────────┘
```

### Relationship Details

#### Equipment → MaintenanceTeam (Many-to-One)
- **Foreign Key**: `equipment.maintenance_team_id`
- **Cardinality**: N:1 (Many equipment to one team)
- **Constraint**: NOT NULL (equipment must have a team)
- **On Delete**: RESTRICT (cannot delete team with equipment)

#### Equipment → MaintenanceRequest (One-to-Many)
- **Foreign Key**: `maintenance_requests.equipment_id`
- **Cardinality**: 1:N (One equipment to many requests)
- **Constraint**: NOT NULL
- **On Delete**: CASCADE (delete requests when equipment deleted)

#### MaintenanceTeam → MaintenanceRequest (One-to-Many)
- **Foreign Key**: `maintenance_requests.maintenance_team_id`
- **Cardinality**: 1:N
- **Constraint**: NOT NULL
- **On Delete**: RESTRICT (cannot delete team with open requests)

#### User → MaintenanceRequest (One-to-Many) - Future
- **Foreign Key**: `maintenance_requests.technician_id`
- **Cardinality**: 1:N
- **Constraint**: NULL (request may not be assigned yet)
- **On Delete**: SET NULL (keep request, remove technician)

## Computed Fields

### Equipment.openRequestsCount

**Calculation**:
```sql
SELECT COUNT(*)
FROM maintenance_requests
WHERE equipment_id = ?
  AND stage NOT IN ('repaired', 'completed', 'scrap');
```

**Usage**: Display on equipment cards and detail pages

### MaintenanceRequest.isOverdue

**Calculation**:
```typescript
const isOverdue = (request: MaintenanceRequest): boolean => {
  // Not overdue if completed
  if (['repaired', 'completed', 'scrap'].includes(request.stage)) {
    return false;
  }
  
  // Only scheduled requests can be overdue
  if (!request.scheduledDate) {
    return false;
  }
  
  // Check if past scheduled date
  const today = new Date();
  const scheduled = new Date(request.scheduledDate);
  return scheduled < today;
};
```

**Usage**: Highlight overdue requests in red, show overdue count

## Data Validation Rules

### Cross-Field Validation

```typescript
const validateMaintenanceRequest = (request: Partial<MaintenanceRequest>) => {
  const errors: Record<string, string> = {};
  
  // Type-specific validations
  if (request.type === 'corrective' && !request.priority) {
    errors.priority = 'Priority required for corrective requests';
  }
  
  if (request.type === 'preventive' && !request.scheduledDate) {
    errors.scheduledDate = 'Scheduled date required for preventive requests';
  }
  
  // Stage-specific validations
  if (request.stage === 'in_progress' && !request.technician) {
    errors.technician = 'Technician required for in-progress requests';
  }
  
  if (['repaired', 'completed'].includes(request.stage) && !request.duration) {
    errors.duration = 'Duration required before completion';
  }
  
  if (request.stage === 'scrap' && !request.scrapReason) {
    errors.scrapReason = 'Scrap reason required';
  }
  
  // Date validations
  if (request.scheduledDate) {
    const scheduled = new Date(request.scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (scheduled < today) {
      errors.scheduledDate = 'Scheduled date cannot be in the past';
    }
  }
  
  return errors;
};
```

## Data Migration Scripts

### Initial Seed Data

```sql
-- Seed Maintenance Teams
INSERT INTO maintenance_teams (id, name, specialization, description, color) VALUES
('team-001', 'Mechanical Team', 'Mechanical & Heavy Machinery', 'Handles all mechanical equipment', '#3b82f6'),
('team-002', 'Electrical Team', 'Electrical Systems', 'Manages electrical equipment', '#10b981'),
('team-003', 'HVAC Team', 'HVAC Systems', 'Climate control systems', '#f59e0b');

-- Seed Equipment
INSERT INTO equipment (id, serial_number, name, category, department, employee, location, purchase_date, warranty_expiry, status, maintenance_team_id) VALUES
('eq-001', 'CNC-001', 'CNC Milling Machine', 'Manufacturing', 'Production', 'John Smith', 'Factory Floor A', '2023-01-15', '2026-01-15', 'active', 'team-001'),
('eq-002', 'FL-003', 'Forklift #3', 'Vehicle', 'Warehouse', 'Mike Davis', 'Dock 2', '2022-06-10', '2025-06-10', 'active', 'team-001'),
('eq-003', 'HVAC-012', 'Rooftop HVAC Unit', 'HVAC', 'Facilities', NULL, 'Roof', '2021-03-20', '2026-03-20', 'active', 'team-003');

-- Seed Maintenance Requests
INSERT INTO maintenance_requests (id, subject, type, description, stage, priority, equipment_id, maintenance_team_id, created_at) VALUES
('req-001', 'Oil Leak', 'corrective', 'Leaking oil from main motor', 'new', 'high', 'eq-001', 'team-001', NOW() - INTERVAL '2 days'),
('req-002', 'Monthly Inspection', 'preventive', 'Routine monthly checkup', 'scheduled', NULL, 'eq-003', 'team-003', NOW() - INTERVAL '1 day');
```

---

**Document Maintained By**: Data Architecture Team  
**Last Updated**: December 2024  
**Version**: 1.0
