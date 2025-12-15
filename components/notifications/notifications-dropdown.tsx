"use client"

import { Bell, MessageCircle, UserPlus, Calendar } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "message",
    title: "New message from Sarah Chen",
    description: "Hey! I'd love to collaborate on your sustainability project...",
    time: "2 minutes ago",
    unread: true,
    icon: MessageCircle,
  },
  {
    id: 2,
    type: "connection",
    title: "Michael Rodriguez wants to connect",
    description: "You have a new connection request",
    time: "1 hour ago",
    unread: true,
    icon: UserPlus,
  },
  {
    id: 3,
    type: "event",
    title: "Upcoming: Social Impact Workshop",
    description: "Tomorrow at 2:00 PM - Don't forget to join!",
    time: "3 hours ago",
    unread: false,
    icon: Calendar,
  },
]

export default function NotificationsDropdown() {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <Bell size={20} className="text-gray-400" />
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
              notification.unread ? "bg-blue-50" : ""
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <notification.icon size={20} className="text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                <p className="text-sm text-gray-500 mt-1">{notification.description}</p>
                <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
              </div>
              {notification.unread && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-100">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
          View all notifications
        </button>
      </div>
    </div>
  )
}
