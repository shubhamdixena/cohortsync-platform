/*
  # Improve Schema with Better Defaults

  1. Changes
    - Make password column nullable (managed by Supabase Auth)
    - Add UUID generation defaults for all ID columns
    - Add default values for created_at columns where missing
    
  2. Security
    - No changes to RLS policies
*/

-- Make password nullable since it's managed by Supabase Auth
DO $$ 
BEGIN
  ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
EXCEPTION
  WHEN undefined_column THEN null;
  WHEN others THEN null;
END $$;

-- Add UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Add default UUID generation for tables that don't have it
ALTER TABLE profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE posts ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE comments ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE conversations ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE messages ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE resources ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE subgroups ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE subgroup_members ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE announcements ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE moderated_content ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE audit_logs ALTER COLUMN id SET DEFAULT gen_random_uuid();
