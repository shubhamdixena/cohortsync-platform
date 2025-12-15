-- Enable Row Level Security for all tables
-- This is a Supabase migration file for RLS policies

-- User table RLS
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON "User" FOR SELECT
  USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own profile"
  ON "User" FOR UPDATE
  USING (auth.uid()::text = id)
  WITH CHECK (auth.uid()::text = id);

-- Profile table RLS
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile data"
  ON "Profile" FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can update their own profile data"
  ON "Profile" FOR UPDATE
  USING (auth.uid()::text = "userId")
  WITH CHECK (auth.uid()::text = "userId");

-- Post table RLS
ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are viewable by everyone"
  ON "Post" FOR SELECT
  USING (true);

CREATE POLICY "Users can create posts"
  ON "Post" FOR INSERT
  WITH CHECK (auth.uid()::text = "authorId");

CREATE POLICY "Users can update their own posts"
  ON "Post" FOR UPDATE
  USING (auth.uid()::text = "authorId")
  WITH CHECK (auth.uid()::text = "authorId");

CREATE POLICY "Users can delete their own posts"
  ON "Post" FOR DELETE
  USING (auth.uid()::text = "authorId");

-- Comment table RLS
ALTER TABLE "Comment" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone"
  ON "Comment" FOR SELECT
  USING (true);

CREATE POLICY "Users can create comments"
  ON "Comment" FOR INSERT
  WITH CHECK (auth.uid()::text = "authorId");

CREATE POLICY "Users can update their own comments"
  ON "Comment" FOR UPDATE
  USING (auth.uid()::text = "authorId")
  WITH CHECK (auth.uid()::text = "authorId");

CREATE POLICY "Users can delete their own comments"
  ON "Comment" FOR DELETE
  USING (auth.uid()::text = "authorId");

-- Message table RLS
ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages"
  ON "Message" FOR SELECT
  USING (
    auth.uid()::text = "senderId"
    OR auth.uid()::text = ANY(
      string_to_array(
        (SELECT "participantIds" FROM "Conversation" WHERE id = "conversationId"),
        ','
      )
    )
  );

CREATE POLICY "Users can create messages"
  ON "Message" FOR INSERT
  WITH CHECK (auth.uid()::text = "senderId");

-- Conversation table RLS
ALTER TABLE "Conversation" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their conversations"
  ON "Conversation" FOR SELECT
  USING (
    auth.uid()::text = ANY(
      string_to_array("participantIds", ',')
    )
  );

CREATE POLICY "Users can create conversations"
  ON "Conversation" FOR INSERT
  WITH CHECK (true);

-- Resource table RLS
ALTER TABLE "Resource" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Resources are viewable based on access level"
  ON "Resource" FOR SELECT
  USING (
    "accessLevel" = 'PUBLIC'
    OR ("accessLevel" = 'MEMBERS_ONLY' AND auth.role() = 'authenticated')
    OR ("accessLevel" = 'ADMIN_ONLY' AND 
        (SELECT role FROM "User" WHERE id = auth.uid()::text LIMIT 1) = 'ADMIN')
  );

CREATE POLICY "Users can create resources"
  ON "Resource" FOR INSERT
  WITH CHECK (auth.uid()::text = "uploadedById");

CREATE POLICY "Users can update their own resources"
  ON "Resource" FOR UPDATE
  USING (auth.uid()::text = "uploadedById")
  WITH CHECK (auth.uid()::text = "uploadedById");

CREATE POLICY "Users can delete their own resources"
  ON "Resource" FOR DELETE
  USING (auth.uid()::text = "uploadedById");

-- Subgroup table RLS
ALTER TABLE "Subgroup" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subgroups are viewable by everyone"
  ON "Subgroup" FOR SELECT
  USING (true);

CREATE POLICY "Admins can create subgroups"
  ON "Subgroup" FOR INSERT
  WITH CHECK (
    (SELECT role FROM "User" WHERE id = auth.uid()::text LIMIT 1) = 'ADMIN'
  );

-- SubgroupMember table RLS
ALTER TABLE "SubgroupMember" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subgroup members are viewable by members"
  ON "SubgroupMember" FOR SELECT
  USING (true);

CREATE POLICY "Users can join subgroups"
  ON "SubgroupMember" FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can leave subgroups"
  ON "SubgroupMember" FOR DELETE
  USING (auth.uid()::text = "userId");

-- Announcement table RLS
ALTER TABLE "Announcement" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published announcements are viewable by authenticated users"
  ON "Announcement" FOR SELECT
  USING (
    "status" = 'PUBLISHED'
    OR (auth.role() = 'authenticated' AND 
        (SELECT role FROM "User" WHERE id = auth.uid()::text LIMIT 1) = 'ADMIN')
  );

-- ModeratedContent table RLS
ALTER TABLE "ModeratedContent" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view moderated content"
  ON "ModeratedContent" FOR SELECT
  USING (
    (SELECT role FROM "User" WHERE id = auth.uid()::text LIMIT 1) = 'ADMIN'
  );

-- AuditLog table RLS
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
  ON "AuditLog" FOR SELECT
  USING (
    (SELECT role FROM "User" WHERE id = auth.uid()::text LIMIT 1) = 'ADMIN'
  );
