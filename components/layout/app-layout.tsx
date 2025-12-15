"use client"
import type { ReactNode } from "react"
import Header from "./header"
import Sidebar from "./sidebar"
import RightSidebar from "./right-sidebar"
import Footer from "./footer"

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        <RightSidebar />
      </div>
      <Footer />
    </div>
  )
}
