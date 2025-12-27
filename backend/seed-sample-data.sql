-- =========================================================
-- GearGuard Sample Data - Comprehensive Test Dataset
-- Run this in Supabase SQL Editor AFTER running the schema
-- =========================================================

-- Clean existing data (optional - use if you want fresh data)
TRUNCATE TABLE request_activity_log CASCADE;
TRUNCATE TABLE maintenance_requests CASCADE;
TRUNCATE TABLE team_members CASCADE;
TRUNCATE TABLE equipment CASCADE;
TRUNCATE TABLE maintenance_teams CASCADE;
TRUNCATE TABLE users CASCADE;

-- =========================================================
-- 1. USERS (Various roles and technicians)
-- =========================================================
-- Password for all users: Admin@123
-- Hash generated using bcrypt with 10 rounds

INSERT INTO users (id, email, password_hash, full_name, role, is_active) VALUES
-- Admins
('11111111-1111-1111-1111-111111111111', 'admin@gearguard.com', '$2b$10$8ZqH0qLqQZhJKZqJZy9Y.eH3QqKUe8ZqH0qLqQZhJKZqJZy9Y.YH3', 'Robert Martinez', 'admin', true),

-- Managers
('22222222-2222-2222-2222-222222222222', 'manager1@gearguard.com', '$2b$10$8ZqH0qLqQZhJKZqJZy9Y.eH3QqKUe8ZqH0qLqQZhJKZqJZy9Y.YH3', 'Sarah Johnson', 'manager', true),
('22222222-2222-2222-2222-222222222223', 'manager2@gearguard.com', '$2b$10$8ZqH0qLqQZhJKZqJZy9Y.eH3QqKUe8ZqH0qLqQZhJKZqJZy9Y.YH3', 'Michael Chen', 'manager', true),

-- Technicians
('33333333-3333-3333-3333-333333333331', 'tech1@gearguard.com', '$2b$10$8ZqH0qLqQZhJKZqJZy9Y.eH3QqKUe8ZqH0qLqQZhJKZqJZy9Y.YH3', 'James Wilson', 'technician', true),
('33333333-3333-3333-3333-333333333332', 'tech2@gearguard.com', '$2b$10$8ZqH0qLqQZhJKZqJZy9Y.eH3QqKUe8ZqH0qLqQZhJKZqJZy9Y.YH3', 'Emily Davis', 'technician', true),
('33333333-3333-3333-3333-333333333333', 'tech3@gearguard.com', '$2b$10$8ZqH0qLqQZhJKZqJZy9Y.eH3QqKUe8ZqH0qLqQZhJKZqJZy9Y.YH3', 'Carlos Rodriguez', 'technician', true),
('33333333-3333-3333-3333-333333333334', 'tech4@gearguard.com', '$2b$10$8ZqH0qLqQZhJKZqJZy9Y.eH3QqKUe8ZqH0qLqQZhJKZqJZy9Y.YH3', 'Jennifer Lee', 'technician', true),
('33333333-3333-3333-3333-333333333335', 'tech5@gearguard.com', '$2b$10$8ZqH0qLqQZhJKZqJZy9Y.eH3QqKUe8ZqH0qLqQZhJKZqJZy9Y.YH3', 'David Thompson', 'technician', true),
('33333333-3333-3333-3333-333333333336', 'tech6@gearguard.com', '$2b$10$8ZqH0qLqQZhJKZqJZy9Y.eH3QqKUe8ZqH0qLqQZhJKZqJZy9Y.YH3', 'Lisa Anderson', 'technician', true);

-- =========================================================
-- 2. MAINTENANCE TEAMS
-- =========================================================

INSERT INTO maintenance_teams (id, name, description, specialization, is_active) VALUES
('44444444-4444-4444-4444-444444444441', 'Mechanical Team', 'Handles all mechanical equipment including CNC machines, lathes, and mills', 'Mechanical', true),
('44444444-4444-4444-4444-444444444442', 'Electrical Team', 'Manages electrical systems, power distribution, and control panels', 'Electrical', true),
('44444444-4444-4444-4444-444444444443', 'IT & Computer Systems', 'Maintains computers, servers, networks, and software systems', 'Information Technology', true),
('44444444-4444-4444-4444-444444444444', 'HVAC & Climate Control', 'Heating, ventilation, air conditioning, and environmental systems', 'HVAC', true),
('44444444-4444-4444-4444-444444444445', 'Facilities & General', 'General facility maintenance, plumbing, and building infrastructure', 'Facilities', true);

