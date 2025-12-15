"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { members } from "@/lib/data"
import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Grid3X3, 
  Map,
  Users,
  ChevronDown,
  Sparkles,
  Clock,
  Star
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from "next/dynamic"

// Dynamically import the map component to avoid SSR issues
const MapView = dynamic(() => import("./components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Loading map...</p>
      </div>
    </div>
  )
})

export default function Directory() {
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredMembers, setFilteredMembers] = useState(members)
  const [activeFilters, setActiveFilters] = useState({
    cohort: "",
    location: "",
    industry: "",
    subgroup: "",
    query: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid")

  const itemsPerPage = 12

  // Color mapping function for avatar backgrounds
  const getAvatarColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      emerald: "bg-emerald-500",
      purple: "bg-purple-500",
      yellow: "bg-yellow-500",
      red: "bg-red-500",
      orange: "bg-orange-500",
      pink: "bg-pink-500",
      indigo: "bg-indigo-500",
      teal: "bg-teal-500",
    }
    return colorMap[color] || "bg-gray-500"
  }

  useEffect(() => {
    filterMembers()
  }, [activeFilters, sortBy, selectedFilter])

  const performSearch = () => {
    if (searchQuery) {
      const newFilters = { ...activeFilters, query: searchQuery }

      // Special handling for industry-specific queries
      if (searchQuery.toLowerCase().includes("fashion")) {
        newFilters.industry = "Fashion"
      } else if (searchQuery.toLowerCase().includes("tech") || searchQuery.toLowerCase().includes("technology")) {
        newFilters.industry = "Technology"
      } else if (searchQuery.toLowerCase().includes("social impact")) {
        newFilters.industry = "Social Impact"
      }

      // Special handling for location queries
      if (searchQuery.toLowerCase().includes("mumbai")) {
        newFilters.location = "Mumbai"
      } else if (searchQuery.toLowerCase().includes("delhi")) {
        newFilters.location = "Delhi"
      } else if (searchQuery.toLowerCase().includes("bangalore")) {
        newFilters.location = "Bangalore"
      }

      setActiveFilters(newFilters)
    }
  }

  const filterMembers = () => {
    const filtered = members.filter((member) => {
      // Apply cohort filter
      if (activeFilters.cohort && !member.cohort.includes(activeFilters.cohort)) {
        return false
      }

      // Apply location filter
      if (activeFilters.location && !member.location.includes(activeFilters.location)) {
        return false
      }

      // Apply industry filter
      if (activeFilters.industry && member.industry !== activeFilters.industry) {
        return false
      }

      // Apply subgroup filter
      if (activeFilters.subgroup && !member.subgroups.includes(activeFilters.subgroup)) {
        return false
      }

      // Apply search query
      if (activeFilters.query) {
        const searchTerms = activeFilters.query.toLowerCase()
        const memberText =
          `${member.name} ${member.title} ${member.location} ${member.cohort} ${member.industry} ${member.subgroups.join(" ")}`.toLowerCase()
        return memberText.includes(searchTerms)
      }

      // Apply selected filter
      if (selectedFilter !== "all" && !member.subgroups.some(subgroup => subgroup.toLowerCase().includes(selectedFilter.toLowerCase()))) {
        return false
      }

      return true
    })

    // Apply sorting
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "recent":
        filtered.sort(() => Math.random() - 0.5)
        break
      case "cohort":
        filtered.sort((a, b) => b.cohort.localeCompare(a.cohort))
        break
    }

    setFilteredMembers(filtered)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setActiveFilters({
      cohort: "",
      location: "",
      industry: "",
      subgroup: "",
      query: "",
    })
    setSearchQuery("")
    setSelectedFilter("all")
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, filteredMembers.length)
  const displayedMembers = filteredMembers.slice(startIndex, endIndex)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Member Directory</h1>
        <p className="text-gray-600 text-lg">Connect with fellow cohort members and expand your network</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search members by name, title, location, or expertise..."
              className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && performNaturalLanguageSearch()}
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors p-1 rounded"
              onClick={performNaturalLanguageSearch}
            >
              <Search size={16} />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <Filter className="text-gray-400" size={20} />
            <select
              className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white min-w-[140px]"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Groups</option>
              <option value="mumbai">Mumbai Chapter</option>
              <option value="social">Social Entrepreneurs</option>
              <option value="tech">Tech Innovators</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedMembers.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-base mb-2">No members found matching your criteria</p>
            <p className="text-gray-400 text-xs mb-4">Try adjusting your search or filters</p>
            <button 
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors" 
              onClick={clearFilters}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          displayedMembers.map((member) => (
            <Link key={member.id} href={`/profile/${member.id}`}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer group">
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${getAvatarColorClass(member.color)} group-hover:scale-105 transition-transform shadow-sm`}
                  >
                    {member.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors text-sm">
                      {member.name}
                    </h3>
                    <p className="text-xs text-gray-600 truncate mt-1">{member.title}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <MapPin size={12} className="mr-1 flex-shrink-0" />
                      <span className="truncate">{member.location}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center min-w-0 flex-1">
                      <Briefcase size={12} className="mr-1 flex-shrink-0" />
                      <span className="truncate">{member.subgroups[0] || 'General'}</span>
                    </div>
                    <div className="flex items-center ml-4 flex-shrink-0">
                      <Calendar size={12} className="mr-1" />
                      <span>Joined {member.joinDate}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getStatus(member.isOnline) === "online"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-gray-100 text-gray-800 border border-gray-200"
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        getStatus(member.isOnline) === "online" ? "bg-green-600" : "bg-gray-400"
                      }`} />
                      {getStatus(member.isOnline)}
                    </span>
                    <button
                      className="text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors opacity-0 group-hover:opacity-100 hover:bg-blue-50 px-3 py-1 rounded-md"
                      onClick={(e) => {
                        e.preventDefault()
                        // Handle connect action
                      }}
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <nav className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          <button
            className="px-4 py-2 rounded-md text-xs font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="mx-6 text-xs text-gray-700 font-medium">
            Page {currentPage} of {totalPages} ({filteredMembers.length} members)
          </span>
          <button
            className="px-4 py-2 rounded-md text-xs font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  )
}
