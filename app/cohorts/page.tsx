"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cohorts as initialCohorts, currentUser } from "@/lib/data"
import { Calendar, MapPin } from "lucide-react"

export default function CohortsPage() {
  const [cohorts, setCohorts] = useState(initialCohorts)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const response = await fetch('/api/cohorts')
        if (response.ok) {
          const data = await response.json()
          if (data && Array.isArray(data) && data.length > 0) {
            // Ensure data matches the shape we expect
            setCohorts(data)
          }
        }
      } catch (error) {
        console.error("Failed to fetch cohorts", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCohorts()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10">
      <div className="flex flex-col md:flex-row">
        {/* Left Sidebar - Navigation */}
        <div className="w-full md:w-1/4 pr-0 md:pr-6 mb-6 md:mb-0">
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="flex flex-col">
              <Link href="/" className="px-6 py-4 text-gray-500 hover:text-blue-600 font-medium text-sm">
                Community Wall
              </Link>
              <Link href="/directory" className="px-6 py-4 text-gray-500 hover:text-blue-600 font-medium text-sm">
                Member Directory
              </Link>
              <Link href="/resources" className="px-6 py-4 text-gray-500 hover:text-blue-600 font-medium text-sm">
                Resources
              </Link>
              <Link href="/ai-search" className="px-6 py-4 text-gray-500 hover:text-blue-600 font-medium text-sm">
                AI Search
              </Link>
              <Link
                href="/cohorts"
                className="px-6 py-4 text-blue-600 border-l-4 border-blue-600 bg-blue-50 font-medium text-sm"
              >
                All Cohorts
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium text-gray-900 mb-4">My Sub-Groups</h3>
            <ul>
              {currentUser?.subgroups && currentUser.subgroups.length > 0 ? (
                currentUser.subgroups.map((group, index) => (
                  <li key={index} className="flex items-center py-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        index === 0 ? "bg-blue-600" : index === 1 ? "bg-green-600" : index === 2 ? "bg-purple-600" : "bg-yellow-600"
                      }`}
                    ></span>
                    <Link href="#" className="ml-2 text-sm text-gray-700 hover:text-blue-600">
                      {group}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">No sub-groups yet</li>
              )}
            </ul>
            <button className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-md text-sm font-medium hover:bg-gray-200">
              <Link href="#" className="block w-full h-full">
                Browse All Sub-Groups
              </Link>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full md:w-3/4">
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow mb-6 p-6">
            <h1 className="text-xl font-bold text-gray-900 mb-2">All Cohorts</h1>
            <p className="text-gray-600 text-sm">Explore different cohort communities and their journeys</p>
          </div>

          {/* Cohorts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cohorts.map((cohort) => (
              <div
                key={cohort.id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 relative">
                  <img
                    src={cohort.image || "/placeholder.svg"}
                    alt={cohort.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h2 className="text-base font-bold">{cohort.name}</h2>
                    <p className="text-xs opacity-90">{cohort.category}</p>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cohort.isActive ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {cohort.isActive ? "Active" : "Completed"}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{cohort.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-sm font-bold text-blue-600">{cohort.memberCount}</div>
                      <div className="text-xs text-gray-600">Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-green-600">{cohort.isActive ? 'Active' : 'Inactive'}</div>
                      <div className="text-xs text-gray-600">Status</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-xs text-gray-600">
                      <Calendar size={14} className="mr-2" />
                      {cohort.createdAt ? new Date(cohort.createdAt).toLocaleDateString() : 'Date TBA'}
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <MapPin size={14} className="mr-2" />
                      {cohort.location || 'Location TBA'}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {cohort.tags && Array.isArray(cohort.tags) && cohort.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                    {cohort.tags && Array.isArray(cohort.tags) && cohort.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{cohort.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/cohorts/${cohort.id}`}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors text-center block"
                  >
                    Explore Cohort
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
