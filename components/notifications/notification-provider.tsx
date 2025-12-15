"use client"

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react"

interface Notification {
  id: string
  type: "info" | "success" | "warning" | "error"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  setUnreadCount: (count: number) => void
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "warning",
      title: "Pending Member Approval",
      message: "3 new members are waiting for approval",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      actionUrl: "/admin/members?tab=pending",
    },
    {
      id: "2",
      type: "error",
      title: "Content Flagged",
      message: "A post has been flagged for inappropriate content",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: false,
      actionUrl: "/admin/content",
    },
    {
      id: "3",
      type: "success",
      title: "New Resource Added",
      message: "Impact Measurement Toolkit has been published",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      read: true,
      actionUrl: "/admin/resources",
    },
    {
      id: "4",
      type: "info",
      title: "Weekly Report Ready",
      message: "Your community analytics report is available",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      actionUrl: "/admin/analytics",
    },
  ])

  const [unreadCount, setUnreadCount] = useState(notifications.filter((n) => !n.read).length)

  const addNotification = useCallback((notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev])
    setUnreadCount((prev) => prev + 1)
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    setUnreadCount(0)
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }, [])

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new notifications (for demo purposes)
      if (Math.random() < 0.1) {
        // 10% chance every 30 seconds
        const notificationTypes = [
          {
            type: "info" as const,
            title: "New Member Joined",
            message: "A new member has joined the community",
            actionUrl: "/admin/members",
          },
          {
            type: "warning" as const,
            title: "Low Engagement Alert",
            message: "Community engagement has dropped by 15%",
            actionUrl: "/admin/analytics",
          },
          {
            type: "success" as const,
            title: "Goal Achieved",
            message: "Monthly active users target reached!",
            actionUrl: "/admin/analytics",
          },
        ]

        const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]
        addNotification(randomNotification)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [addNotification])

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    setUnreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
  }), [notifications, unreadCount, addNotification, markAsRead, markAllAsRead, removeNotification])

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
