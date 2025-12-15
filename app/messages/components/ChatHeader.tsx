import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Info, MoreVertical } from "lucide-react"

interface ChatHeaderProps {
  conversation: {
    id: string
    userId: string
    name: string
    avatar: string
    online: boolean
    type: 'direct' | 'group'
  }
}

export function ChatHeader({ conversation }: ChatHeaderProps) {
  return (
    <div className="p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href={conversation.type === 'direct' ? `/profile/${conversation.userId}` : '#'}>
            <div className="relative cursor-pointer">
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
          <div>
            <Link href={conversation.type === 'direct' ? `/profile/${conversation.userId}` : '#'}>
              <h3 className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer text-sm">
                {conversation.name}
              </h3>
            </Link>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-xs text-gray-500">
                {conversation.online ? "Online" : "Last seen 2h ago"}
              </p>
              {conversation.type === 'group' && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                  Group
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="p-1.5 h-auto">
            <Info size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="p-1.5 h-auto">
            <MoreVertical size={14} />
          </Button>
        </div>
      </div>
    </div>
  )
}
