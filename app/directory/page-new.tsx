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
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-100">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-blue-100/20"></div>
        </div>
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="text-blue-600" size={24} />
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                  {filteredMembers.length} Members
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Member Directory</h1>
              <p className="text-gray-600 text-lg">Connect with fellow cohort members from across India</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{members.length}</div>
                <div className="text-sm text-gray-600">Total Members</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{members.filter(m => m.isOnline).length}</div>
                <div className="text-sm text-gray-600">Online Now</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search members by name, title, location, or expertise..."
                className="pl-10 pr-4 h-12 text-gray-900 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && performSearch()}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-[180px] h-12">
                  <SelectValue placeholder="Filter by group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  <SelectItem value="mumbai">Mumbai Chapter</SelectItem>
                  <SelectItem value="social">Social Impact</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] h-12">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="cohort">Cohort</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={clearFilters} variant="outline" size="lg" className="h-12">
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-blue-600" size={20} />
          <span className="text-sm text-gray-600">
            Showing {displayedMembers.length} of {filteredMembers.length} members
          </span>
        </div>
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "map")}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <Grid3X3 size={16} />
              Grid View
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map size={16} />
              Map View
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <Tabs value={viewMode} className="w-full">
        <TabsContent value="grid" className="space-y-6">
          {/* Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedMembers.length === 0 ? (
              <div className="col-span-full py-12 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-base mb-2">No members found matching your criteria</p>
                <p className="text-gray-400 text-sm mb-4">Try adjusting your search or filters</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear All Filters
                </Button>
              </div>
            ) : (
              displayedMembers.map((member) => (
                <Link key={member.id} href={`/profile/${member.id}`}>
                  <Card className="group hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 cursor-pointer border-gray-200 hover:border-blue-300 overflow-hidden">
                    <CardContent className="p-0">
                      {/* Header with gradient */}
                      <div className={`h-20 ${getAvatarColorClass(member.color)} bg-gradient-to-r relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute top-4 right-4">
                          <div className={`w-2 h-2 rounded-full ${member.isOnline ? 'bg-green-400' : 'bg-gray-400'} shadow-lg`}></div>
                        </div>
                      </div>
                      
                      {/* Profile Section */}
                      <div className="p-6 -mt-8 relative">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-16 h-16 ring-4 ring-white shadow-lg">
                            <AvatarFallback className={`${getAvatarColorClass(member.color)} text-white font-semibold text-lg`}>
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0 mt-6">
                            <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                              {member.name}
                            </h3>
                            <p className="text-sm text-gray-600 truncate">{member.title}</p>
                          </div>
                        </div>

                        {/* Location and Status */}
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin size={14} className="text-gray-400" />
                            <span className="truncate">{member.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Briefcase size={14} className="text-gray-400" />
                            <span className="truncate">{member.industry}</span>
                          </div>
                        </div>

                        {/* Skills Tags */}
                        <div className="mt-4 flex flex-wrap gap-1">
                          {member.skills.slice(0, 2).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">
                              {skill}
                            </Badge>
                          ))}
                          {member.skills.length > 2 && (
                            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                              +{member.skills.length - 2} more
                            </Badge>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar size={12} />
                            <span>Joined {member.joinDate}</span>
                          </div>
                          <Badge variant={member.isOnline ? "default" : "secondary"} className="text-xs">
                            {member.isOnline ? "Online" : "Offline"}
                          </Badge>
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
              <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="map" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="h-[600px] w-full">
                <MapView members={filteredMembers} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
