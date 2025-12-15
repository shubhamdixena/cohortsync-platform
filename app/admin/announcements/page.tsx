"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Plus, Edit, Trash2, Send, Eye, Calendar, Users } from "lucide-react"
import { useUser } from "@/lib/user-context"
import Link from "next/link"
import { BarChart3, MessageSquare, BookOpen, Mail, UserPlus, Megaphone, Layers, Upload, Settings } from "lucide-react"

// Define the Announcement type based on our schema + UI needs
interface Announcement {
  id: string
  title: string
  content: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  category: string | null
  targetAudience: string | null
  views: number
  reactions: number // mapped from engagement in UI
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

// Hardcoded initial data as fallback
const initialAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "May Meetup - Networking Event",
    content: "Join us for our monthly networking meetup on May 28th at 6 PM. We'll be discussing entrepreneurship opportunities, sharing success stories, and building meaningful connections within our community.",
    status: "PUBLISHED",
    priority: "NORMAL",
    category: "Events",
    targetAudience: "All Members",
    views: 124,
    reactions: 32,
    publishedAt: "2023-05-20T10:00:00Z",
    createdAt: "2023-05-20T10:00:00Z",
    updatedAt: "2023-05-20T10:00:00Z"
  },
  {
    id: "2",
    title: "New Resource Library Launch",
    content: "We're excited to announce the launch of our new comprehensive resource library featuring guides, templates, and tools for social entrepreneurs. Access will be available starting June 1st.",
    status: "PUBLISHED",
    priority: "HIGH",
    category: "Updates",
    targetAudience: "All Members",
    views: 0,
    reactions: 0,
    publishedAt: "2023-06-01T09:00:00Z",
    createdAt: "2023-05-21T10:00:00Z",
    updatedAt: "2023-05-21T10:00:00Z"
  },
  {
    id: "3",
    title: "Community Guidelines Update",
    content: "We're updating our community guidelines to better reflect our values and ensure a positive environment for all members. Please review the changes and provide feedback...",
    status: "DRAFT",
    priority: "NORMAL",
    category: "Updates",
    targetAudience: "All Members",
    views: 0,
    reactions: 0,
    publishedAt: null,
    createdAt: "2023-05-22T10:00:00Z",
    updatedAt: "2023-05-22T10:00:00Z"
  },
  {
    id: "4",
    title: "Platform Maintenance Notice",
    content: "Scheduled maintenance will occur on May 25th from 2:00 AM to 4:00 AM IST. The platform will be temporarily unavailable during this time. We apologize for any inconvenience.",
    status: "PUBLISHED",
    priority: "URGENT",
    category: "Updates",
    targetAudience: "All Members",
    views: 89,
    reactions: 12,
    publishedAt: "2023-05-23T10:00:00Z",
    createdAt: "2023-05-23T10:00:00Z",
    updatedAt: "2023-05-23T10:00:00Z"
  }
]

