import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  message: {
    id: string
    sender: string
    content: string
    timestamp: string
    isOwn: boolean
  }
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={cn(
      "flex mb-3",
      message.isOwn ? "justify-end" : "justify-start"
    )}>
      <div
        className={cn(
          "max-w-sm lg:max-w-lg px-3 py-2 rounded-lg shadow-sm",
          message.isOwn 
            ? "bg-blue-600 text-white" 
            : "bg-gray-100 text-gray-900 border border-gray-200"
        )}
      >
        <p className="text-xs leading-relaxed">{message.content}</p>
        <p className={cn(
          "text-xs mt-1",
          message.isOwn ? "text-blue-100" : "text-gray-500"
        )}>
          {message.timestamp}
        </p>
      </div>
    </div>
  )
}
