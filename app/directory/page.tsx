"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Grid3X3, 
  Map,
  Users,
  Sparkles
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from "next/dynamic"

// Define the Member type
interface Member {
  id: string
  name: string
  initials: string
  title: string
  location: string
  coordinates: { lat: number; lng: number }
  email: string
  bio: string
  expertise: string[]
  skills: string[]
  joinDate: string
  cohort: string
  industry: string
  subgroups: string[]
  avatar: string
  isOnline: boolean
  color: string
  social: {
    linkedin?: string
    twitter?: string
    website?: string
    github?: string
  }
  lookingFor: string[]
  offering: string[]
  experience: {
    title: string
    company: string
    duration: string
    description: string
  }[]
  referrals: {
    organization: string
    type: string
    category: string
  }[]
}

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
}) as React.ComponentType<{ members: Member[] }>

export default function Directory() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
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

  const itemsPerPage = 15

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        
        // Helper function to safely parse JSON
        const safeJsonParse = (value: any): any[] => {
          if (!value) return []
          if (Array.isArray(value)) return value
          if (typeof value === 'string') {
            try {
              const parsed = JSON.parse(value)
              return Array.isArray(parsed) ? parsed : []
            } catch (e) {
              console.warn('Failed to parse:', value, e)
              return []
            }
          }
          return []
        }

        const formattedMembers = data.map((user: any) => ({
          id: user.id,
          name: user.name,
          initials: user.initials,
          title: user.profile?.title || 'Member',
          location: user.location || 'Unknown',
          coordinates: { lat: 0, lng: 0 },
          email: user.email,
          bio: user.bio || '',
          expertise: safeJsonParse(user.profile?.expertise),
          skills: safeJsonParse(user.profile?.skills),
          joinDate: new Date(user.createdAt).toLocaleDateString(),
          cohort: user.profile?.cohort || '',
          industry: '',
          subgroups: [],
          avatar: user.avatar,
          isOnline: false,
          color: 'blue',
          social: {
            linkedin: user.profile?.linkedin,
            twitter: user.profile?.twitter,
            website: user.profile?.website,
            github: user.profile?.github,
          },
          lookingFor: safeJsonParse(user.profile?.lookingFor),
          offering: safeJsonParse(user.profile?.offering),
          experience: safeJsonParse(user.profile?.experience),
          referrals: [],
        }))
        setMembers(formattedMembers)
        setFilteredMembers(formattedMembers)
      }
    } catch (error) {
      console.error('Error fetching members:', error)
    } finally {
      setLoading(false)
    }
  }

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
    console.log('Filtering members with active filters:', activeFilters)
    filterMembers()
  }, [activeFilters, sortBy, selectedFilter])

  // Add real-time search functionality
  useEffect(() => {
    if (searchQuery.trim()) {
      const delayedSearch = setTimeout(() => {
        console.log('Performing delayed search for:', searchQuery)
        performSearch()
      }, 300) // 300ms delay for better UX
      
      return () => clearTimeout(delayedSearch)
    } else {
      // Clear search when query is empty
      setActiveFilters(prev => ({ ...prev, query: "" }))
    }
  }, [searchQuery])

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
    console.log('Filtering members with filters:', activeFilters)
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

    console.log('Filtered members:', filtered.length, 'out of', members.length)
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
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Directory</h1>
            <p className="text-xs text-gray-600">Browse and connect with team members</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{members.length}</div>
              <div className="text-xs text-gray-500">Total Members</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search by name, title, or location..."
                className="pl-9 h-9 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && performSearch()}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-32 h-9 text-sm">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="social">Social Impact</SelectItem>
                <SelectItem value="tech">Technology</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={clearFilters} variant="outline" size="sm" className="h-9 px-3 text-sm">
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">
            {displayedMembers.length} of {filteredMembers.length} members
          </span>
        </div>
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "map")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="grid" className="flex items-center gap-2 text-xs">
              <Grid3X3 size={12} />
              Grid
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2 text-xs">
              <Map size={12} />
              Map
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <Tabs value={viewMode} className="w-full">
        <TabsContent value="grid" className="space-y-4">
          {/* Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {displayedMembers.length === 0 ? (
              <div className="col-span-full py-12 text-center">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mb-2">No members found</p>
                <p className="text-xs text-gray-400 mb-3">Try adjusting your search or filters</p>
                <Button onClick={clearFilters} variant="outline" size="sm">
                  Clear Filters
                </Button>
              </div>
            ) : (
              displayedMembers.map((member) => (
                <Link key={member.id} href={`/profile/${member.id}`}>
                  <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer border-gray-200 hover:border-blue-300">
                    <CardContent className="p-4">
                      {/* Avatar and Info */}
                      <div className="flex items-start gap-3">
                        <Avatar className="w-12 h-12 flex-shrink-0">
                          <AvatarFallback className={`${getAvatarColorClass(member.color)} text-white font-medium text-sm`}>
                            {member.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate text-xs group-hover:text-blue-600 transition-colors">
                            {member.name}
                          </h3>
                          <p className="text-xs text-gray-600 truncate mt-0.5">{member.title}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin size={10} className="text-gray-400 flex-shrink-0" />
                            <span className="text-xs text-gray-500 truncate">{member.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Section */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{member.industry}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={(e) => {
                              e.preventDefault()
                              // Handle view action
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-8 px-3 text-sm"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else {
                      // Show current page and surrounding pages
                      const start = Math.max(1, currentPage - 2);
                      const end = Math.min(totalPages, start + 4);
                      pageNumber = start + i;
                      if (pageNumber > end) return null;
                    }
                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                        className="w-8 h-8 text-sm"
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-8 px-3 text-sm"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="h-[500px] w-full">
                <MapView members={filteredMembers as Member[]} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
