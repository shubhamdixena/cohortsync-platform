"use client"

import { useEffect, useState } from "react"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { useNotifications } from "./notification-provider"

interface ToastNotification {
  id: string
  type: "info" | "success" | "warning" | "error"
  title: string
  message: string
}

export default function NotificationToast() {
  const [toasts, setToasts] = useState<ToastNotification[]>([])
  const { notifications } = useNotifications()

  useEffect(() => {
    // Show toast for new unread notifications
    const latestNotification = notifications[0]
    if (latestNotification && !latestNotification.read) {
      const toast: ToastNotification = {
        id: latestNotification.id,
        type: latestNotification.type,
        title: latestNotification.title,
        message: latestNotification.message,
      }

      setToasts((prev) => [toast, ...prev.slice(0, 2)]) // Keep max 3 toasts

      // Auto remove after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id))
      }, 5000)
    }
  }, [notifications])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} className="text-green-600" />
      case "error":
        return <AlertCircle size={20} className="text-red-600" />
      case "warning":
        return <AlertTriangle size={20} className="text-yellow-600" />
      default:
        return <Info size={20} className="text-blue-600" />
    }
  }

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getBackgroundColor(toast.type)} border rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-right duration-300`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">{getIcon(toast.type)}</div>
            <div className="ml-3 flex-grow">
              <h4 className="text-sm font-medium text-gray-900">{toast.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
