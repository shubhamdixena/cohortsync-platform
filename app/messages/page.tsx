"use client"

import { useState, useEffect } from "react"
import { Search, Plus, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ConversationItem, ChatHeader, MessageBubble, MessageInput } from "./components"
import { Message, Conversation } from "./types"
import { useUser } from "@/lib/user-context"

export default function MessagesPage() {
  const { userInfo } = useUser()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState<string>("")
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (userInfo) {
      fetchConversations()
    }
  }, [userInfo])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation)
    }
  }, [selectedConversation])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations')
      if (response.ok) {
        const data = await response.json()
        // Format conversations for display
        const formatted = data.map((conv: any) => {
          const participants = JSON.parse(conv.participantIds)
          const lastMsg = conv.messages?.[conv.messages.length - 1]
          return {
            id: conv.id,
            userId: participants[0],
            name: conv.name || 'Conversation',
            lastMessage: lastMsg?.content || 'No messages yet',
            timestamp: lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString() : '',
            unread: 0,
            avatar: conv.name ? conv.name.substring(0, 2).toUpperCase() : 'CN',
            online: false,
            type: conv.type.toLowerCase(),
          }
        })
        setConversations(formatted)
        if (formatted.length > 0 && !selectedConversation) {
          setSelectedConversation(formatted[0].id)
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`)
      if (response.ok) {
        const data = await response.json()
        const formatted = data.map((msg: any) => ({
          id: msg.id,
          sender: msg.sender?.name || 'Unknown',
          content: msg.content,
          timestamp: new Date(msg.createdAt).toLocaleTimeString(),
          isOwn: msg.senderId === userInfo?.id,
        }))
        setMessages(formatted)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedConv = conversations.find((conv) => conv.id === selectedConversation)

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return
    
    setSending(true)
    try {
      const response = await fetch(`/api/conversations/${selectedConversation}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage })
      })
      
      if (response.ok) {
        setNewMessage("")
        fetchMessages(selectedConversation)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="h-[calc(100vh-8rem)]">
        <CardContent className="p-0 h-full flex">
          {/* Conversations List */}
          <div className="w-2/5 border-r border-gray-200 flex flex-col">
            <CardHeader className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Messages</h2>
              <Button variant="ghost" size="sm" className="p-2 h-auto">
                <Plus size={16} />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <Input
                type="text"
                placeholder="Search conversations..."
                className="pl-9 text-xs py-2 h-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>

          <ScrollArea className="flex-1">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversation === conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
              />
            ))}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <ChatHeader conversation={selectedConv} />

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-2">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <MessageInput
                value={newMessage}
                onChange={setNewMessage}
                onSend={handleSendMessage}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50/50">
              <Card className="w-80">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle size={20} className="text-blue-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600 mb-4 text-xs">Choose a conversation from the list to start messaging</p>
                  <Button variant="outline" className="w-full py-2 text-xs">
                    <Plus size={14} className="mr-1" />
                    Start New Conversation
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        </CardContent>
      </Card>
    </div>
  )
}