-- =========================================================
-- 3. TEAM MEMBERS (Assign technicians to teams)
-- =========================================================

INSERT INTO team_members (team_id, user_id, is_team_leader) VALUES
-- Mechanical Team
('44444444-4444-4444-4444-444444444441', '33333333-3333-3333-3333-333333333331', true),  -- James Wilson (Leader)
('44444444-4444-4444-4444-444444444441', '33333333-3333-3333-3333-333333333332', false), -- Emily Davis

-- Electrical Team
('44444444-4444-4444-4444-444444444442', '33333333-3333-3333-3333-333333333333', true),  -- Carlos Rodriguez (Leader)
('44444444-4444-4444-4444-444444444442', '33333333-3333-3333-3333-333333333334', false), -- Jennifer Lee

-- IT Team
('44444444-4444-4444-4444-444444444443', '33333333-3333-3333-3333-333333333335', true),  -- David Thompson (Leader)

-- HVAC Team
('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333336', true);  -- Lisa Anderson (Leader)

-- =========================================================
-- 4. EQUIPMENT (Various types and statuses)
-- =========================================================

INSERT INTO equipment (id, serial_number, name, category, department, employee, location, purchase_date, warranty_expiry, status, maintenance_team_id) VALUES
-- Manufacturing Equipment
('55555555-5555-5555-5555-555555555551', 'CNC-2024-001', 'CNC Milling Machine Pro 3000', 'Manufacturing', 'Production', 'John Smith', 'Factory Floor A - Station 1', '2024-01-15', '2027-01-15', 'active', '44444444-4444-4444-4444-444444444441'),
('55555555-5555-5555-5555-555555555552', 'CNC-2024-002', 'CNC Lathe AutoTurn 5000', 'Manufacturing', 'Production', 'Maria Garcia', 'Factory Floor A - Station 3', '2024-03-20', '2027-03-20', 'active', '44444444-4444-4444-4444-444444444441'),
('55555555-5555-5555-5555-555555555553', 'DRILL-2023-015', 'Industrial Drill Press HD-500', 'Manufacturing', 'Production', 'Tom Anderson', 'Factory Floor B - Station 2', '2023-06-10', '2026-06-10', 'under_repair', '44444444-4444-4444-4444-444444444441'),
('55555555-5555-5555-5555-555555555554', 'WELD-2023-008', 'MIG Welder Industrial XL', 'Manufacturing', 'Production', 'Rachel Green', 'Factory Floor B - Station 5', '2023-09-05', '2026-09-05', 'active', '44444444-4444-4444-4444-444444444441'),

-- Electrical Equipment
('55555555-5555-5555-5555-555555555561', 'GEN-2023-001', 'Backup Generator 250kW', 'Electrical', 'Facilities', 'Maintenance Dept', 'Power Room - Building A', '2023-02-15', '2028-02-15', 'active', '44444444-4444-4444-4444-444444444442'),
('55555555-5555-5555-5555-555555555562', 'UPS-2024-005', 'UPS System 100kVA', 'Electrical', 'IT', 'Data Center Team', 'Server Room - Building B', '2024-05-20', '2029-05-20', 'active', '44444444-4444-4444-4444-444444444442'),
('55555555-5555-5555-5555-555555555563', 'PANEL-2022-012', 'Electrical Distribution Panel', 'Electrical', 'Facilities', 'Maintenance Dept', 'Electrical Room - Building C', '2022-11-30', '2027-11-30', 'active', '44444444-4444-4444-4444-444444444442'),

