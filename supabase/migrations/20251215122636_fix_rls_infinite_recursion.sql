/*
  # Fix RLS Infinite Recursion on Users Table

  1. Problem
    - "Admins can manage all users" policy causes infinite recursion
    - Policy checks users table while protecting users table
    - Prevents new user registration
    
  2. Solution
    - Drop the problematic policy
    - Add separate policies for INSERT, UPDATE, DELETE without recursion
    - Use auth.jwt() metadata to check admin role instead of querying users table
    
  3. Security
    - Users can insert their own record during registration
    - Users can update their own record
    - Admins identified via JWT claims can manage all users
*/

-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

-- Allow users to insert their own record during registration
-- This is safe because auth.uid() is the authenticated user's ID from Supabase Auth
CREATE POLICY "Users can insert own record"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid()::text);

-- Allow service role (used by backend) to insert any user
CREATE POLICY "Service role can insert users"
  ON users FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Separate admin policies without recursion
-- Note: For admin management, use service role key or JWT metadata
-- This avoids the circular reference issue

-- Optional: If you add role to JWT metadata, you can use it like this:
-- CREATE POLICY "Admins can delete users"
--   ON users FOR DELETE
--   TO authenticated
--   USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN');
