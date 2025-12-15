"use client"
import { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import { 
  MessageCircle, 
  MoreHorizontal, 
  Plus, 
  Briefcase, 
  Users, 
  MapPin, 
  Plane, 
  BookOpen, 
  HandHeart,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@/lib/user-context"
import { Textarea } from "@/components/ui/textarea"

export default function Home() {
  const { userInfo } = useUser()
  const [posts, setPosts] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPostType, setNewPostType] = useState("discussion")
  const [newPostContent, setNewPostContent] = useState("")
  const [expandedComments, setExpandedComments] = useState<string[]>([])
  const [submittingPost, setSubmittingPost] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
  // Pagination settings
  const itemsPerPage = 8

  useEffect(() => {
    fetchPosts()
    fetchMembers()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
        setCurrentPage(1)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        // Transform members data to include initials and color
        const transformedMembers = data.map((user: any) => ({
          id: user.id,
          name: user.name,
          initials: user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U',
          location: user.profile?.location || 'Unknown',
          color: 'blue' // Default color, can be randomized or based on user data
        }))
        setMembers(transformedMembers)
      }
    } catch (error) {
      console.error('Error fetching members:', error)
    }
  }

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !userInfo) return
    
    setSubmittingPost(true)
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newPostContent,
          category: newPostType,
        })
      })
      
      if (response.ok) {
        setNewPostContent('')
        setShowNewPost(false)
        fetchPosts()
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setSubmittingPost(false)
    }
  }

  const toggleComments = useCallback((postId: string) => {
    setExpandedComments(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }, [])

  const getAvatarColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: "bg-blue-500 text-white",
      green: "bg-green-500 text-white",
      emerald: "bg-emerald-500 text-white",
      purple: "bg-purple-500 text-white",
      yellow: "bg-yellow-500 text-black",
      red: "bg-red-500 text-white",
      orange: "bg-orange-500 text-white",
      pink: "bg-pink-500 text-white",
      indigo: "bg-indigo-500 text-white",
      teal: "bg-teal-500 text-white",
    }
    return colorMap[color] || "bg-gray-500 text-white"
  }

  // Get a random color for users who don't have one
  const getUserColor = useCallback((authorName: string) => {
    const colors = ["blue", "green", "purple", "orange", "pink", "indigo", "teal"]
    const index = authorName.length % colors.length
    return colors[index]
  }, [])

  // Categorize posts based on content and tags - memoized
  const categorizePost = useCallback((post: any) => {
    const content = post.content.toLowerCase()
    
    if (content.includes("looking for referral") || content.includes("need referral") || content.includes("seeking referral")) {
      return "looking-referral"
    }
    if (content.includes("offering referral") || content.includes("can refer") || content.includes("happy to refer")) {
      return "offering-referral"
    }
    if (content.includes("hiring") || content.includes("job opening") || content.includes("looking to hire")) {
      return "hiring"
    }
    if (content.includes("travel") || content.includes("visiting") || content.includes("going to") || content.includes("meetup")) {
      return "travel"
    }
    if (content.includes("resource") || content.includes("sharing") || content.includes("guide") || content.includes("workshop")) {
      return "resources"
    }
    if (content.includes("support") || content.includes("help") || content.includes("advice") || content.includes("guidance")) {
      return "support"
    }
    return "discussion"
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "looking-referral": return <Search className="w-4 h-4" />
      case "offering-referral": return <HandHeart className="w-4 h-4" />
      case "hiring": return <Briefcase className="w-4 h-4" />
      case "travel": return <Plane className="w-4 h-4" />
      case "resources": return <BookOpen className="w-4 h-4" />
      case "support": return <Users className="w-4 h-4" />
      default: return <MessageCircle className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "looking-referral": return "bg-blue-100 text-blue-700 border-blue-200"
      case "offering-referral": return "bg-green-100 text-green-700 border-green-200"
      case "hiring": return "bg-purple-100 text-purple-700 border-purple-200"
      case "travel": return "bg-orange-100 text-orange-700 border-orange-200"
      case "resources": return "bg-indigo-100 text-indigo-700 border-indigo-200"
      case "support": return "bg-pink-100 text-pink-700 border-pink-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case "looking-referral": return "Looking for Referral"
      case "offering-referral": return "Offering Referral"
      case "hiring": return "Hiring"
      case "travel": return "Travel & Meetups"
      case "resources": return "Sharing Resources"
      case "support": return "Need Support"
      default: return "General Discussion"
    }
  }

  const filterPosts = useCallback((category: string) => {
    if (category === "all") return posts
    return posts.filter(post => categorizePost(post) === category)
  }, [posts, categorizePost])

  const getPostCounts = useMemo(() => {
    const counts: { [key: string]: number } = {}
    posts.forEach(post => {
      const category = categorizePost(post)
      counts[category] = (counts[category] || 0) + 1
    })
    return counts
  }, [posts, categorizePost])

  const postCounts = getPostCounts
  
  // Get paginated posts for current category
  const filteredPosts = useMemo(() => filterPosts(activeTab), [activeTab, filterPosts])
  const totalPages = useMemo(() => Math.ceil(filteredPosts.length / itemsPerPage), [filteredPosts.length])
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

  // Current user data
  const currentUser = {
    initials: userInfo?.initials || 'U',
    name: userInfo?.name || 'User'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Community Wall</h1>
              <p className="text-xs text-gray-600">Opportunities, referrals, and community updates</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search posts..."
                  className="pl-10 w-48 h-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button size="sm" className="h-9" onClick={() => setShowNewPost(!showNewPost)}>
                <Plus size={16} className="mr-1" />
                New Post
              </Button>
            </div>
          </div>
        </div>

        {/* New Post Form */}
        {showNewPost && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Create New Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-2 block">Post Type</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "looking-referral", name: "Looking for Referral" },
                    { key: "offering-referral", name: "Offering Referral" },
                    { key: "hiring", name: "Hiring" },
                    { key: "travel", name: "Travel & Meetups" },
                    { key: "resources", name: "Sharing Resources" },
                    { key: "support", name: "Need Support" },
                    { key: "discussion", name: "General Discussion" }
                  ].map((type) => (
                    <Button
                      key={type.key}
                      variant={newPostType === type.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewPostType(type.key)}
                      className="text-xs"
                    >
                      {type.name}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-2 block">Content</label>
                <Textarea
                  placeholder="What would you like to share with the community?"
                  className="w-full text-sm"
                  rows={4}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowNewPost(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleCreatePost} disabled={submittingPost}>
                  {submittingPost ? "Posting..." : "Post"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Filter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {[
            { key: "all", name: "All Posts", icon: MessageCircle, color: "gray", count: posts.length },
            { key: "looking-referral", name: "Looking for Referral", icon: Search, color: "blue", count: postCounts["looking-referral"] || 0 },
            { key: "offering-referral", name: "Offering Referral", icon: HandHeart, color: "green", count: postCounts["offering-referral"] || 0 },
            { key: "hiring", name: "Hiring", icon: Briefcase, color: "purple", count: postCounts.hiring || 0 },
            { key: "travel", name: "Travel & Meetups", icon: Plane, color: "orange", count: postCounts.travel || 0 },
            { key: "resources", name: "Sharing Resources", icon: BookOpen, color: "indigo", count: postCounts.resources || 0 },
            { key: "support", name: "Need Support", icon: Users, color: "pink", count: postCounts.support || 0 }
          ].map(category => (
            <Card 
              key={category.key} 
              className={`cursor-pointer transition-all hover:shadow-md ${activeTab === category.key ? 'ring-2 ring-blue-500 shadow-md' : ''}`}
              onClick={() => {
                setActiveTab(category.key)
                setCurrentPage(1)
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-${category.color}-600 bg-${category.color}-100`}>
                      <category.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">{category.name}</h3>
                      <p className="text-xs text-gray-500">{category.count} post{category.count !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs font-semibold">{category.count}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Posts Grid Layout */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {getCategoryName(activeTab)}
          </h2>
          
          {paginatedPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {paginatedPosts.map((post) => {
                  const postCategory = categorizePost(post)
                  const commentCount = Array.isArray(post.comments) ? post.comments.length : post.comments || 0
                  return (
                    <Card key={post.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${getAvatarColorClass(getUserColor(post.author.name))}`}>
                              {post.author.initials}
                            </div>
                            <div>
                              <Link href={`/profile/${post.author.id}`}>
                                <h3 className="font-medium text-gray-900 text-sm hover:text-blue-600">
                                  {post.author.name}
                                </h3>
                              </Link>
                              <p className="text-xs text-gray-500">{post.author.title}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal size={16} />
                          </Button>
                        </div>
                        <Badge variant="outline" className={`text-xs w-fit ${getCategoryColor(postCategory)}`}>
                          {getCategoryIcon(postCategory)}
                          <span className="ml-1">{getCategoryName(postCategory)}</span>
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-gray-700 line-clamp-4">{post.content}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                          <button 
                            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                            onClick={() => toggleComments(post.id)}
                          >
                            <MessageCircle size={14} />
                            {commentCount} comment{commentCount !== 1 ? 's' : ''}
                          </button>
                          <span>{post.timestamp || 'Recently'}</span>
                          <button className="hover:text-blue-600 transition-colors ml-auto">Reply</button>
                        </div>

                        {/* Expanded Comments Section */}
                        {expandedComments.includes(post.id) && (
                          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                            {Array.isArray(post.comments) && post.comments.length > 0 ? (
                              <>
                                {post.comments.slice(0, 2).map((comment: any, index: number) => (
                                  <div key={index} className="flex gap-2">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${getAvatarColorClass(getUserColor(comment.author.name))}`}>
                                      {comment.author.initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                                        <p className="text-xs font-medium text-gray-900">{comment.author.name}</p>
                                        <p className="text-xs text-gray-700 mt-1">{comment.content}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {post.comments.length > 2 && (
                                  <p className="text-xs text-gray-500 text-center py-2">
                                    +{post.comments.length - 2} more comment{post.comments.length - 2 !== 1 ? 's' : ''}
                                  </p>
                                )}
                              </>
                            ) : (
                              <p className="text-xs text-gray-500 text-center py-2">No comments yet</p>
                            )}
                            <div className="flex gap-2 mt-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${getAvatarColorClass("blue")}`}>
                                {currentUser.initials}
                              </div>
                              <Input
                                placeholder="Write a comment..."
                                className="h-8 text-xs flex-1"
                              />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
                  <p className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredPosts.length)} of {filteredPosts.length} posts
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border">
              <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600 text-base font-medium">No posts in this category yet</p>
              <p className="text-gray-500 text-sm">Be the first to share in {getCategoryName(activeTab).toLowerCase()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
