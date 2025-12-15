import { supabase } from './supabase'
import { Database } from '@/types/database.types'
import { SupabaseClient } from '@supabase/supabase-js'

type Tables = Database['public']['Tables']
type User = Tables['User']['Row']
type Post = Tables['Post']['Row']
type Comment = Tables['Comment']['Row']
type Message = Tables['Message']['Row']
type Conversation = Tables['Conversation']['Row']
type Resource = Tables['Resource']['Row']
type Profile = Tables['Profile']['Row']
type Announcement = Tables['Announcement']['Row']
type Subgroup = Tables['Subgroup']['Row']
type SubgroupMember = Tables['SubgroupMember']['Row']

// ============================================================================
// USER OPERATIONS
// ============================================================================

export async function getCurrentUser(supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data: { user } } = await client.auth.getUser()
  if (!user) return null

  const { data, error } = await client
    .from('users')
    .select('*, profile:profiles(*)')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}

export async function getUserById(userId: string, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('users')
    .select('*, profile:profiles(*)')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function getAllUsers(supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('users')
    .select('*, profile:profiles(*)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updateUser(userId: string, updates: any, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProfile(userId: string, updates: any, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  // First try to get existing profile
  const { data: existingProfile, error: selectError } = await client
    .from('profiles')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (selectError && selectError.code !== 'PGRST116') {
    // Error other than "not found"
    throw selectError
  }

  if (existingProfile) {
    // Update existing profile
    const { data, error } = await client
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  } else {
    // Create new profile
    const { data, error } = await client
      .from('profiles')
      .insert({
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36),
        user_id: userId,
        updated_at: new Date().toISOString(),
        ...updates
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// ============================================================================
// POST OPERATIONS
// ============================================================================

export async function getPosts(limit = 50, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('posts')
    .select(`
      *,
      author:users(
        id,
        name,
        initials,
        avatar,
        role,
        profile:profiles(title)
      ),
      comments:comments(
        *,
        author:users(id, name, initials, avatar)
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  // Transform data to match UI expectations (flatten profile title)
  return data.map((post: any) => ({
    ...post,
    author: {
      ...post.author,
      title: post.author.profile?.title || 'Member'
    }
  }))
}

export async function getPostById(postId: string, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('posts')
    .select(`
      *,
      author:users(
        id,
        name,
        initials,
        avatar,
        role,
        profile:profiles(title)
      ),
      comments:comments(
        *,
        author:users(id, name, initials, avatar)
      )
    `)
    .eq('id', postId)
    .single()

  if (error) throw error

  return {
    ...data,
    author: {
      ...data.author,
      title: (data.author as any).profile?.title || 'Member'
    }
  }
}

export async function createPost(post: any, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('posts')
    .insert(post)
    .select(`
      *,
      author:users(id, name, initials, avatar, role)
    `)
    .single()

  if (error) throw error
  return data
}

export async function updatePost(postId: string, updates: any, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('posts')
    .update(updates)
    .eq('id', postId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deletePost(postId: string, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { error } = await client
    .from('posts')
    .delete()
    .eq('id', postId)

  if (error) throw error
}

// ============================================================================
// COMMENT OPERATIONS
// ============================================================================

export async function createComment(comment: any, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('comments')
    .insert(comment)
    .select(`
      *,
      author:users(id, name, initials, avatar)
    `)
    .single()

  if (error) throw error
  return data
}

export async function deleteComment(commentId: string, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { error } = await client
    .from('comments')
    .delete()
    .eq('id', commentId)

  if (error) throw error
}

// ============================================================================
// MESSAGE OPERATIONS
// ============================================================================

export async function getConversations(userId: string, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('conversations')
    .select(`
      *,
      messages:messages(*)
    `)
    .contains('participant_ids', userId)
    .order('last_message_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getConversationMessages(conversationId: string, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('messages')
    .select(`
      *,
      sender:users(id, name, initials, avatar)
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function createConversation(conversation: any, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('conversations')
    .insert(conversation)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function sendMessage(message: any, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('messages')
    .insert(message)
    .select(`
      *,
      sender:users(id, name, initials, avatar)
    `)
    .single()

  if (error) throw error

  // Update conversation last_message_at
  await client
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', message.conversation_id)

  return data
}

export async function markMessageAsRead(messageId: string, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { error } = await client
    .from('messages')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', messageId)

  if (error) throw error
}

// ============================================================================
// RESOURCE OPERATIONS
// ============================================================================

export async function getResources(supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('resources')
    .select(`
      *,
      uploadedBy:users!uploaded_by_id(id, name, initials, avatar)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createResource(resource: any, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('resources')
    .insert(resource)
    .select(`
      *,
      uploadedBy:users!uploaded_by_id(id, name, initials, avatar)
    `)
    .single()

  if (error) throw error
  return data
}

export async function updateResource(resourceId: string, updates: any, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('resources')
    .update(updates)
    .eq('id', resourceId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteResource(resourceId: string, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { error } = await client
    .from('resources')
    .delete()
    .eq('id', resourceId)

  if (error) throw error
}

export async function incrementResourceDownloads(resourceId: string, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data: resource } = await client
    .from('resources')
    .select('downloads')
    .eq('id', resourceId)
    .single()

  if (resource) {
    await client
      .from('resources')
      .update({ downloads: (resource.downloads || 0) + 1 })
      .eq('id', resourceId)
  }
}

// ============================================================================
// ANNOUNCEMENT OPERATIONS (ADMIN)
// ============================================================================

export async function getAnnouncements(supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createAnnouncement(announcement: any, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('announcements')
    .insert(announcement)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateAnnouncement(announcementId: string, updates: any, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('announcements')
    .update(updates)
    .eq('id', announcementId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteAnnouncement(announcementId: string, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { error } = await client
    .from('announcements')
    .delete()
    .eq('id', announcementId)

  if (error) throw error
}

// ============================================================================
// SUBGROUP OPERATIONS
// ============================================================================

export async function getSubgroups(supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('subgroups')
    .select(`
      *,
      members:subgroup_members(
        *,
        user:users(id, name, initials, avatar)
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createSubgroup(subgroup: any, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('subgroups')
    .insert(subgroup)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function joinSubgroup(subgroupId: string, userId: string, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('subgroup_members')
    .insert({
      id: crypto.randomUUID(),
      subgroup_id: subgroupId,
      user_id: userId,
      role: 'MEMBER'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function leaveSubgroup(subgroupId: string, userId: string, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { error } = await client
    .from('subgroup_members')
    .delete()
    .eq('subgroup_id', subgroupId)
    .eq('user_id', userId)

  if (error) throw error
}

// ============================================================================
// SEARCH OPERATIONS
// ============================================================================

export async function searchAll(query: string, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const lowerQuery = query.toLowerCase()

  const [users, posts, resources] = await Promise.all([
    client
      .from('users')
      .select('*, profile:profiles(*)')
      .or(`name.ilike.%${lowerQuery}%,email.ilike.%${lowerQuery}%,bio.ilike.%${lowerQuery}%`)
      .limit(10),
    client
      .from('posts')
      .select('*, author:users(id, name, initials, avatar)')
      .ilike('content', `%${lowerQuery}%`)
      .limit(10),
    client
      .from('resources')
      .select('*, uploadedBy:users!uploaded_by_id(id, name, initials, avatar)')
      .or(`title.ilike.%${lowerQuery}%,description.ilike.%${lowerQuery}%`)
      .limit(10)
  ])

  return {
    users: users.data || [],
    posts: posts.data || [],
    resources: resources.data || []
  }
}
