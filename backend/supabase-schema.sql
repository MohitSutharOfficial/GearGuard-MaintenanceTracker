-- =========================================================
-- GearGuard Supabase Database Schema
-- =========================================================
-- This schema should be executed in Supabase SQL Editor
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================
-- ENUM TYPES
-- =========================================================

-- Equipment Status
CREATE TYPE equipment_status AS ENUM ('active', 'under_repair', 'scrapped');

-- Request Type
CREATE TYPE request_type AS ENUM ('corrective', 'preventive');

-- Request Stage
CREATE TYPE request_stage AS ENUM (
  'new',
  'in_progress',
  'repaired',
  'scrap',
  'scheduled',
  'completed'
);

-- Request Priority
CREATE TYPE request_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- User Role
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'technician');

-- =========================================================
-- TABLES
-- =========================================================

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'technician',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Teams Table
CREATE TABLE maintenance_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  specialization VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team Members (Join Table)
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES maintenance_teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_team_leader BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Equipment Table
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  serial_number VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  employee VARCHAR(255),
  location VARCHAR(255) NOT NULL,
  purchase_date DATE NOT NULL,
  warranty_expiry DATE NOT NULL,
  status equipment_status DEFAULT 'active',
  maintenance_team_id UUID NOT NULL REFERENCES maintenance_teams(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT check_serial_number CHECK (serial_number ~ '^[A-Z0-9-]+$'),
  CONSTRAINT check_warranty CHECK (warranty_expiry >= purchase_date)
);

-- Maintenance Requests Table
CREATE TABLE maintenance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject VARCHAR(255) NOT NULL,
  type request_type NOT NULL,
  description TEXT NOT NULL,
  stage request_stage DEFAULT 'new',
  priority request_priority DEFAULT 'medium',
  
  -- Equipment Reference (denormalized for performance)
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE RESTRICT,
  equipment_name VARCHAR(255) NOT NULL,
  equipment_category VARCHAR(100) NOT NULL,
  
  -- Team Assignment (denormalized for performance)
  maintenance_team_id UUID NOT NULL REFERENCES maintenance_teams(id) ON DELETE RESTRICT,
  maintenance_team_name VARCHAR(255) NOT NULL,
  technician VARCHAR(255),
  
  -- Scheduling
  scheduled_date DATE,
  
  -- Time Tracking
  duration DECIMAL(10, 2) DEFAULT 0,
  hours_spent DECIMAL(10, 2) DEFAULT 0,
  
  -- Notes
  notes TEXT,
  scrap_reason TEXT,
  
  -- Dates
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT check_preventive_has_date CHECK (
    type = 'corrective' OR (type = 'preventive' AND scheduled_date IS NOT NULL)
  ),
  CONSTRAINT check_duration_positive CHECK (duration >= 0),
  CONSTRAINT check_hours_positive CHECK (hours_spent >= 0)
);

-- Request History/Activity Log (Optional but useful)
CREATE TABLE request_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES maintenance_requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- INDEXES for Performance
-- =========================================================

-- Equipment indexes
CREATE INDEX idx_equipment_serial ON equipment(serial_number);
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_equipment_team ON equipment(maintenance_team_id);
CREATE INDEX idx_equipment_category ON equipment(category);

-- Request indexes
CREATE INDEX idx_requests_type ON maintenance_requests(type);
CREATE INDEX idx_requests_stage ON maintenance_requests(stage);
CREATE INDEX idx_requests_priority ON maintenance_requests(priority);
CREATE INDEX idx_requests_equipment ON maintenance_requests(equipment_id);
CREATE INDEX idx_requests_team ON maintenance_requests(maintenance_team_id);
CREATE INDEX idx_requests_scheduled ON maintenance_requests(scheduled_date);
CREATE INDEX idx_requests_created ON maintenance_requests(created_at);

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Team member indexes
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);

-- =========================================================
-- FUNCTIONS & TRIGGERS
-- =========================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger: Auto-update updated_at for users
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update updated_at for equipment
CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE ON equipment
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update updated_at for maintenance_requests
CREATE TRIGGER update_requests_updated_at
  BEFORE UPDATE ON maintenance_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update updated_at for maintenance_teams
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON maintenance_teams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function: Get open requests count for equipment
CREATE OR REPLACE FUNCTION get_equipment_open_requests(equipment_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM maintenance_requests
    WHERE equipment_id = equipment_uuid
      AND stage NOT IN ('repaired', 'completed', 'scrap')
  );
