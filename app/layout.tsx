import type React from "react"
import type { Metadata } from "next"
// import { Inter } from "next/font/google"
import "./globals.css"
import { UserProvider } from "@/lib/user-context"
import { NotificationProvider } from "@/components/notifications/notification-provider"
import LayoutClient from "@/components/layout/layout-client"
import { Toaster } from "@/components/ui/toaster"

// const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CohortSync",
  description: "Connect and collaborate with your cohort",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <UserProvider>
          <NotificationProvider>
            <LayoutClient>
              {children}
            </LayoutClient>
            <Toaster />
          </NotificationProvider>
        </UserProvider>
      </body>
    </html>
  )
}
