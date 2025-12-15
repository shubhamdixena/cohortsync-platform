"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@/lib/user-context"

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { currentRole } = useUser()

  const getMemberNavigation = () => [
    { name: "Community Wall", href: "/" },
    { name: "Member Directory", href: "/directory" },
    { name: "Messages", href: "/messages" },
    { name: "Resources", href: "/resources" },
    { name: "AI Search", href: "/ai-search" },
  ]

  const getAdminNavigation = () => [
    { name: "Dashboard", href: "/admin" },
    { name: "Members", href: "/admin/members" },
    { name: "Content", href: "/admin/content" },
    { name: "Resources", href: "/admin/resources" },
    { name: "Analytics", href: "/admin/analytics" },
  ]

  const getNavigation = () => {
    switch (currentRole) {
      case "admin":
        return getAdminNavigation()
      default:
        return getMemberNavigation()
    }
  }

  const navigation = getNavigation()

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsOpen(false)} />
          <div className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-lg font-semibold">Menu</span>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-md text-gray-400 hover:text-gray-500">
                <X size={20} />
              </button>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 rounded-md text-sm font-medium ${
                        pathname === item.href
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
