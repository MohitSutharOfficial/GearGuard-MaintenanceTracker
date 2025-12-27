-- =========================================================
-- FIX: Remove infinite recursion in RLS policies
-- Run this script in Supabase SQL Editor
-- =========================================================

-- Step 1: Drop all existing problematic policies
DROP POLICY IF EXISTS "Users can read all users" ON users;
DROP POLICY IF EXISTS "Admins can manage users" ON users;
DROP POLICY IF EXISTS "Admin/Manager can create equipment" ON equipment;
DROP POLICY IF EXISTS "Admin/Manager can update equipment" ON equipment;
DROP POLICY IF EXISTS "Admin can delete equipment" ON equipment;
DROP POLICY IF EXISTS "Users can update requests" ON maintenance_requests;
DROP POLICY IF EXISTS "Admin/Manager can delete requests" ON maintenance_requests;
DROP POLICY IF EXISTS "Admin/Manager can manage teams" ON maintenance_teams;

-- Step 2: Create simplified policies (no recursion)

-- Users table policies
CREATE POLICY "Authenticated can read users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can manage users"
  ON users FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Equipment table policies
CREATE POLICY "Authenticated can create equipment"
  ON equipment FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can update equipment"
  ON equipment FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can delete equipment"
  ON equipment FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Maintenance requests policies
CREATE POLICY "Authenticated can update requests"
  ON maintenance_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can delete requests"
  ON maintenance_requests FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Maintenance teams policies
CREATE POLICY "Authenticated can manage teams"
  ON maintenance_teams FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Step 3: Verify policies
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
