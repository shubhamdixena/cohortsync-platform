import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
}

export function MessageInput({ value, onChange, onSend }: MessageInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSend()
    }
  }

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Type a message..."
            className="text-xs py-2 px-3 h-8"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <Button
          onClick={onSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 h-8 text-xs"
          disabled={!value.trim()}
        >
          <Send size={12} className="mr-1" />
          Send
        </Button>
      </div>
    </div>
  )
}
