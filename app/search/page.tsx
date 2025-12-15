"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, Users, FileText, Building, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { members, resources, posts } from "@/lib/data"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchResults, setSearchResults] = useState({
    members: [] as any[],
    posts: [] as any[],
    resources: [] as any[],
  })

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery)
    } else {
      setSearchResults({ members: [], posts: [], resources: [] })
    }
  }, [searchQuery])

  const performSearch = async (query: string) => {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults({
          members: data.users || [],
          posts: data.posts || [],
          resources: data.resources || [],
        })
      }
    } catch (error) {
      console.error('Error searching:', error)
      setSearchResults({ members: [], posts: [], resources: [] })
    }
  }

  const getFilteredResults = () => {
    switch (activeFilter) {
      case "members":
        return { members: searchResults.members, posts: [], resources: [] }
      case "posts":
        return { members: [], posts: searchResults.posts, resources: [] }
      case "resources":
        return { members: [], posts: [], resources: searchResults.resources }
      default:
        return searchResults
    }
  }

  const filteredResults = getFilteredResults()
  const totalResults = filteredResults.members.length + filteredResults.posts.length + filteredResults.resources.length

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search size={24} />
            <span>Search Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search members, posts, resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Filter size={16} className="mr-1" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Filters */}
      {searchQuery && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activeFilter === "all" ? "bg-blue-100 text-blue-800" : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  All ({totalResults})
                </button>
                <button
                  onClick={() => setActiveFilter("members")}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activeFilter === "members" ? "bg-blue-100 text-blue-800" : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Members ({searchResults.members.length})
                </button>
                <button
                  onClick={() => setActiveFilter("posts")}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activeFilter === "posts" ? "bg-blue-100 text-blue-800" : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Posts ({searchResults.posts.length})
                </button>
                <button
                  onClick={() => setActiveFilter("resources")}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activeFilter === "resources" ? "bg-blue-100 text-blue-800" : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Resources ({searchResults.resources.length})
                </button>
              </div>
              <p className="text-sm text-gray-500">
                {totalResults} results for "{searchQuery}"
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchQuery && totalResults === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Search size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500">Try adjusting your search terms or browse our community directory.</p>
              <Link href="/directory" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
                Browse Directory
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Members Results */}
      {filteredResults.members.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users size={20} />
              <span>Members ({filteredResults.members.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResults.members.map((member) => (
                <Link key={member.id} href={`/profile/${member.id}`}>
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold">
                        {member.initials}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.title}</p>
                        <p className="text-xs text-gray-500">{member.location}</p>
                      </div>
                      {member.isOnline && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {member.expertise.slice(0, 3).map((exp, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts Results */}
      {filteredResults.posts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText size={20} />
              <span>Posts ({filteredResults.posts.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredResults.posts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold">
                      {post.author.initials}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
                        <span className="text-sm text-gray-500">{post.author.title}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">{post.timestamp}</span>
                      </div>
                      <p className="text-gray-800 leading-relaxed mb-3">
                        {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
                      </p>
                      {post.tags && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resources Results */}
      {filteredResults.resources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building size={20} />
              <span>Resources ({filteredResults.resources.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResults.resources.map((resource) => (
                <div key={resource.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{resource.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{resource.type}</span>
                        <span>{resource.downloadCount} downloads</span>
                        <span>★ {resource.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {resource.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
