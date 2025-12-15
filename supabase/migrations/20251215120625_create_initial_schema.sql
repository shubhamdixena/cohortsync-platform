/*
  # Create Initial Database Schema

  1. Enums
    - UserRole (MEMBER, ADMIN)
    - MemberStatus (ACTIVE, PENDING, SUSPENDED, INACTIVE)
    - ConversationType (DIRECT, GROUP)
    - AccessLevel (PUBLIC, MEMBERS_ONLY, ADMIN_ONLY)
    - SubgroupRole (MEMBER, MODERATOR)
    - AnnouncementStatus (DRAFT, PUBLISHED, ARCHIVED)
    - AnnouncementPriority (LOW, NORMAL, HIGH, URGENT)
    - ReportStatus (PENDING, REVIEWING, RESOLVED, DISMISSED)

  2. Tables
    - users: Core user information
    - profiles: Extended user profile data
    - posts: Community posts
    - comments: Post comments
    - conversations: Direct and group conversations
    - messages: Conversation messages
    - resources: Shared resources and documents
    - subgroups: Interest groups and communities
    - subgroup_members: Subgroup membership
    - announcements: Admin announcements
    - moderated_content: Content moderation reports
    - audit_logs: System audit trail

  3. Security
    - Enable RLS on all tables
    - Create policies for authenticated users to manage their own data
    - Admin-specific policies for moderation and announcements
*/

-- ============================================================================
-- ENUMS
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('MEMBER', 'ADMIN');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE member_status AS ENUM ('ACTIVE', 'PENDING', 'SUSPENDED', 'INACTIVE');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE conversation_type AS ENUM ('DIRECT', 'GROUP');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE access_level AS ENUM ('PUBLIC', 'MEMBERS_ONLY', 'ADMIN_ONLY');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE subgroup_role AS ENUM ('MEMBER', 'MODERATOR');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE announcement_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE announcement_priority AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE report_status AS ENUM ('PENDING', 'REVIEWING', 'RESOLVED', 'DISMISSED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- USERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  email text UNIQUE NOT NULL,
  password text,
  name text NOT NULL,
  initials text NOT NULL,
  role user_role DEFAULT 'MEMBER' NOT NULL,
  status member_status DEFAULT 'ACTIVE' NOT NULL,
  avatar text,
  bio text,
  location text,
  phone text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view active members"
  ON users FOR SELECT
  TO authenticated
  USING (status = 'ACTIVE' OR id = auth.uid()::text);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid()::text)
  WITH CHECK (id = auth.uid()::text);

CREATE POLICY "Admins can manage all users"
  ON users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id text PRIMARY KEY,
  user_id text UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text,
  bio text,
  phone text,
  website text,
  linkedin text,
  twitter text,
  github text,
  skills text,
  expertise text,
  experience text,
  education text,
  looking_for text,
  offering text,
  joined_date timestamptz,
  cohort text,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view profiles of active members"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = profiles.user_id
      AND (users.status = 'ACTIVE' OR users.id = auth.uid()::text)
    )
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid()::text);

-- ============================================================================
-- POSTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS posts (
  id text PRIMARY KEY,
  author_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  image text,
  tags text,
  category text,
  likes int DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (author_id = auth.uid()::text);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid()::text)
  WITH CHECK (author_id = auth.uid()::text);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (author_id = auth.uid()::text);

CREATE POLICY "Admins can manage all posts"
  ON posts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

-- ============================================================================
-- COMMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS comments (
  id text PRIMARY KEY,
  post_id text NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  likes int DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (author_id = auth.uid()::text);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid()::text)
  WITH CHECK (author_id = auth.uid()::text);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (author_id = auth.uid()::text);

-- ============================================================================
-- CONVERSATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS conversations (
  id text PRIMARY KEY,
  type conversation_type NOT NULL,
  name text,
  description text,
  participant_ids text NOT NULL,
  last_message_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_conversations_type ON conversations(type);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (participant_ids::jsonb ? auth.uid()::text);

CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (participant_ids::jsonb ? auth.uid()::text);

CREATE POLICY "Participants can update conversations"
  ON conversations FOR UPDATE
  TO authenticated
  USING (participant_ids::jsonb ? auth.uid()::text)
  WITH CHECK (participant_ids::jsonb ? auth.uid()::text);

-- ============================================================================
-- MESSAGES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS messages (
  id text PRIMARY KEY,
  conversation_id text NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_read boolean DEFAULT false NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.participant_ids::jsonb ? auth.uid()::text
    )
  );