END;
$$ LANGUAGE plpgsql;

-- Function: Check if request is overdue
CREATE OR REPLACE FUNCTION is_request_overdue(
  request_scheduled_date DATE,
  request_stage request_stage
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    request_scheduled_date IS NOT NULL
    AND request_scheduled_date < CURRENT_DATE
    AND request_stage NOT IN ('repaired', 'completed', 'scrap')
  );
END;
$$ LANGUAGE plpgsql;

-- Function: Auto-flag equipment as scrapped when request is scrapped
CREATE OR REPLACE FUNCTION handle_request_scrap()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stage = 'scrap' AND OLD.stage != 'scrap' THEN
    UPDATE equipment
    SET status = 'scrapped'
    WHERE id = NEW.equipment_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update equipment status when request is scrapped
CREATE TRIGGER on_request_scrap
  AFTER UPDATE ON maintenance_requests
  FOR EACH ROW
  WHEN (NEW.stage = 'scrap')
  EXECUTE FUNCTION handle_request_scrap();

-- =========================================================
-- ROW LEVEL SECURITY (RLS) Policies
-- =========================================================
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_activity_log ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read all users
CREATE POLICY "Authenticated can read users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can manage users (simplified to avoid recursion)
CREATE POLICY "Authenticated can manage users"
  ON users FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Everyone can read equipment
CREATE POLICY "Everyone can read equipment"
  ON equipment FOR SELECT
  USING (true);

-- Policy: Authenticated users can create equipment
CREATE POLICY "Authenticated can create equipment"
  ON equipment FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Authenticated users can update equipment
CREATE POLICY "Authenticated can update equipment"
  ON equipment FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Authenticated users can delete equipment
CREATE POLICY "Authenticated can delete equipment"
  ON equipment FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Policy: Everyone can read maintenance requests
CREATE POLICY "Everyone can read requests"
  ON maintenance_requests FOR SELECT
  USING (true);

-- Policy: Everyone can create requests
CREATE POLICY "Everyone can create requests"
  ON maintenance_requests FOR INSERT
  WITH CHECK (true);

-- Policy: Authenticated users can update requests
CREATE POLICY "Authenticated can update requests"
  ON maintenance_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Authenticated users can delete requests
CREATE POLICY "Authenticated can delete requests"
  ON maintenance_requests FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Policy: Everyone can read teams
CREATE POLICY "Everyone can read teams"
  ON maintenance_teams FOR SELECT
  USING (true);

-- Policy: Authenticated users can manage teams
CREATE POLICY "Authenticated can manage teams"
  ON maintenance_teams FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- =========================================================
-- SEED DATA (Optional - for testing)
-- =========================================================

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@gearguard.com', '$2b$10$rQZhJKZqJZy9Y.YH3QqKUe8ZqH0qLqQZhJKZqJZy9Y.YH3QqKUe8Z', 'System Admin', 'admin'),
('manager@gearguard.com', '$2b$10$rQZhJKZqJZy9Y.YH3QqKUe8ZqH0qLqQZhJKZqJZy9Y.YH3QqKUe8Z', 'John Manager', 'manager'),
('tech1@gearguard.com', '$2b$10$rQZhJKZqJZy9Y.YH3QqKUe8ZqH0qLqQZhJKZqJZy9Y.YH3QqKUe8Z', 'Alice Technician', 'technician'),
('tech2@gearguard.com', '$2b$10$rQZhJKZqJZy9Y.YH3QqKUe8ZqH0qLqQZhJKZqJZy9Y.YH3QqKUe8Z', 'Bob Technician', 'technician');

-- Insert maintenance teams
INSERT INTO maintenance_teams (name, description, specialization) VALUES
('Mechanical Team', 'Handles mechanical equipment maintenance', 'Mechanical'),
('Electrical Team', 'Handles electrical systems', 'Electrical'),
('IT Team', 'Handles computer and network equipment', 'Information Technology'),
('HVAC Team', 'Heating, ventilation, and air conditioning', 'HVAC');