-- IT Equipment
('55555555-5555-5555-5555-555555555571', 'SRV-2024-001', 'Dell PowerEdge R750 Server', 'Computer', 'IT', 'System Administrator', 'Server Room - Rack A1', '2024-04-10', '2027-04-10', 'active', '44444444-4444-4444-4444-444444444443'),
('55555555-5555-5555-5555-555555555572', 'WS-2024-015', 'HP Z8 Workstation', 'Computer', 'Engineering', 'Jane Doe', 'Office Building B - Room 205', '2024-06-15', '2027-06-15', 'active', '44444444-4444-4444-4444-444444444443'),
('55555555-5555-5555-5555-555555555573', 'WS-2023-042', 'Dell Precision 7920', 'Computer', 'Design', 'Alex Turner', 'Office Building C - Room 301', '2023-08-22', '2026-08-22', 'active', '44444444-4444-4444-4444-444444444443'),
('55555555-5555-5555-5555-555555555574', 'NET-2023-001', 'Cisco Catalyst 9300 Switch', 'Network', 'IT', 'Network Admin', 'Server Room - Rack B2', '2023-10-05', '2028-10-05', 'active', '44444444-4444-4444-4444-444444444443'),
('55555555-5555-5555-5555-555555555575', 'PRINT-2022-008', 'HP LaserJet Enterprise', 'Computer', 'Admin', 'Office Manager', 'Office Building A - Floor 2', '2022-07-18', '2025-07-18', 'under_repair', '44444444-4444-4444-4444-444444444443'),

-- HVAC Equipment
('55555555-5555-5555-5555-555555555581', 'HVAC-2022-001', 'Carrier Chiller 150 Ton', 'HVAC', 'Facilities', 'HVAC Team', 'Rooftop - Building A', '2022-03-15', '2032-03-15', 'active', '44444444-4444-4444-4444-444444444444'),
('55555555-5555-5555-5555-555555555582', 'HVAC-2023-002', 'Trane Air Handler Unit', 'HVAC', 'Facilities', 'HVAC Team', 'Mechanical Room - Building B', '2023-05-22', '2033-05-22', 'active', '44444444-4444-4444-4444-444444444444'),
('55555555-5555-5555-5555-555555555583', 'AC-2023-015', 'Split AC Unit 5 Ton', 'HVAC', 'Admin', 'Office Manager', 'Conference Room - Building A', '2023-07-10', '2028-07-10', 'active', '44444444-4444-4444-4444-444444444444'),
('55555555-5555-5555-5555-555555555584', 'HVAC-2021-003', 'Boiler System Industrial', 'HVAC', 'Facilities', 'HVAC Team', 'Boiler Room - Building C', '2021-11-20', '2031-11-20', 'active', '44444444-4444-4444-4444-444444444444'),

-- Facilities Equipment
('55555555-5555-5555-5555-555555555591', 'LIFT-2023-001', 'Otis Elevator Passenger', 'Facilities', 'Building Mgmt', 'Facility Manager', 'Building A - Main Elevator', '2023-01-10', '2033-01-10', 'active', '44444444-4444-4444-4444-444444444445'),
('55555555-5555-5555-5555-555555555592', 'COMP-2022-005', 'Air Compressor 100HP', 'Facilities', 'Production', 'Production Manager', 'Compressor Room - Factory', '2022-09-15', '2027-09-15', 'active', '44444444-4444-4444-4444-444444444445'),
('55555555-5555-5555-5555-555555555593', 'FORK-2023-010', 'Toyota Forklift 5000lbs', 'Facilities', 'Warehouse', 'Warehouse Supervisor', 'Warehouse - Loading Dock', '2023-04-25', '2026-04-25', 'active', '44444444-4444-4444-4444-444444444445');

-- =========================================================
-- 5. MAINTENANCE REQUESTS (Mix of corrective and preventive)
-- =========================================================

INSERT INTO maintenance_requests (
  id, subject, type, description, stage, priority,
  equipment_id, equipment_name, equipment_category,
  maintenance_team_id, maintenance_team_name, technician,
  scheduled_date, duration, hours_spent, notes
) VALUES

-- CORRECTIVE REQUESTS (Breakdowns)

-- New Requests (Urgent Issues)
('66666666-6666-6666-6666-666666666601', 
 'CNC Machine Spindle Failure', 'corrective', 
 'The main spindle has stopped working. Machine shows error code E-502. Production is halted.',
 'new', 'high',
 '55555555-5555-5555-5555-555555555551', 'CNC Milling Machine Pro 3000', 'Manufacturing',
 '44444444-4444-4444-4444-444444444441', 'Mechanical Team', NULL,
 NULL, 8, 0, NULL),

