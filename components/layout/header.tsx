"use client"

import type React from "react"
import Link from "next/link"
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Search, Bell, ChevronDown, User, LogOut } from "lucide-react"
import NotificationsDropdown from "@/components/notifications/notifications-dropdown"
import SearchResults from "@/components/search/search-results"
import { useUser, getDefaultRouteForRole } from "@/lib/user-context"
import MobileNavigation from "./mobile-navigation"
import { useNotifications } from "@/components/notifications/notification-provider"
import { supabase } from "@/lib/supabase"

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const notificationsRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { currentRole, userInfo } = useUser()
  const { unreadCount } = useNotifications()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    if (query.length > 2) {
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
    }
  }, [])

  const getRoleColor = useCallback((role: string) => {
    switch (role.toUpperCase()) {
      case "ADMIN":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="bg-white shadow-sm fixed top-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-blue-600 font-bold text-xl">
              CohortSync
            </Link>
            {currentRole === "ADMIN" && (
              <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(currentRole)}`}>
                Admin
              </span>
            )}
          </div>

          {/* Mobile Navigation - only show on mobile */}
          <div className="md:hidden ml-4">
            <MobileNavigation />
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex items-center">
            {/* Search - only show for members */}
            {currentRole === "MEMBER" && (
              <div className="relative mr-4" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Search members or posts..."
                  className="bg-gray-100 rounded-full py-2 px-4 text-sm w-64"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <button className="absolute right-3 top-2 text-gray-400">
                  <Search size={16} />
                </button>
                {showSearchResults && <SearchResults query={searchQuery} />}
              </div>
            )}

            <div className="flex items-center">
              <div className="relative" ref={notificationsRef}>
                <button
                  className="p-1 rounded-full text-gray-400 hover:text-blue-600 focus:outline-none"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && <NotificationsDropdown />}
              </div>

              <div className="relative ml-4" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="focus:outline-none"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      currentRole === "ADMIN"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {userInfo?.initials || userInfo?.name?.substring(0, 2).toUpperCase() || "U"}
                  </div>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="inline-block w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="inline-block w-4 h-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
