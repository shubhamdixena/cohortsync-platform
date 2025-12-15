"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Users,
  MessageCircle,
  BookOpen,
  Search,
  BarChart3,
  Settings,
  Megaphone,
  UserPlus,
  Layers,
  TrendingUp,
} from "lucide-react"
import { useUser } from "@/lib/user-context"
import { cn } from "@/lib/utils"

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  badge?: string
}

export default function Sidebar() {
  const pathname = usePathname()
  const { currentRole, userInfo, isLoading } = useUser()

  // Render sidebar placeholder to avoid layout shift while loading
  const sidebarContent = isLoading ? (
    <div className="pt-6 pb-4 border-b border-gray-200 animate-pulse">
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-gray-200"></div>
        <div className="ml-3 flex-1">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  ) : (
    <div className="pt-6 pb-4 border-b border-gray-200">
      <div className="flex items-center">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
            currentRole === "ADMIN"
              ? "bg-blue-100 text-blue-600"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          {currentRole === "ADMIN" ? "A" : (userInfo?.initials || "U")}
        </div>
        <div className="ml-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {userInfo?.name || "User"}
          </h2>
          <p className="text-sm text-gray-600">
            {userInfo?.profile?.title || userInfo?.bio || userInfo?.email || "Member"}
          </p>
        </div>
      </div>
    </div>
  )

  const getMemberNavigation = (): NavigationItem[] => [
    { name: "Community Wall", href: "/", icon: Home },
    { name: "Member Directory", href: "/directory", icon: Users },
    { name: "Messages", href: "/messages", icon: MessageCircle },
    { name: "Resources", href: "/resources", icon: BookOpen },
    { name: "AI Search", href: "/ai-search", icon: Search },
  ]

  const getAdminNavigation = (): NavigationItem[] => [
    { name: "Dashboard", href: "/admin", icon: BarChart3 },
    { name: "Members", href: "/admin/members", icon: Users },
    { name: "Content", href: "/admin/content", icon: MessageCircle },
    { name: "Resources", href: "/admin/resources", icon: BookOpen },
    { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
    { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
    { name: "Sub-Groups", href: "/admin/subgroups", icon: Layers },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  const getNavigation = () => {
    switch (currentRole) {
      case "ADMIN":
        return getAdminNavigation()
      default:
        return getMemberNavigation()
    }
  }

  const navigation = getNavigation()

  const getActiveColor = () => {
    switch (currentRole) {
      case "admin":
        return "bg-blue-50 text-blue-700 border-blue-200"
      default:
        return "bg-blue-50 text-blue-700 border-blue-200"
    }
  }

  const getIconColor = (isActive: boolean) => {
    if (isActive) {
      switch (currentRole) {
        case "admin":
          return "text-blue-600"
        default:
          return "text-blue-600"
      }
    }
    return "text-gray-500 group-hover:text-gray-700"
  }

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:pt-16 lg:z-40">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
        {/* User Profile Section */}
        {sidebarContent}

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex gap-x-3 rounded-lg p-3 text-sm font-medium transition-colors items-center",
                          isActive ? getActiveColor() : "text-gray-700 hover:text-gray-900 hover:bg-gray-50",
                        )}
                      >
                        <item.icon className={cn("h-5 w-5 shrink-0 transition-colors", getIconColor(isActive))} />
                        <span className="tracking-tight flex-1">{item.name}</span>
                        {item.badge && (
                          <span className="ml-auto bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>

            {/* Sub-groups for members only */}
            {currentRole === "MEMBER" && (
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-500 uppercase tracking-wider mb-3">
                  My Sub-Groups
                </div>
                <ul role="list" className="-mx-2 space-y-1">
                  {userInfo?.profile?.subgroups && Array.isArray(userInfo.profile.subgroups) && userInfo.profile.subgroups.length > 0 ? (
                    userInfo.profile.subgroups.map((group: string, index: number) => (
                      <li key={index}>
                        <Link
                          href={`/subgroups/${index}`}
                          className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 group flex gap-x-3 rounded-lg p-2.5 text-sm font-medium transition-colors"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                            {group.charAt(0).toUpperCase()}
                          </span>
                          <span className="truncate tracking-tight">{group}</span>
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="px-2 text-sm text-gray-500 italic">
                      No sub-groups joined yet
                    </li>
                  )}
                </ul>
              </li>
            )}

            {/* Quick Actions for Admin */}
            {currentRole === "ADMIN" && (
              <li className="mt-auto">
                <div className="text-xs font-semibold leading-6 text-gray-500 uppercase tracking-wider mb-3">
                  Quick Actions
                </div>
                <div className="space-y-2">
                  <button className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center justify-center transition-colors">
                    <UserPlus size={16} className="mr-2" /> Add Member
                  </button>
                  <button className="w-full bg-green-600 text-white py-2 rounded-md text-sm font-medium hover:bg-green-700 flex items-center justify-center transition-colors">
                    <Megaphone size={16} className="mr-2" /> Announcement
                  </button>
                </div>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