('66666666-6666-6666-6666-666666666602',
 'Network Switch Port Failure', 'corrective',
 'Multiple ports on the main network switch are not responding. Affecting 15 workstations.',
 'new', 'high',
 '55555555-5555-5555-5555-555555555574', 'Cisco Catalyst 9300 Switch', 'Network',
 '44444444-4444-4444-4444-444444444443', 'IT & Computer Systems', NULL,
 NULL, 6, 0, NULL),

('66666666-6666-6666-6666-666666666603',
 'Printer Paper Jam Issue', 'corrective',
 'Printer consistently jamming on page 2 of every print job. Toner also needs replacement.',
 'new', 'low',
 '55555555-5555-5555-5555-555555555575', 'HP LaserJet Enterprise', 'Computer',
 '44444444-4444-4444-4444-444444444443', 'IT & Computer Systems', NULL,
 NULL, 2, 0, NULL),

-- In Progress Requests
('66666666-6666-6666-6666-666666666604',
 'Drill Press Motor Overheating', 'corrective',
 'Motor runs hot after 30 minutes of operation. Burning smell detected. Needs immediate attention.',
 'in_progress', 'high',
 '55555555-5555-5555-5555-555555555553', 'Industrial Drill Press HD-500', 'Manufacturing',
 '44444444-4444-4444-4444-444444444441', 'Mechanical Team', 'James Wilson',
 NULL, 10, 4.5, 'Motor bearings replaced. Testing thermal shutdown system.'),

('66666666-6666-6666-6666-666666666605',
 'UPS Battery Backup Failure', 'corrective',
 'UPS system failed during recent power test. Batteries not holding charge. Critical for server protection.',
 'in_progress', 'high',
 '55555555-5555-5555-5555-555555555562', 'UPS System 100kVA', 'Electrical',
 '44444444-4444-4444-4444-444444444442', 'Electrical Team', 'Carlos Rodriguez',
 NULL, 12, 6, 'Battery bank ordered. Testing individual cells. ETA 2 days for replacement.'),

('66666666-6666-6666-6666-666666666606',
 'Workstation Blue Screen Errors', 'corrective',
 'User reports frequent BSOD errors. Suspected RAM or driver issues.',
 'in_progress', 'medium',
 '55555555-5555-5555-5555-555555555572', 'HP Z8 Workstation', 'Computer',
 '44444444-4444-4444-4444-444444444443', 'IT & Computer Systems', 'David Thompson',
 NULL, 4, 2, 'Running memory diagnostics. May need RAM replacement.'),

-- Repaired/Completed Requests
('66666666-6666-6666-6666-666666666607',
 'Generator Oil Leak', 'corrective',
 'Oil leak detected from generator base. Pooling on floor. Environmental concern.',
 'repaired', 'high',
 '55555555-5555-5555-5555-555555555561', 'Backup Generator 250kW', 'Electrical',
 '44444444-4444-4444-4444-444444444442', 'Electrical Team', 'Carlos Rodriguez',
 NULL, 8, 7.5, 'Replaced oil pan gasket. Cleaned spill. Monitored for 24 hours. No further leaks.'),

('66666666-6666-6666-6666-666666666608',
 'Forklift Hydraulic Cylinder Leak', 'corrective',
 'Lift cylinder leaking hydraulic fluid. Fork not raising properly.',
 'repaired', 'medium',
 '55555555-5555-5555-5555-555555555593', 'Toyota Forklift 5000lbs', 'Facilities',
 '44444444-4444-4444-4444-444444444445', 'Facilities & General', 'Emily Davis',
 NULL, 6, 5.5, 'Replaced hydraulic cylinder seal. Refilled fluid. Tested under load.'),

('66666666-6666-6666-6666-666666666609',
 'Air Handler Belt Replacement', 'corrective',
 'Belt making squealing noise. Visibly worn and cracked.',
 'repaired', 'medium',
 '55555555-5555-5555-5555-555555555582', 'Trane Air Handler Unit', 'HVAC',
 '44444444-4444-4444-4444-444444444444', 'HVAC & Climate Control', 'Lisa Anderson',
 NULL, 3, 2.5, 'Replaced drive belt and tensioner. Aligned pulleys. Noise eliminated.'),

