export interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  isOwn: boolean
}

export interface Conversation {
  id: string
  userId: string
  name: string
  lastMessage: string
  timestamp: string
  unread: number
  avatar: string
  online: boolean
  type: 'direct' | 'group'
}

export interface User {
  id: string
  name: string
  avatar: string
  online: boolean
}
