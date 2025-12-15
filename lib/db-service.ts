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
    .from('User')
    .select('*, profile:Profile(*)')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}

export async function getUserById(userId: string, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('User')
    .select('*, profile:Profile(*)')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function getAllUsers(supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('User')
    .select('*, profile:Profile(*)')
    .order('createdAt', { ascending: false })

  if (error) throw error
  return data
}

export async function updateUser(userId: string, updates: Partial<Tables['User']['Update']>, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('User')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProfile(userId: string, updates: Partial<Tables['Profile']['Update']>, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  // First try to get existing profile
  const { data: existingProfile, error: selectError } = await client
    .from('Profile')
    .select('id')
    .eq('userId', userId)
    .single()

  if (selectError && selectError.code !== 'PGRST116') {
    // Error other than "not found"
    throw selectError
  }

  if (existingProfile) {
    // Update existing profile
    const { data, error } = await client
      .from('Profile')
      .update(updates)
      .eq('userId', userId)
      .select()
      .single()

    if (error) throw error
    return data
  } else {
    // Create new profile
    const { data, error } = await client
      .from('Profile')
      .insert({
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36),
        userId,
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
    .from('Post')
    .select(`
      *,
      author:User(
        id, 
        name, 
        initials, 
        avatar, 
        role,
        profile:Profile(title)
      ),
      comments:Comment(
        *,
        author:User(id, name, initials, avatar)
      )
    `)
    .order('createdAt', { ascending: false })
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
    .from('Post')
    .select(`
      *,
      author:User(
        id, 
        name, 
        initials, 
        avatar, 
        role,
        profile:Profile(title)
      ),
      comments:Comment(
        *,
        author:User(id, name, initials, avatar)
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

export async function createPost(post: Tables['Post']['Insert'], supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('Post')
    .insert(post)
    .select(`
      *,
      author:User(id, name, initials, avatar, role)
    `)
    .single()

  if (error) throw error
  return data
}

export async function updatePost(postId: string, updates: Tables['Post']['Update'], supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('Post')
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
    .from('Post')
    .delete()
    .eq('id', postId)

  if (error) throw error
}

// ============================================================================
// COMMENT OPERATIONS
// ============================================================================

export async function createComment(comment: Tables['Comment']['Insert'], supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('Comment')
    .insert(comment)
    .select(`
      *,
      author:User(id, name, initials, avatar)
    `)
    .single()

  if (error) throw error
  return data
}

export async function deleteComment(commentId: string, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { error } = await client
    .from('Comment')
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
    .from('Conversation')
    .select(`
      *,
      messages:Message(*)
    `)
    .contains('participantIds', userId)
    .order('lastMessageAt', { ascending: false })

  if (error) throw error
  return data
}

export async function getConversationMessages(conversationId: string, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('Message')
    .select(`
      *,
      sender:User(id, name, initials, avatar)
    `)
    .eq('conversationId', conversationId)
    .order('createdAt', { ascending: true })

  if (error) throw error
  return data
}

export async function createConversation(conversation: Tables['Conversation']['Insert'], supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('Conversation')
    .insert(conversation)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function sendMessage(message: Tables['Message']['Insert'], supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('Message')
    .insert(message)
    .select(`
      *,
      sender:User(id, name, initials, avatar)
    `)
    .single()

  if (error) throw error

  // Update conversation lastMessageAt
  await client
    .from('Conversation')
    .update({ lastMessageAt: new Date().toISOString() })
    .eq('id', message.conversationId)

  return data
}

export async function markMessageAsRead(messageId: string, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { error } = await client
    .from('Message')
    .update({ isRead: true, readAt: new Date().toISOString() })
    .eq('id', messageId)

  if (error) throw error
}

// ============================================================================
// RESOURCE OPERATIONS
// ============================================================================

export async function getResources(supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('Resource')
    .select(`
      *,
      uploadedBy:User(id, name, initials, avatar)
    `)
    .order('createdAt', { ascending: false })

  if (error) throw error
  return data
}

export async function createResource(resource: Tables['Resource']['Insert'], supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('Resource')
    .insert(resource)
    .select(`
      *,
      uploadedBy:User(id, name, initials, avatar)
    `)
    .single()

  if (error) throw error
  return data
}

export async function updateResource(resourceId: string, updates: Tables['Resource']['Update'], supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('Resource')
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
    .from('Resource')
    .delete()
    .eq('id', resourceId)

  if (error) throw error
}

export async function incrementResourceDownloads(resourceId: string, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data: resource } = await client
    .from('Resource')
    .select('downloads')
    .eq('id', resourceId)
    .single()

  if (resource) {
    await client
      .from('Resource')
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
    .from('Announcement')
    .select('*')
    .order('createdAt', { ascending: false })

  if (error) throw error
  return data
}

export async function createAnnouncement(announcement: Tables['Announcement']['Insert'], supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('Announcement')
    .insert(announcement)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateAnnouncement(announcementId: string, updates: Tables['Announcement']['Update'], supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('Announcement')
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
    .from('Announcement')
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
    .from('Subgroup')
    .select(`
      *,
      members:SubgroupMember(
        *,
        user:User(id, name, initials, avatar)
      )
    `)
    .order('createdAt', { ascending: false })

  if (error) throw error
  return data
}

export async function createSubgroup(subgroup: Tables['Subgroup']['Insert'], supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('Subgroup')
    .insert(subgroup)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function joinSubgroup(subgroupId: string, userId: string, supabaseClient?: SupabaseClient) {
  const client = supabaseClient || supabase
  const { data, error } = await client
    .from('SubgroupMember')
    .insert({
      id: crypto.randomUUID(),
      subgroupId,
      userId,
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
    .from('SubgroupMember')
    .delete()
    .eq('subgroupId', subgroupId)
    .eq('userId', userId)

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
      .from('User')
      .select('*, profile:Profile(*)')
      .or(`name.ilike.%${lowerQuery}%,email.ilike.%${lowerQuery}%,bio.ilike.%${lowerQuery}%`)
      .limit(10),
    client
      .from('Post')
      .select('*, author:User(id, name, initials, avatar)')
      .ilike('content', `%${lowerQuery}%`)
      .limit(10),
    client
      .from('Resource')
      .select('*, uploadedBy:User(id, name, initials, avatar)')
      .or(`title.ilike.%${lowerQuery}%,description.ilike.%${lowerQuery}%`)
      .limit(10)
  ])

  return {
    users: users.data || [],
    posts: posts.data || [],
    resources: resources.data || []
  }
}