-- PREVENTIVE MAINTENANCE REQUESTS (Scheduled)

-- Upcoming Preventive Maintenance
('66666666-6666-6666-6666-666666666610',
 'Quarterly CNC Machine Calibration', 'preventive',
 'Routine calibration and accuracy check for CNC milling machine. Part of preventive schedule.',
 'scheduled', 'medium',
 '55555555-5555-5555-5555-555555555551', 'CNC Milling Machine Pro 3000', 'Manufacturing',
 '44444444-4444-4444-4444-444444444441', 'Mechanical Team', 'James Wilson',
 '2025-01-05', 6, 0, 'Scheduled for after production shift.'),

('66666666-6666-6666-6666-666666666611',
 'Monthly Server Maintenance', 'preventive',
 'Apply security patches, update firmware, check disk health and backup systems.',
 'scheduled', 'medium',
 '55555555-5555-5555-5555-555555555571', 'Dell PowerEdge R750 Server', 'Computer',
 '44444444-4444-4444-4444-444444444443', 'IT & Computer Systems', 'David Thompson',
 '2025-01-03', 4, 0, 'Scheduled during off-peak hours (2 AM - 6 AM).'),

('66666666-6666-6666-6666-666666666612',
 'Chiller Annual Inspection', 'preventive',
 'Comprehensive annual inspection: refrigerant levels, compressor, condenser coils, controls.',
 'scheduled', 'medium',
 '55555555-5555-5555-5555-555555555581', 'Carrier Chiller 150 Ton', 'HVAC',
 '44444444-4444-4444-4444-444444444444', 'HVAC & Climate Control', 'Lisa Anderson',
 '2025-01-10', 8, 0, 'Coordinate with HVAC contractor for refrigerant service.'),

('66666666-6666-6666-6666-666666666613',
 'Elevator Safety Inspection', 'preventive',
 'Monthly safety inspection: doors, cables, brakes, emergency systems, lighting.',
 'scheduled', 'high',
 '55555555-5555-5555-5555-555555555591', 'Otis Elevator Passenger', 'Facilities',
 '44444444-4444-4444-4444-444444444445', 'Facilities & General', 'Emily Davis',
 '2024-12-30', 4, 0, 'Required by building code. Must be completed on schedule.'),

-- Overdue Preventive Maintenance (Past due dates)
('66666666-6666-6666-6666-666666666614',
 'Lathe Lubrication Service', 'preventive',
 'Monthly lubrication of all moving parts, check oil levels, clean filters.',
 'scheduled', 'medium',
 '55555555-5555-5555-5555-555555555552', 'CNC Lathe AutoTurn 5000', 'Manufacturing',
 '44444444-4444-4444-4444-444444444441', 'Mechanical Team', 'James Wilson',
 '2024-12-20', 3, 0, 'OVERDUE - Reschedule ASAP. Production has been prioritized.'),

('66666666-6666-6666-6666-666666666615',
 'Distribution Panel Thermal Scan', 'preventive',
 'Thermal imaging scan to detect hot spots and potential failures.',
 'scheduled', 'high',
 '55555555-5555-5555-5555-555555555563', 'Electrical Distribution Panel', 'Electrical',
 '44444444-4444-4444-4444-444444444442', 'Electrical Team', 'Carlos Rodriguez',
 '2024-12-15', 2, 0, 'OVERDUE - Critical safety inspection. Schedule immediately.'),

-- Completed Preventive Maintenance
('66666666-6666-6666-6666-666666666616',
 'Air Compressor Filter Replacement', 'preventive',
 'Replace air filters and oil separator. Check for leaks.',
 'completed', 'low',
 '55555555-5555-5555-5555-555555555592', 'Air Compressor 100HP', 'Facilities',
 '44444444-4444-4444-4444-444444444445', 'Facilities & General', 'Emily Davis',
 '2024-12-22', 2, 1.5, 'Filters replaced. No leaks found. Compressor running efficiently.'),

