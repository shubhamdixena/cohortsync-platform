// types/api.ts

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationQuery {
  page?: number
  limit?: number
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

// Member/User Types
export interface CreateMemberInput {
  email: string
  password: string
  name: string
  initials: string
  location?: string
  bio?: string
}

export interface UpdateMemberInput {
  name?: string
  email?: string
  bio?: string
  location?: string
  phone?: string
  avatar?: string
}

export interface MemberResponse {
  id: string
  email: string
  name: string
  initials: string
  role: 'MEMBER' | 'ADMIN'
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'INACTIVE'
  avatar?: string
  bio?: string
  location?: string
  createdAt: string
  updatedAt: string
}

// Post Types
export interface CreatePostInput {
  content: string
  image?: string
  tags?: string[]
  category?: string
}

export interface PostResponse {
  id: string
  authorId: string
  author: {
    id: string
    name: string
    initials: string
    avatar?: string
    title?: string
  }
  content: string
  image?: string
  tags?: string[]
  likes: number
  commentCount: number
  createdAt: string
  updatedAt: string
}

// Message Types
export interface CreateMessageInput {
  conversationId: string
  content: string
}

export interface MessageResponse {
  id: string
  conversationId: string
  senderId: string
  sender: {
    id: string
    name: string
    initials: string
    avatar?: string
  }
  content: string
  isRead: boolean
  createdAt: string
}

// Resource Types
export interface CreateResourceInput {
  title: string
  description?: string
  type: string
  category: string
  url?: string
  accessLevel: 'PUBLIC' | 'MEMBERS_ONLY' | 'ADMIN_ONLY'
  tags?: string[]
}

export interface ResourceResponse {
  id: string
  title: string
  description?: string
  type: string
  category: string
  url?: string
  downloads: number
  featured: boolean
  accessLevel: string
  uploadedBy: {
    id: string
    name: string
  }
  tags?: string[]
  createdAt: string
}

// Error Types
export interface ApiError {
  code: string
  message: string
  details?: any
}

// Auth Types
export interface LoginInput {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: MemberResponse
}

export interface RegisterInput {
  email: string
  password: string
  name: string
  location?: string
}

// Subgroup Types
export interface CreateSubgroupInput {
  name: string
  description?: string
  type: string
  icon?: string
  color?: string
}

export interface SubgroupResponse {
  id: string
  name: string
  description?: string
  type: string
  icon?: string
  color?: string
  memberCount: number
  createdAt: string
}
