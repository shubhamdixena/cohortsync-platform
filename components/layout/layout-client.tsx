"use client"

import React from "react"
import { usePathname } from "next/navigation"
import Header from "./header"
import Sidebar from "./sidebar"

interface LayoutClientProps {
  children: React.ReactNode
}

export default function LayoutClient({ children }: LayoutClientProps) {
  const pathname = usePathname()
  
  // Pages that should NOT have header and sidebar
  const publicPages = ['/login', '/register', '/welcome-wizard']
  const shouldShowLayout = !publicPages.some(page => pathname.startsWith(page))
  
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