-- Insert sample equipment
INSERT INTO equipment (
  serial_number, name, category, department, employee, location,
  purchase_date, warranty_expiry, status, maintenance_team_id
) VALUES
(
  'CNC-001', 'CNC Milling Machine', 'Manufacturing', 'Production',
  'John Smith', 'Factory Floor A', '2023-01-15', '2026-01-15',
  'active', (SELECT id FROM maintenance_teams WHERE name = 'Mechanical Team')
),
(
  'COMP-001', 'Dell Workstation', 'Computer', 'Engineering',
  'Jane Doe', 'Office Building B', '2023-06-01', '2026-06-01',
  'active', (SELECT id FROM maintenance_teams WHERE name = 'IT Team')
),
(
  'HVAC-001', 'Chiller Unit 1', 'HVAC', 'Facilities',
  'Mike Johnson', 'Rooftop', '2022-03-20', '2027-03-20',
  'active', (SELECT id FROM maintenance_teams WHERE name = 'HVAC Team')
);

-- =========================================================
-- VIEWS (Optional - for reporting)
-- =========================================================

-- View: Equipment with open request counts
CREATE OR REPLACE VIEW vw_equipment_with_requests AS
SELECT 
  e.*,
  COUNT(mr.id) FILTER (WHERE mr.stage NOT IN ('repaired', 'completed', 'scrap')) AS open_requests_count
FROM equipment e
LEFT JOIN maintenance_requests mr ON e.id = mr.equipment_id
GROUP BY e.id;

-- View: Overdue requests
CREATE OR REPLACE VIEW vw_overdue_requests AS
SELECT 
  mr.*,
  CASE 
    WHEN mr.scheduled_date < CURRENT_DATE THEN true
    ELSE false
  END AS is_overdue
FROM maintenance_requests mr
WHERE mr.scheduled_date IS NOT NULL
  AND mr.scheduled_date < CURRENT_DATE
  AND mr.stage NOT IN ('repaired', 'completed', 'scrap');

-- View: Team workload
CREATE OR REPLACE VIEW vw_team_workload AS
SELECT 
  mt.id,
  mt.name,
  COUNT(mr.id) FILTER (WHERE mr.stage IN ('new', 'in_progress')) AS active_requests,
  COUNT(mr.id) FILTER (WHERE mr.stage = 'new') AS new_requests,
  COUNT(mr.id) FILTER (WHERE mr.stage = 'in_progress') AS in_progress_requests,
  AVG(mr.hours_spent) FILTER (WHERE mr.stage IN ('repaired', 'completed')) AS avg_completion_hours
FROM maintenance_teams mt
LEFT JOIN maintenance_requests mr ON mt.id = mr.maintenance_team_id
GROUP BY mt.id, mt.name;

-- =========================================================
-- CLEANUP & MAINTENANCE FUNCTIONS
-- =========================================================

-- Function: Archive old completed requests (older than 2 years)
CREATE OR REPLACE FUNCTION archive_old_requests()
RETURNS INTEGER AS $$
DECLARE
  archived_count INTEGER;
BEGIN
  -- In production, you might move these to an archive table
  DELETE FROM maintenance_requests
  WHERE stage IN ('repaired', 'completed')
    AND completed_at < NOW() - INTERVAL '2 years';
  
  GET DIAGNOSTICS archived_count = ROW_COUNT;
  RETURN archived_count;
END;
$$ LANGUAGE plpgsql;

-- =========================================================
-- COMMENTS for Documentation
-- =========================================================

COMMENT ON TABLE users IS 'System users with role-based access control';
COMMENT ON TABLE maintenance_teams IS 'Teams responsible for maintenance work';
COMMENT ON TABLE equipment IS 'Equipment inventory and tracking';
COMMENT ON TABLE maintenance_requests IS 'Maintenance work orders and requests';
COMMENT ON TABLE request_activity_log IS 'Audit trail for request changes';

COMMENT ON COLUMN equipment.serial_number IS 'Unique equipment identifier (uppercase alphanumeric)';
COMMENT ON COLUMN maintenance_requests.type IS 'corrective=breakdown, preventive=scheduled';
COMMENT ON COLUMN maintenance_requests.stage IS 'Workflow state in state machine';
COMMENT ON COLUMN maintenance_requests.scheduled_date IS 'Required for preventive maintenance';
COMMENT ON COLUMN maintenance_requests.duration IS 'Hours logged for this request';

-- =========================================================
-- END OF SCHEMA
-- =========================================================