CREATE POLICY "Users can create messages in their conversations"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid()::text AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.participant_ids::jsonb ? auth.uid()::text
    )
  );

CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid()::text OR 
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.participant_ids::jsonb ? auth.uid()::text
    )
  )
  WITH CHECK (sender_id = auth.uid()::text OR 
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.participant_ids::jsonb ? auth.uid()::text
    )
  );

-- ============================================================================
-- RESOURCES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS resources (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  type text NOT NULL,
  category text NOT NULL,
  url text,
  file_url text,
  file_size int,
  downloads int DEFAULT 0 NOT NULL,
  featured boolean DEFAULT false NOT NULL,
  access_level access_level DEFAULT 'MEMBERS_ONLY' NOT NULL,
  uploaded_by_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tags text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_resources_uploaded_by_id ON resources(uploaded_by_id);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_access_level ON resources(access_level);
CREATE INDEX IF NOT EXISTS idx_resources_featured ON resources(featured);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public resources"
  ON resources FOR SELECT
  TO authenticated
  USING (
    access_level = 'PUBLIC' OR
    access_level = 'MEMBERS_ONLY' OR
    (access_level = 'ADMIN_ONLY' AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'ADMIN'
    ))
  );

CREATE POLICY "Users can create resources"
  ON resources FOR INSERT
  TO authenticated
  WITH CHECK (uploaded_by_id = auth.uid()::text);

CREATE POLICY "Users can update own resources"
  ON resources FOR UPDATE
  TO authenticated
  USING (uploaded_by_id = auth.uid()::text)
  WITH CHECK (uploaded_by_id = auth.uid()::text);

CREATE POLICY "Admins can manage all resources"
  ON resources FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

-- ============================================================================
-- SUBGROUPS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS subgroups (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  type text NOT NULL,
  category text,
  icon text,
  color text,
  image text,
  location text,
  is_active boolean DEFAULT true NOT NULL,
  tags text,
  moderators text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_subgroups_type ON subgroups(type);

ALTER TABLE subgroups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active subgroups"
  ON subgroups FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage subgroups"
  ON subgroups FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

-- ============================================================================
-- SUBGROUP_MEMBERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS subgroup_members (
  id text PRIMARY KEY,
  subgroup_id text NOT NULL REFERENCES subgroups(id) ON DELETE CASCADE,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role subgroup_role DEFAULT 'MEMBER' NOT NULL,
  joined_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(subgroup_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_subgroup_members_subgroup_id ON subgroup_members(subgroup_id);
CREATE INDEX IF NOT EXISTS idx_subgroup_members_user_id ON subgroup_members(user_id);

ALTER TABLE subgroup_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view subgroup members"
  ON subgroup_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join subgroups"
  ON subgroup_members FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can leave subgroups"
  ON subgroup_members FOR DELETE
  TO authenticated
  USING (user_id = auth.uid()::text);

CREATE POLICY "Moderators can manage subgroup members"
  ON subgroup_members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM subgroup_members sm
      WHERE sm.subgroup_id = subgroup_members.subgroup_id
      AND sm.user_id = auth.uid()::text
      AND sm.role = 'MODERATOR'
    ) OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

-- ============================================================================
-- ANNOUNCEMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS announcements (
  id text PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  priority announcement_priority DEFAULT 'NORMAL' NOT NULL,
  status announcement_status DEFAULT 'DRAFT' NOT NULL,
  category text,
  target_audience text,
  views int DEFAULT 0 NOT NULL,
  reactions int DEFAULT 0 NOT NULL,
  created_by_id text NOT NULL,
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (status = 'PUBLISHED');

CREATE POLICY "Admins can manage announcements"
  ON announcements FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

-- ============================================================================
-- MODERATED_CONTENT TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS moderated_content (
  id text PRIMARY KEY,
  content_type text NOT NULL,
  content_id text NOT NULL,
  reported_by text NOT NULL,
  reason text NOT NULL,
  description text,
  status report_status DEFAULT 'PENDING' NOT NULL,
  action_taken text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE moderated_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can report content"
  ON moderated_content FOR INSERT
  TO authenticated
  WITH CHECK (reported_by = auth.uid()::text);

CREATE POLICY "Admins can manage moderated content"
  ON moderated_content FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

-- ============================================================================
-- AUDIT_LOGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id text PRIMARY KEY,
  action text NOT NULL,
  user_id text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  changes text,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);
