"use client"

import { useState } from "react"
import Link from "next/link"
import { useUser } from "@/lib/user-context"
import { cohorts, members } from "@/lib/data"
import {
  Users,
  Calendar,
  MapPin,
  Edit,
  Plus,
  Search,
  MoreVertical,
  Eye,
  Settings,
  BarChart3,
  Mail,
  FileText,
  Target,
  UserPlus,
  Megaphone,
  Users2,
} from "lucide-react"

export default function AdminCohortsPage() {
  const { userInfo } = useUser()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCohorts = cohorts.filter((cohort) => cohort.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-bold">
                  A
                </div>
                <div className="ml-3">
                  <h2 className="text-sm font-semibold">Admin</h2>
                  <p className="text-xs text-gray-600">{userInfo?.role || "Administrator"}</p>
                </div>
              </div>
            </div>
            <nav className="py-2">
              <Link
                href="/admin"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 font-medium text-xs"
              >
                <BarChart3 size={16} className="mr-3" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/admin/members"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 font-medium text-xs"
              >
                <Users size={16} className="mr-3" />
                <span>Member Management</span>
              </Link>
              <Link
                href="/admin/content"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 font-medium text-xs"
              >
                <FileText size={16} className="mr-3" />
                <span>Content Moderation</span>
              </Link>
              <Link
                href="/admin/resources"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 font-medium text-xs"
              >
                <FileText size={16} className="mr-3" />
                <span>Resource Management</span>
              </Link>
              <Link
                href="/admin/cohorts"
                className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 border-l-4 border-blue-600 font-medium text-xs"
              >
                <Target size={16} className="mr-3" />
                <span>Cohort Management</span>
              </Link>
              <Link
                href="/admin/analytics"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 font-medium text-xs"
              >
                <BarChart3 size={16} className="mr-3" />
                <span>Analytics</span>
              </Link>
              <Link
                href="/admin/announcements"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 font-medium text-xs"
              >
                <Megaphone size={16} className="mr-3" />
                <span>Announcements</span>
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium text-sm"
              >
                <Settings size={20} className="mr-3" />
                <span>Community Settings</span>
              </Link>
              <Link
                href="/admin/messages"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium text-sm"
              >
                <Mail size={20} className="mr-3" />
                <span>Messages</span>
                <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  2 new
                </span>
              </Link>
            </nav>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow mt-6 p-4">
            <h3 className="font-medium text-gray-900 mb-4 text-sm">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center">
                <UserPlus size={16} className="mr-2" />
                Add New Member
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center">
                <Megaphone size={16} className="mr-2" />
                Create Announcement
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center">
                <Users2 size={16} className="mr-2" />
                Create Sub-Group
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center">
                <Target size={16} className="mr-2" />
                Create New Cohort
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Cohort Management</h1>
                <p className="text-gray-600 mt-1">Manage and edit cohort pages and information</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search cohorts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-100 rounded-md py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <Search size={16} />
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center">
                  <Plus size={16} className="mr-1" /> New Cohort
                </button>
              </div>
            </div>
          </div>

          {/* Cohorts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCohorts.map((cohort) => {
              const cohortMembers = members.filter(
                (member) =>
                  member.cohort.toLowerCase().includes(cohort.name.toLowerCase().split(" ")[0])
              )

              return (
                <div
                  key={cohort.id}
                  className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                    <img
                      src={cohort.coverImage || "/placeholder.svg"}
                      alt={cohort.name}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-2 left-4 text-white">
                      <h3 className="text-lg font-bold">{cohort.name}</h3>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          cohort.status === "completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {cohort.status === "completed" ? "Completed" : "Active"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{cohort.description}</p>

                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-600">{cohortMembers.length}</div>
                        <div className="text-xs text-gray-600">Members</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">{cohort.enterprises}</div>
                        <div className="text-xs text-gray-600">Enterprises</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600">{cohort.year}</div>
                        <div className="text-xs text-gray-600">Year</div>
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-gray-600 mb-4">
                      <MapPin size={12} className="mr-1" />
                      {cohort.location}
                      <Calendar size={12} className="ml-3 mr-1" />
                      {cohort.duration}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Link
                          href={`/cohorts/${cohort.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                        >
                          <Eye size={14} className="mr-1" />
                          View Page
                        </Link>
                        <button className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center">
                          <Edit size={14} className="mr-1" />
                          Edit
                        </button>
                      </div>
                      <div className="relative">
                        <button className="p-1 text-gray-500 hover:text-gray-700">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Empty State */}
          {filteredCohorts.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <Target size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cohorts found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "No cohorts match your search criteria." : "Get started by creating your first cohort."}
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Create New Cohort
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
