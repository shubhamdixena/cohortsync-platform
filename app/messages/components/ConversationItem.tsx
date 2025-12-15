import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ConversationItemProps {
  conversation: {
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
  isSelected: boolean
  onClick: () => void
}

export function ConversationItem({ conversation, isSelected, onClick }: ConversationItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-3 border-b border-gray-100 cursor-pointer transition-all duration-200",
        isSelected 
          ? "bg-blue-50 border-blue-200 border-l-4 border-l-blue-500" 
          : "hover:bg-gray-50"
      )}
    >
      <div className="flex items-start space-x-3">
        <Link href={conversation.type === 'direct' ? `/profile/${conversation.userId}` : '#'}>
          <div className="relative">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-xs">
                {conversation.avatar}
              </AvatarFallback>
            </Avatar>
            {conversation.online && (
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
            )}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <Link href={conversation.type === 'direct' ? `/profile/${conversation.userId}` : '#'}>
              <h3 className="font-medium text-gray-900 truncate hover:text-blue-600 cursor-pointer text-xs">
                {conversation.name}
              </h3>
            </Link>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">{conversation.timestamp}</span>
              {conversation.type === 'group' && (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  Group
                </Badge>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-600 truncate mt-1 leading-relaxed">{conversation.lastMessage}</p>
        </div>
        {conversation.unread > 0 && (
          <Badge className="bg-blue-600 text-white text-xs font-medium rounded-full min-w-[1rem] h-4 flex items-center justify-center">
            {conversation.unread}
          </Badge>
        )}
      </div>
    </div>
  )
}
