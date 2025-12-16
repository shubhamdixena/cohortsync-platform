"use client"

import React, { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import Header from "./header"
import Sidebar from "./sidebar"

interface LayoutClientProps {
  children: React.ReactNode
}

export default function LayoutClient({ children }: LayoutClientProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { userInfo, isLoading } = useUser()

  // Pages that should NOT have header and sidebar
  const publicPages = ['/login', '/register', '/welcome-wizard']
  const shouldShowLayout = !publicPages.some(page => pathname.startsWith(page))

  // Redirect to login if not authenticated and not on a public page
  useEffect(() => {
    if (!isLoading && !userInfo && !publicPages.some(page => pathname.startsWith(page))) {
      router.push('/login')
    }
  }, [userInfo, isLoading, pathname, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!shouldShowLayout) {
    return <div className="min-h-screen bg-gray-50">{children}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="lg:pl-64">
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
        </div>
      </main>
    </div>
  )
}
