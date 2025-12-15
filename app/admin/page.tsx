"use client"

import { useState } from "react"
import {
  Users,
  MessageSquare,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  UserPlus,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("7d")
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false)
  const [showResourceDialog, setShowResourceDialog] = useState(false)
  const [scheduledDate, setScheduledDate] = useState<Date>()
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    title: "",
    location: "",
    cohort: "",
    subgroup: "",
    phone: "",
    linkedin: "",
    bio: "",
  })
  const [announcement, setAnnouncement] = useState({
    title: "",
    content: "",
    audience: "all",
    priority: "normal",
    scheduled: false,
    scheduledDate: null,
    sendEmail: true,
    sendPush: false,
  })
  const [resource, setResource] = useState({
    title: "",
    description: "",
    category: "",
    url: "",
    file: null,
    tags: "",
    accessLevel: "all",
    featured: false,
  })

  const handleAddMember = async () => {
    try {
      // Note: In production, this would create a user account via admin API
      console.log("Adding member:", newMember)
      // TODO: Implement admin user creation API
      setShowAddMemberDialog(false)
      setNewMember({
        name: "",
        email: "",
        title: "",
        location: "",
        cohort: "",
        subgroup: "",
        phone: "",
        linkedin: "",
        bio: "",
      })
    } catch (error) {
      console.error("Error adding member:", error)
    }
  }

  const handleSendAnnouncement = async () => {
    try {
      const announcementData = {
        title: announcement.title,
        content: announcement.content,
        priority: announcement.priority.toUpperCase(),
        status: announcement.scheduled ? 'DRAFT' : 'PUBLISHED',
        publishedAt: announcement.scheduled ? null : new Date().toISOString(),
        expiresAt: null,
      }
      
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcementData)
      })
      
      if (response.ok) {
        setShowAnnouncementDialog(false)
        setAnnouncement({
          title: "",
          content: "",
          audience: "all",
          priority: "normal",
          scheduled: false,
          scheduledDate: null,
          sendEmail: true,
          sendPush: false,
        })
        setScheduledDate(undefined)
      }
    } catch (error) {
      console.error("Error sending announcement:", error)
    }
  }

  const handleAddResource = async () => {
    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: resource.title,
          description: resource.description,
          type: resource.file ? 'document' : 'link',
          category: resource.category,
          url: resource.url,
          tags: resource.tags ? JSON.stringify(resource.tags.split(',').map((t: string) => t.trim())) : null,
          accessLevel: resource.accessLevel === 'all' ? 'PUBLIC' : 'MEMBERS_ONLY',
          featured: resource.featured,
        })
      })
      
      if (response.ok) {
        setShowResourceDialog(false)
        setResource({
          title: "",
          description: "",
          category: "",
          url: "",
          file: null,
          tags: "",
          accessLevel: "all",
          featured: false,
        })
      }
    } catch (error) {
      console.error("Error adding resource:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Welcome back! Here's what's happening in your community today.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Total Members</p>
                <p className="text-lg font-bold text-gray-900">1,247</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600 font-medium">+12%</span>
              <span className="text-xs text-gray-500 ml-2">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Active Today</p>
                <p className="text-lg font-bold text-gray-900">189</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600 font-medium">+8%</span>
              <span className="text-xs text-gray-500 ml-2">vs yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">New Posts</p>
                <p className="text-lg font-bold text-gray-900">45</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600 font-medium">+15%</span>
              <span className="text-xs text-gray-500 ml-2">vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Pending Reviews</p>
                <p className="text-lg font-bold text-gray-900">7</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <ArrowDownRight className="w-3 h-3 text-red-500 mr-1" />
              <span className="text-xs text-red-600 font-medium">-3</span>
              <span className="text-xs text-gray-500 ml-2">vs yesterday</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Add New Member Dialog */}
              <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full" size="sm">
                    <UserPlus size={14} className="mr-2" /> Add New Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Member</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={newMember.name}
                          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                          placeholder="Enter full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newMember.email}
                          onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                          placeholder="Enter email"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                          id="title"
                          value={newMember.title}
                          onChange={(e) => setNewMember({ ...newMember, title: e.target.value })}
                          placeholder="Enter job title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={newMember.phone}
                          onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={newMember.location}
                          onChange={(e) => setNewMember({ ...newMember, location: e.target.value })}
                          placeholder="Enter location"
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn Profile</Label>
                        <Input
                          id="linkedin"
                          value={newMember.linkedin}
                          onChange={(e) => setNewMember({ ...newMember, linkedin: e.target.value })}
                          placeholder="LinkedIn URL"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cohort">Cohort</Label>
                        <Select
                          value={newMember.cohort}
                          onValueChange={(value) => setNewMember({ ...newMember, cohort: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select cohort" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2024">2024 Batch</SelectItem>
                            <SelectItem value="2023">2023 Batch</SelectItem>
                            <SelectItem value="2022">2022 Batch</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="subgroup">Sub-Group</Label>
                        <Select
                          value={newMember.subgroup}
                          onValueChange={(value) => setNewMember({ ...newMember, subgroup: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select sub-group" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mumbai">Mumbai Chapter</SelectItem>
                            <SelectItem value="delhi">Delhi Chapter</SelectItem>
                            <SelectItem value="social">Social Entrepreneurs</SelectItem>
                            <SelectItem value="tech">Tech Innovators</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        rows={3}
                        value={newMember.bio}
                        onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                        placeholder="Brief bio about the member"
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowAddMemberDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddMember}>Add Member</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Send Announcement Dialog */}
              <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="secondary" size="sm">
                    <Send size={14} className="mr-2" /> Send Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Announcement</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="ann-title">Title *</Label>
                      <Input
                        id="ann-title"
                        value={announcement.title}
                        onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
                        placeholder="Enter announcement title"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="ann-content">Content *</Label>
                      <Textarea
                        id="ann-content"
                        rows={6}
                        value={announcement.content}
                        onChange={(e) => setAnnouncement({ ...announcement, content: e.target.value })}
                        placeholder="Enter announcement content"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="audience">Audience</Label>
                        <Select
                          value={announcement.audience}
                          onValueChange={(value) => setAnnouncement({ ...announcement, audience: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Members</SelectItem>
                            <SelectItem value="mumbai">Mumbai Chapter</SelectItem>
                            <SelectItem value="delhi">Delhi Chapter</SelectItem>
                            <SelectItem value="social">Social Entrepreneurs</SelectItem>
                            <SelectItem value="admins">Admins Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={announcement.priority}
                          onValueChange={(value) => setAnnouncement({ ...announcement, priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="scheduled"
                          checked={announcement.scheduled}
                          onCheckedChange={(checked) => setAnnouncement({ ...announcement, scheduled: checked })}
                        />
                        <Label htmlFor="scheduled">Schedule for later</Label>
                      </div>

                      {announcement.scheduled && (
                        <div>
                          <Label>Schedule Date & Time</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !scheduledDate && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={scheduledDate}
                                onSelect={setScheduledDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="sendEmail"
                            checked={announcement.sendEmail}
                            onCheckedChange={(checked) => setAnnouncement({ ...announcement, sendEmail: checked })}
                          />
                          <Label htmlFor="sendEmail">Send email notification</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="sendPush"
                            checked={announcement.sendPush}
                            onCheckedChange={(checked) => setAnnouncement({ ...announcement, sendPush: checked })}
                          />
                          <Label htmlFor="sendPush">Send push notification</Label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowAnnouncementDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSendAnnouncement}>
                        {announcement.scheduled ? "Schedule Announcement" : "Send Announcement"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Add Resource Dialog */}
              <Dialog open={showResourceDialog} onOpenChange={setShowResourceDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="secondary" size="sm">
                    <BookOpen size={14} className="mr-2" /> Add Resource
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Resource</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="res-title">Resource Title *</Label>
                      <Input
                        id="res-title"
                        value={resource.title}
                        onChange={(e) => setResource({ ...resource, title: e.target.value })}
                        placeholder="Enter resource title"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="res-description">Description *</Label>
                      <Textarea
                        id="res-description"
                        rows={4}
                        value={resource.description}
                        onChange={(e) => setResource({ ...resource, description: e.target.value })}
                        placeholder="Enter resource description"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={resource.category}
                          onValueChange={(value) => setResource({ ...resource, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="funding">Funding</SelectItem>
                            <SelectItem value="legal">Legal</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="networking">Networking</SelectItem>
                            <SelectItem value="operations">Operations</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="accessLevel">Access Level</Label>
                        <Select
                          value={resource.accessLevel}
                          onValueChange={(value) => setResource({ ...resource, accessLevel: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Members</SelectItem>
                            <SelectItem value="premium">Premium Members</SelectItem>
                            <SelectItem value="admin">Admins Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="res-url">URL (Optional)</Label>
                      <Input
                        id="res-url"
                        type="url"
                        value={resource.url}
                        onChange={(e) => setResource({ ...resource, url: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="file">Upload File (Optional)</Label>
                      <Input
                        id="file"
                        type="file"
                        onChange={(e) => setResource({ ...resource, file: e.target.files?.[0] || null })}
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xlsx,.zip"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Supported formats: PDF, DOC, DOCX, PPT, PPTX, XLSX, ZIP (Max 10MB)
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        value={resource.tags}
                        onChange={(e) => setResource({ ...resource, tags: e.target.value })}
                        placeholder="Enter tags separated by commas"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={resource.featured}
                        onCheckedChange={(checked) => setResource({ ...resource, featured: checked })}
                      />
                      <Label htmlFor="featured">Feature this resource</Label>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowResourceDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddResource}>Add Resource</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                className="w-full"
                variant="secondary"
                size="sm"
                onClick={() => (window.location.href = "/admin/analytics")}
              >
                <BarChart3 size={14} className="mr-2" /> View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Alerts & Notifications */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-grow">
                  <p className="text-xs font-medium text-red-800">Content Flagged</p>
                  <p className="text-xs text-red-600">A post in Mumbai Chapter has been flagged by 3 members</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 bg-transparent text-xs"
                    onClick={() => (window.location.href = "/admin/content")}
                  >
                    Review Now
                  </Button>
                </div>
                <span className="text-xs text-red-500">2h ago</span>
              </div>

              <div className="flex items-start p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Clock className="w-4 h-4 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-grow">
                  <p className="text-xs font-medium text-yellow-800">Pending Approvals</p>
                  <p className="text-xs text-yellow-600">3 new member applications awaiting review</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 bg-transparent text-xs"
                    onClick={() => (window.location.href = "/admin/members")}
                  >
                    Review Applications
                  </Button>
                </div>
                <span className="text-xs text-yellow-500">4h ago</span>
              </div>

              <div className="flex items-start p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-grow">
                  <p className="text-xs font-medium text-green-800">Milestone Reached</p>
                  <p className="text-xs text-green-600">Community has reached 1,250 members!</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 bg-transparent text-xs"
                    onClick={() => (window.location.href = "/admin/analytics")}
                  >
                    View Details
                  </Button>
                </div>
                <span className="text-xs text-green-500">1d ago</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity & Top Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center font-semibold text-blue-700 text-xs">
                  AP
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-900">Anjali Patel</p>
                  <p className="text-xs text-gray-600">Posted in Mumbai Chapter</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">2h ago</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center font-semibold text-green-700 text-xs">
                  VT
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-900">Vikram Thakur</p>
                  <p className="text-xs text-gray-600">Joined Delhi Chapter</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">4h ago</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center font-semibold text-purple-700 text-xs">
                  RM
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-900">Ritu Mehta</p>
                  <p className="text-xs text-gray-600">Shared a resource</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">6h ago</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-7 h-7 bg-yellow-100 rounded-full flex items-center justify-center font-semibold text-yellow-700 text-xs">
                  SK
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-900">Sanjay Kumar</p>
                  <p className="text-xs text-gray-600">Applied for membership</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">1d ago</span>
            </div>
          </CardContent>
        </Card>

        {/* Top Content */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Top Performing Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 text-xs">May Meetup Announcement</h4>
                <p className="text-xs text-gray-600">Posted 2 days ago</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 text-xs">124</p>
                <p className="text-xs text-gray-600">views</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 text-xs">Startup Funding Guide</h4>
                <p className="text-xs text-gray-600">Posted 1 week ago</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 text-xs">89</p>
                <p className="text-xs text-gray-600">downloads</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Networking Event Mumbai</h4>
                <p className="text-xs text-gray-600">Posted 3 days ago</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 text-sm">67</p>
                <p className="text-xs text-gray-600">comments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sub-Group Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Sub-Group Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Mumbai Chapter</h4>
                <Badge variant="secondary">Active</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">42</p>
              <p className="text-xs text-gray-600">members</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Delhi Chapter</h4>
                <Badge variant="secondary">Active</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">38</p>
              <p className="text-xs text-gray-600">members</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Social Entrepreneurs</h4>
                <Badge variant="secondary">Active</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">56</p>
              <p className="text-xs text-gray-600">members</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Tech Innovators</h4>
                <Badge variant="outline">Moderate</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">29</p>
              <p className="text-xs text-gray-600">members</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
