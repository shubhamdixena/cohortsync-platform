"use client"

import { useState } from "react"
import { Send, Bot, User, Sparkles, Clock, TrendingUp } from "lucide-react"

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: string
}

const suggestedQueries = [
  "Find resources about startup funding",
  "Who are the tech entrepreneurs in Mumbai?",
  "Show me recent posts about social impact",
  "Connect me with marketing experts",
]

const recentSearches = [
  "Social entrepreneurs in Delhi",
  "Funding opportunities for startups",
  "Marketing strategies for B2B",
  "Tech meetups in Bangalore",
]

export default function AISearchPage() {
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your AI assistant. I can help you find members, resources, posts, and insights from the CohortSync community. What would you like to explore today?",
      timestamp: "Just now",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!query.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: query,
      timestamp: "Just now",
    }

    setMessages((prev) => [...prev, userMessage])
    setQuery("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `I found several relevant results for "${userMessage.content}". Here are some insights from the community:\n\n• 3 members match your criteria\n• 5 relevant resources available\n• 12 recent posts discussing this topic\n\nWould you like me to show you specific details about any of these categories?`,
        timestamp: "Just now",
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const handleSuggestedQuery = (suggestedQuery: string) => {
    setQuery(suggestedQuery)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Chat Container - Full height with compact design */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[calc(100vh-10rem)] flex flex-col">
        {/* Compact Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Sparkles className="text-blue-600" size={16} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">AI Search</h1>
              <p className="text-sm text-gray-500">Ask questions about your community</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === "ai" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                }`}
              >
                {message.type === "ai" ? <Bot size={14} /> : <User size={14} />}
              </div>
              <div
                className={`max-w-2xl px-3 py-2 rounded-lg ${
                  message.type === "user" ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                <p className={`text-xs mt-1 ${message.type === "user" ? "text-gray-600" : "text-gray-500"}`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                <Bot size={14} />
              </div>
              <div className="bg-gray-100 px-3 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Show suggestions only when no messages (empty state) */}
          {messages.length === 1 && !isLoading && (
            <div className="mt-8 space-y-4">
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-6">Try asking about:</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestedQueries.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuery(suggestion)}
                    className="p-3 text-sm text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors text-left"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              {recentSearches.length > 0 && (
                <div className="mt-6">
                  <p className="text-gray-600 text-sm mb-3">Recent searches:</p>
                  <div className="space-y-2">
                    {recentSearches.slice(0, 3).map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuery(search)}
                        className="flex items-center space-x-2 p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors w-full text-left"
                      >
                        <Clock size={14} />
                        <span>{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area - Always visible at bottom */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/50">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Ask me anything about your community..."
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-500 bg-white"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                disabled={!query.trim() || isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