('66666666-6666-6666-6666-666666666617',
 'Welding Equipment Safety Check', 'preventive',
 'Inspect gas lines, regulators, torches. Test emergency shutoff. Clean equipment.',
 'completed', 'medium',
 '55555555-5555-5555-5555-555555555554', 'MIG Welder Industrial XL', 'Manufacturing',
 '44444444-4444-4444-4444-444444444441', 'Mechanical Team', 'James Wilson',
 '2024-12-18', 2, 2, 'All safety checks passed. Equipment certified for operation.'),

('66666666-6666-6666-6666-666666666618',
 'Network Switch Firmware Update', 'preventive',
 'Apply latest firmware update from Cisco. Backup config before update.',
 'completed', 'medium',
 '55555555-5555-5555-5555-555555555574', 'Cisco Catalyst 9300 Switch', 'Network',
 '44444444-4444-4444-4444-444444444443', 'IT & Computer Systems', 'David Thompson',
 '2024-12-10', 3, 2.5, 'Firmware updated successfully. All ports tested. No issues.'),

-- In Progress Preventive Maintenance
('66666666-6666-6666-6666-666666666619',
 'Boiler Annual Inspection', 'preventive',
 'Annual inspection per insurance requirements: pressure test, safety valves, controls.',
 'in_progress', 'high',
 '55555555-5555-5555-5555-555555555584', 'Boiler System Industrial', 'HVAC',
 '44444444-4444-4444-4444-444444444444', 'HVAC & Climate Control', 'Lisa Anderson',
 '2024-12-27', 10, 6, 'Inspection in progress. Pressure vessel passed. Testing controls tomorrow.'),

('66666666-6666-6666-6666-666666666620',
 'Workstation Deep Clean & Optimization', 'preventive',
 'Clean internal components, update software, optimize startup programs.',
 'in_progress', 'low',
 '55555555-5555-5555-5555-555555555573', 'Dell Precision 7920', 'Computer',
 '44444444-4444-4444-4444-444444444443', 'IT & Computer Systems', 'David Thompson',
 '2024-12-28', 3, 1.5, 'Hardware cleaned. Installing Windows updates. Will optimize after reboot.');

-- =========================================================
-- 6. ACTIVITY LOG (Sample entries)
-- =========================================================

INSERT INTO request_activity_log (request_id, user_id, action, old_value, new_value) VALUES
('66666666-6666-6666-6666-666666666604', '33333333-3333-3333-3333-333333333331', 'Stage Changed', 'new', 'in_progress'),
('66666666-6666-6666-6666-666666666604', '33333333-3333-3333-3333-333333333331', 'Technician Assigned', NULL, 'James Wilson'),
('66666666-6666-6666-6666-666666666604', '33333333-3333-3333-3333-333333333331', 'Note Added', NULL, 'Motor bearings replaced'),
('66666666-6666-6666-6666-666666666607', '33333333-3333-3333-3333-333333333333', 'Stage Changed', 'in_progress', 'repaired'),
('66666666-6666-6666-6666-666666666607', '33333333-3333-3333-3333-333333333333', 'Hours Updated', '0', '7.5');

-- =========================================================
-- VERIFICATION QUERIES
-- =========================================================

-- Check data counts
SELECT 
  'Users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'Teams', COUNT(*) FROM maintenance_teams
UNION ALL
SELECT 'Team Members', COUNT(*) FROM team_members
UNION ALL
SELECT 'Equipment', COUNT(*) FROM equipment
UNION ALL
SELECT 'Maintenance Requests', COUNT(*) FROM maintenance_requests;

-- Check request distribution
SELECT 
  type,
  stage,
  priority,
  COUNT(*) as count
FROM maintenance_requests
GROUP BY type, stage, priority
ORDER BY type, stage, priority;

-- Check overdue requests
SELECT 
  subject,
  scheduled_date,
  CURRENT_DATE - scheduled_date as days_overdue
FROM maintenance_requests
WHERE scheduled_date < CURRENT_DATE
  AND stage NOT IN ('repaired', 'completed', 'scrap')
ORDER BY scheduled_date;

-- =========================================================
-- Sample Login Credentials
-- =========================================================
-- Email: admin@gearguard.com | Password: Admin@123 | Role: Admin
-- Email: manager1@gearguard.com | Password: Admin@123 | Role: Manager
-- Email: tech1@gearguard.com | Password: Admin@123 | Role: Technician
-- =========================================================