export default function AnnouncementsManagement() {
  const { userInfo } = useUser()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements)
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "DRAFT" as const,
    priority: "NORMAL" as const,
    category: "",
    targetAudience: ""
  })

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('/api/announcements')
        if (response.ok) {
          const data = await response.json()
          if (data && Array.isArray(data) && data.length > 0) {
             setAnnouncements(data)
          }
        }
      } catch (error) {
        console.error("Failed to fetch announcements", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncements()
  }, [])

  const handleCreateAnnouncement = async () => {
    if (!formData.title || !formData.content) {
      alert('Title and content are required')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          status: formData.status,
          priority: formData.priority,
          category: formData.category || null,
          targetAudience: formData.targetAudience || null,
          publishedAt: formData.status === 'PUBLISHED' ? new Date().toISOString() : null
        })
      })

      if (response.ok) {
        alert('Announcement created successfully')
        setShowCreateDialog(false)
        setFormData({
          title: "",
          content: "",
          status: "DRAFT",
          priority: "NORMAL",
          category: "",
          targetAudience: ""
        })
        // Refresh announcements
        const res = await fetch('/api/announcements')
        if (res.ok) {
          const data = await res.json()
          setAnnouncements(data || [])
        }
      } else {
        const error = await response.json()
        alert('Failed to create announcement: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error creating announcement:', error)
      alert('Error creating announcement')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditAnnouncement = async () => {
    if (!selectedAnnouncement || !formData.title || !formData.content) {
      alert('Title and content are required')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`/api/announcements/${selectedAnnouncement.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          status: formData.status,
          priority: formData.priority,
          category: formData.category || null,
          targetAudience: formData.targetAudience || null,
          publishedAt: formData.status === 'PUBLISHED' ? selectedAnnouncement.publishedAt || new Date().toISOString() : selectedAnnouncement.publishedAt
        })
      })

      if (response.ok) {
        alert('Announcement updated successfully')
        setShowEditDialog(false)
        setSelectedAnnouncement(null)
        // Refresh announcements
        const res = await fetch('/api/announcements')
        if (res.ok) {
          const data = await res.json()
          setAnnouncements(data || [])
        }
      } else {
        const error = await response.json()
        alert('Failed to update announcement: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error updating announcement:', error)
      alert('Error updating announcement')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteAnnouncement = async (announcementId: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return

    try {
      const response = await fetch(`/api/announcements/${announcementId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Announcement deleted successfully')
        const res = await fetch('/api/announcements')
        if (res.ok) {
          const data = await res.json()
          setAnnouncements(data || [])
        }
      } else {
        const error = await response.json()
        alert('Failed to delete announcement: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error deleting announcement:', error)
      alert('Error deleting announcement')
    }
  }

  const openEditDialog = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      content: announcement.content,
      status: announcement.status,
      priority: announcement.priority,
      category: announcement.category || "",
      targetAudience: announcement.targetAudience || ""
    })
    setShowEditDialog(true)
  }

  const getDisplayStatus = (announcement: Announcement) => {
    if (announcement.status === 'DRAFT') return 'Draft'
    if (announcement.status === 'ARCHIVED') return 'Archived'
    if (announcement.status === 'PUBLISHED') {
        if (announcement.publishedAt && new Date(announcement.publishedAt) > new Date()) {
            return 'Scheduled'
        }
        return 'Published'
    }
    return 'Unknown'
  }

  const filteredAnnouncements = announcements.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.content.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (!matchesSearch) return false

    const displayStatus = getDisplayStatus(a).toLowerCase()
    
    if (activeTab === 'all') return true
    if (activeTab === 'published') return displayStatus === 'published'
    if (activeTab === 'scheduled') return displayStatus === 'scheduled'
    if (activeTab === 'drafts') return displayStatus === 'draft'
    
    return true
  })

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'archived': return 'bg-gray-100 text-gray-600'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getBorderClass = (announcement: Announcement) => {
    if (announcement.priority === 'URGENT') return 'border-red-200 bg-red-50'
    const status = getDisplayStatus(announcement).toLowerCase()
    if (status === 'published') return 'border-green-200 bg-green-50'
    if (status === 'scheduled') return 'border-blue-200 bg-blue-50'
    return 'border-gray-200'
  }

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Announcements</h1>
            <p className="text-sm text-gray-600 mt-1">
              Create and manage announcements to keep your community informed about important updates and events.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button onClick={() => setShowCreateDialog(true)} className="bg-blue-600 text-white px-3 py-2 rounded-md text-xs font-medium hover:bg-blue-700 flex items-center">
              <Plus size={14} className="mr-1" /> Create Announcement
            </button>
            <button onClick={() => setShowCreateDialog(true)} className="bg-white text-gray-700 border border-gray-300 px-3 py-2 rounded-md text-xs font-medium hover:bg-gray-50 flex items-center">
              <Calendar size={14} className="mr-1" /> Schedule
            </button>
          </div>
        </div>
      </div>

          {/* Announcement Tabs */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`${activeTab === "all" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-3 px-4 border-b-2 font-medium text-xs`}
                >
                  All Announcements{" "}
                  <span className="ml-1 bg-gray-100 text-gray-700 py-0.5 px-2 rounded-full text-xs">{announcements.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab("published")}
                  className={`${activeTab === "published" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-3 px-4 border-b-2 font-medium text-xs`}
                >
                  Published <span className="ml-1 bg-green-100 text-green-800 py-0.5 px-2 rounded-full text-xs">
                    {announcements.filter(a => getDisplayStatus(a) === 'Published').length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("scheduled")}
                  className={`${activeTab === "scheduled" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-3 px-4 border-b-2 font-medium text-xs`}
                >
                  Scheduled <span className="ml-1 bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full text-xs">
                    {announcements.filter(a => getDisplayStatus(a) === 'Scheduled').length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("drafts")}
                  className={`${activeTab === "drafts" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-3 px-4 border-b-2 font-medium text-xs`}
                >
                  Drafts <span className="ml-1 bg-gray-100 text-gray-700 py-0.5 px-2 rounded-full text-xs">
                    {announcements.filter(a => getDisplayStatus(a) === 'Draft').length}
                  </span>
                </button>
              </nav>
            </div>

            {/* Search and Filters */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-grow relative">
                  <input
                    type="text"
                    placeholder="Search announcements..."
                    className="w-full bg-gray-100 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <Search size={14} />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <select className="bg-gray-100 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm">
                    <option value="">All Categories</option>
                    <option value="general">General</option>
                    <option value="events">Events</option>
                    <option value="updates">Updates</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <select className="bg-gray-100 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm">
                    <option value="">All Sub-Groups</option>
                    <option value="all">All Members</option>
                    <option value="mumbai">Mumbai Chapter</option>
                    <option value="delhi">Delhi Chapter</option>
                    <option value="bangalore">Bangalore Chapter</option>
                  </select>
                  <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200">
                    <Filter size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Announcements List */}
            <div className="p-6">
              <div className="space-y-4">
                {filteredAnnouncements.map((announcement) => {
                  const displayStatus = getDisplayStatus(announcement)
                  return (
                    <div key={announcement.id} className={`border rounded-lg p-4 transition-all hover:shadow-md hover:-translate-y-1 ${getBorderClass(announcement)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                            <div className="flex items-center space-x-2">
                              {announcement.priority === 'URGENT' && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Urgent</span>
                              )}
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(displayStatus)}`}>
                                {displayStatus}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {announcement.content}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-gray-500">
                                {displayStatus === 'Scheduled' ? 'Scheduled for:' : 'Published:'}
                              </p>
                              <p className="text-xs font-medium">
                                {announcement.publishedAt ? new Date(announcement.publishedAt).toLocaleDateString() : 'Not set'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Target Audience:</p>
                              <p className="text-xs font-medium">{announcement.targetAudience || 'All Members'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Category:</p>
                              <p className="text-xs font-medium">{announcement.category || 'General'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Engagement:</p>
                              <p className="text-xs font-medium">{announcement.views} views • {announcement.reactions} reactions</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="bg-white text-gray-700 border border-gray-300 px-3 py-1 rounded text-xs font-medium hover:bg-gray-50 flex items-center">
                              <Eye size={12} className="mr-1" /> {displayStatus === 'Scheduled' ? 'Preview' : 'View'}
                            </button>
                            <button onClick={() => openEditDialog(announcement)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 flex items-center">
                              <Edit size={12} className="mr-1" /> {displayStatus === 'Draft' ? 'Continue Editing' : 'Edit'}
                            </button>
                            {displayStatus === 'Draft' && (
                              <button onClick={async () => {
                                setSelectedAnnouncement(announcement)
                                setFormData({
                                  title: announcement.title,
                                  content: announcement.content,
                                  status: 'PUBLISHED',
                                  priority: announcement.priority,
                                  category: announcement.category || "",
                                  targetAudience: announcement.targetAudience || ""
                                })
                                await handleEditAnnouncement()
                              }} className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700 flex items-center">
                                <Send size={12} className="mr-1" /> Publish
                              </button>
                            )}
                            {displayStatus === 'Scheduled' && (
                              <button onClick={async () => {
                                setSelectedAnnouncement(announcement)
                                setFormData({
                                  title: announcement.title,
                                  content: announcement.content,
                                  status: 'PUBLISHED',
                                  priority: announcement.priority,
                                  category: announcement.category || "",
                                  targetAudience: announcement.targetAudience || ""
                                })
                                await handleEditAnnouncement()
                              }} className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700 flex items-center">
                                <Send size={12} className="mr-1" /> Send Now
                              </button>
                            )}
                            <button onClick={() => handleDeleteAnnouncement(announcement.id)} className="bg-white text-red-600 border border-red-300 px-3 py-1 rounded text-xs font-medium hover:bg-red-50 flex items-center">
                              <Trash2 size={12} className="mr-1" /> {displayStatus === 'Scheduled' ? 'Cancel' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {filteredAnnouncements.length === 0 && (
                  <div className="text-center py-10 text-gray-500">
                    No announcements found matching your criteria.
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center">
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{Math.min(filteredAnnouncements.length, 4)}</span> of{" "}
                    <span className="font-medium">{filteredAnnouncements.length}</span> announcements
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="bg-white text-gray-500 px-3 py-1 rounded-md text-sm border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    disabled
                  >
                    Previous
                  </button>
                  <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm border border-blue-300 hover:bg-blue-100">
                    1
                  </button>
                  <button className="bg-white text-gray-700 px-3 py-1 rounded-md text-sm border border-gray-300 hover:bg-gray-50">
                    2
                  </button>
                  <button className="bg-white text-gray-700 px-3 py-1 rounded-md text-sm border border-gray-300 hover:bg-gray-50">
                    3
                  </button>
                  <button className="bg-white text-gray-700 px-3 py-1 rounded-md text-sm border border-gray-300 hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Announcement Tools */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Announcement Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Plus size={20} />
                  </div>
                  <h3 className="ml-3 text-sm font-medium text-gray-900">Quick Announcement</h3>
                </div>
                <p className="text-xs text-gray-600 mb-4">
                  Create and send urgent announcements instantly to all members or specific sub-groups.
                </p>
                <button className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Create Quick Announcement
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Calendar size={20} />
                  </div>
                  <h3 className="ml-3 text-sm font-medium text-gray-900">Schedule Announcements</h3>
                </div>
                <p className="text-xs text-gray-600 mb-4">
                  Plan and schedule announcements in advance to maintain consistent communication with your community.
                </p>
                <button className="w-full bg-green-600 text-white py-2 rounded-md text-sm font-medium hover:bg-green-700">
                  Schedule Announcement
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <BarChart3 size={20} />
                  </div>
                  <h3 className="ml-3 text-sm font-medium text-gray-900">Announcement Analytics</h3>
                </div>
                <p className="text-xs text-gray-600 mb-4">
                  Track engagement, views, and member responses to optimize your communication strategy.
                </p>
                <button className="w-full bg-purple-600 text-white py-2 rounded-md text-sm font-medium hover:bg-purple-700">
                  View Analytics
                </button>
              </div>
            </div>
          </div>

          {/* Create Announcement Dialog */}
          {showCreateDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Create Announcement</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Announcement title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={5}
                      placeholder="Announcement content"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="LOW">Low</option>
                        <option value="NORMAL">Normal</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Updates, Events"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                    <input
                      type="text"
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., All Members"
                    />
                  </div>
                </div>
                <div className="p-6 border-t border-gray-200 flex justify-end space-x-2">
                  <button
                    onClick={() => setShowCreateDialog(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAnnouncement}
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitting ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Announcement Dialog */}
          {showEditDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Edit Announcement</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Announcement title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={5}
                      placeholder="Announcement content"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="LOW">Low</option>
                        <option value="NORMAL">Normal</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Updates, Events"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                    <input
                      type="text"
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., All Members"
                    />
                  </div>
                </div>
                <div className="p-6 border-t border-gray-200 flex justify-end space-x-2">
                  <button
                    onClick={() => setShowEditDialog(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditAnnouncement}
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}
    </div>
  )
}
