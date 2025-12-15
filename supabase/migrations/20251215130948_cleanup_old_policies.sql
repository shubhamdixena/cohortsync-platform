/*
  # Cleanup Old RLS Policies

  This migration safely removes any conflicting RLS policies that may have been
  created on PascalCase table names from previous migrations.

  1. Changes
    - Drop policies on old PascalCase tables if they exist
    - Drop old PascalCase tables if they exist
    - Ensures clean state for correct snake_case schema

  2. Safety
    - Uses IF EXISTS to prevent errors
    - Idempotent - can be run multiple times safely
    - Does not affect correct snake_case tables
*/

-- Drop old policies on PascalCase tables if they exist
DO $$
BEGIN
  -- User table policies
  DROP POLICY IF EXISTS "Users can view their own profile" ON "User";
  DROP POLICY IF EXISTS "Users can update their own profile" ON "User";

  -- Profile table policies
  DROP POLICY IF EXISTS "Users can view their own profile data" ON "Profile";
  DROP POLICY IF EXISTS "Users can update their own profile data" ON "Profile";

  -- Post table policies
  DROP POLICY IF EXISTS "Posts are viewable by everyone" ON "Post";
  DROP POLICY IF EXISTS "Users can create posts" ON "Post";
  DROP POLICY IF EXISTS "Users can update their own posts" ON "Post";
  DROP POLICY IF EXISTS "Users can delete their own posts" ON "Post";

  -- Comment table policies
  DROP POLICY IF EXISTS "Comments are viewable by everyone" ON "Comment";
  DROP POLICY IF EXISTS "Users can create comments" ON "Comment";
  DROP POLICY IF EXISTS "Users can update their own comments" ON "Comment";
  DROP POLICY IF EXISTS "Users can delete their own comments" ON "Comment";

  -- Message table policies
  DROP POLICY IF EXISTS "Users can view their own messages" ON "Message";
  DROP POLICY IF EXISTS "Users can create messages" ON "Message";

  -- Conversation table policies
  DROP POLICY IF EXISTS "Users can view their conversations" ON "Conversation";
  DROP POLICY IF EXISTS "Users can create conversations" ON "Conversation";

  -- Resource table policies
  DROP POLICY IF EXISTS "Resources are viewable based on access level" ON "Resource";
  DROP POLICY IF EXISTS "Users can create resources" ON "Resource";
  DROP POLICY IF EXISTS "Users can update their own resources" ON "Resource";
  DROP POLICY IF EXISTS "Users can delete their own resources" ON "Resource";

  -- Subgroup table policies
  DROP POLICY IF EXISTS "Subgroups are viewable by everyone" ON "Subgroup";
  DROP POLICY IF EXISTS "Admins can create subgroups" ON "Subgroup";

  -- SubgroupMember table policies
  DROP POLICY IF EXISTS "Subgroup members are viewable by members" ON "SubgroupMember";
  DROP POLICY IF EXISTS "Users can join subgroups" ON "SubgroupMember";
  DROP POLICY IF EXISTS "Users can leave subgroups" ON "SubgroupMember";

  -- Announcement table policies
  DROP POLICY IF EXISTS "Published announcements are viewable by authenticated users" ON "Announcement";

  -- ModeratedContent table policies
  DROP POLICY IF EXISTS "Admins can view moderated content" ON "ModeratedContent";

  -- AuditLog table policies
  DROP POLICY IF EXISTS "Admins can view audit logs" ON "AuditLog";
EXCEPTION
  WHEN undefined_table THEN
    -- Tables don't exist, which is fine
    NULL;
  WHEN undefined_object THEN
    -- Policies don't exist, which is fine
    NULL;
END $$;

-- Drop old PascalCase tables if they exist
DROP TABLE IF EXISTS "AuditLog" CASCADE;
DROP TABLE IF EXISTS "ModeratedContent" CASCADE;
DROP TABLE IF EXISTS "Announcement" CASCADE;
DROP TABLE IF EXISTS "SubgroupMember" CASCADE;
DROP TABLE IF EXISTS "Subgroup" CASCADE;
DROP TABLE IF EXISTS "Resource" CASCADE;
DROP TABLE IF EXISTS "Message" CASCADE;
DROP TABLE IF EXISTS "Conversation" CASCADE;
DROP TABLE IF EXISTS "Comment" CASCADE;
DROP TABLE IF EXISTS "Post" CASCADE;
DROP TABLE IF EXISTS "Profile" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
