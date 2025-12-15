"use client"

import { useState } from "react"
import { Search, Filter, Flag, MessageSquare, Eye, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function MessagesManagement() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showBroadcastDialog, setShowBroadcastDialog] = useState(false)
  const [showModerationDialog, setShowModerationDialog] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [broadcast, setBroadcast] = useState({
    title: "",
    content: "",
    audience: "all",
    priority: "normal",
  })

  const handleFlagMessage = (messageId) => {
    console.log(`Flagging message: ${messageId}`)
    // Add flag logic here
  }

  const handleRemoveMessage = (messageId) => {
    console.log(`Removing message: ${messageId}`)
    // Add remove logic here
  }

  const handleWarnUser = (userId) => {
    console.log(`Warning user: ${userId}`)
    // Add warn logic here
  }

  const handleMarkSafe = (messageId) => {
    console.log(`Marking message as safe: ${messageId}`)
    // Add mark safe logic here
  }

  const handleSendBroadcast = () => {
    console.log("Sending broadcast:", broadcast)
    setShowBroadcastDialog(false)
    setBroadcast({ title: "", content: "", audience: "all", priority: "normal" })
  }

  const openModerationDialog = (message) => {
    setSelectedMessage(message)
    setShowModerationDialog(true)
  }

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Message Management</h1>
              <p className="text-sm text-gray-600 mt-1">
                Monitor community messages, review flagged content, and manage communication across your platform.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Dialog open={showBroadcastDialog} onOpenChange={setShowBroadcastDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <MessageSquare size={14} className="mr-1" /> Send Broadcast
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create Broadcast Message</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="broadcast-title">Title</Label>
                      <Input
                        id="broadcast-title"
                        value={broadcast.title}
                        onChange={(e) => setBroadcast({ ...broadcast, title: e.target.value })}
                        placeholder="Enter broadcast title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="broadcast-content">Content</Label>
                      <Textarea
                        id="broadcast-content"
                        rows={4}
                        value={broadcast.content}
                        onChange={(e) => setBroadcast({ ...broadcast, content: e.target.value })}
                        placeholder="Enter broadcast content"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="audience">Audience</Label>
                        <Select
                          value={broadcast.audience}
                          onValueChange={(value) => setBroadcast({ ...broadcast, audience: value })}
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
                          value={broadcast.priority}
                          onValueChange={(value) => setBroadcast({ ...broadcast, priority: value })}
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
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowBroadcastDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSendBroadcast}>Send Broadcast</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline">
                <Filter size={16} className="mr-1" /> Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message Tabs */}
      <Card>
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("all")}
              className={`${activeTab === "all" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              All Messages{" "}
              <Badge variant="secondary" className="ml-1">
                1,247
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab("flagged")}
              className={`${activeTab === "flagged" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Flagged{" "}
              <Badge variant="destructive" className="ml-1">
                3
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`${activeTab === "reports" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Reports{" "}
              <Badge variant="outline" className="ml-1">
                5
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab("broadcasts")}
              className={`${activeTab === "broadcasts" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Broadcasts{" "}
              <Badge variant="secondary" className="ml-1">
                12
              </Badge>
            </button>
          </nav>
        </div>

        {/* Search and Filters */}
        <CardContent className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-grow relative">
              <Input
                type="text"
                placeholder="Search messages..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>
            <div className="flex space-x-2">
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Conversations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">Direct Messages</SelectItem>
                  <SelectItem value="group">Group Messages</SelectItem>
                  <SelectItem value="subgroup">Sub-Group Messages</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter size={16} />
              </Button>
            </div>
          </div>
        </CardContent>

        {/* Flagged Messages Alert */}
        {activeTab === "flagged" && (
          <CardContent className="p-6 bg-red-50 border-b border-red-200">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Messages Flagged for Review</p>
                    <p className="text-sm">
                      Multiple messages have been flagged by community members for potentially violating community
                      guidelines.
                    </p>
                  </div>
                  <Button size="sm" variant="destructive">
                    Review All
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        )}

        {/* Messages List */}
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Flagged Message */}
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold text-xs flex-shrink-0">
                    SK
                  </div>
                  <div className="ml-3 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">Sanjay Kumar → Mumbai Chapter</h3>
                        <p className="text-xs text-gray-500">Direct message • 2 hours ago</p>
                      </div>
                      <Badge variant="destructive">Flagged</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      "Hey everyone, I have this amazing investment opportunity that can guarantee 50% returns in just 3
                      months. Contact me privately for details..."
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <span className="mr-4 flex items-center">
                        <Flag size={12} className="mr-1" /> 4 reports
                      </span>
                      <span className="mr-4 flex items-center">
                        <Eye size={12} className="mr-1" /> 23 views
                      </span>
                      <span className="flex items-center">
                        <AlertTriangle size={12} className="mr-1" /> Potential spam/scam
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          openModerationDialog({
                            id: 1,
                            author: "Sanjay Kumar",
                            content: "Investment opportunity message",
                          })
                        }
                      >
                        View Full Thread
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleWarnUser("sanjay")}>
                        Warn User
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleRemoveMessage("msg1")}>
                        Remove Message
                      </Button>
                      <Button size="sm" onClick={() => handleMarkSafe("msg1")}>
                        Mark as Safe
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Regular Message */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
                    AP
                  </div>
                  <div className="ml-3 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">Anjali Patel → Social Entrepreneurs</h3>
                        <p className="text-xs text-gray-500">Group message • 4 hours ago</p>
                      </div>
                      <Badge>Clean</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      "Just wanted to share this great article about impact measurement frameworks. Really helpful for
                      anyone working on social impact projects!"
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <span className="mr-4 flex items-center">
                        <MessageSquare size={12} className="mr-1" /> 12 replies
                      </span>
                      <span className="mr-4 flex items-center">
                        <Eye size={12} className="mr-1" /> 45 views
                      </span>
                      <span className="flex items-center">
                        <CheckCircle size={12} className="mr-1" /> No reports
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        View Thread
                      </Button>
                      <Button size="sm">Feature Message</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reported Message */}
            <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs flex-shrink-0">
                    VT
                  </div>
                  <div className="ml-3 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">Vikram Thakur → Delhi Chapter</h3>
                        <p className="text-xs text-gray-500">Group message • 1 day ago</p>
                      </div>
                      <Badge variant="outline">Under Review</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      "I disagree with the recent policy changes. I think the leadership team is making some
                      questionable decisions that don't align with our community values..."
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <span className="mr-4 flex items-center">
                        <Flag size={12} className="mr-1" /> 1 report
                      </span>
                      <span className="mr-4 flex items-center">
                        <Eye size={12} className="mr-1" /> 67 views
                      </span>
                      <span className="flex items-center">
                        <Clock size={12} className="mr-1" /> Awaiting review
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        View Context
                      </Button>
                      <Button size="sm">Approve</Button>
                      <Button size="sm" variant="secondary">
                        Request Edit
                      </Button>
                      <Button size="sm" variant="destructive">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Broadcast Message */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
                    AD
                  </div>
                  <div className="ml-3 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">Admin → All Members</h3>
                        <p className="text-xs text-gray-500">Broadcast message • 2 days ago</p>
                      </div>
                      <Badge variant="secondary">Broadcast</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      "Welcome to our new community platform! We're excited to have you here. Please take a moment to
                      complete your profile and introduce yourself to the community."
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <span className="mr-4 flex items-center">
                        <Eye size={12} className="mr-1" /> 234 views
                      </span>
                      <span className="mr-4 flex items-center">
                        <MessageSquare size={12} className="mr-1" /> 45 replies
                      </span>
                      <span className="flex items-center">
                        <CheckCircle size={12} className="mr-1" /> 89% delivery rate
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        View Analytics
                      </Button>
                      <Button size="sm">Send Follow-up</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Moderation Dialog */}
      <Dialog open={showModerationDialog} onOpenChange={setShowModerationDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message Moderation</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Message Details</h4>
                <p className="text-sm text-gray-600">Author: {selectedMessage.author}</p>
                <p className="text-sm text-gray-600">Content: {selectedMessage.content}</p>
              </div>
              <div>
                <Label htmlFor="moderation-notes">Moderation Notes</Label>
                <Textarea id="moderation-notes" rows={3} placeholder="Add notes about your moderation decision..." />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowModerationDialog(false)}>
                  Cancel
                </Button>
                <Button variant="secondary" onClick={() => handleWarnUser(selectedMessage.author)}>
                  Warn User
                </Button>
                <Button variant="destructive" onClick={() => handleRemoveMessage(selectedMessage.id)}>
                  Remove Message
                </Button>
                <Button onClick={() => handleMarkSafe(selectedMessage.id)}>Mark as Safe</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Message Management Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Message Management Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <MessageSquare size={20} />
                </div>
                <h3 className="ml-3 text-sm font-medium text-gray-900">Broadcast Messages</h3>
              </div>
              <p className="text-xs text-gray-600 mb-4">
                Send important announcements and updates to all members or specific groups with delivery tracking.
              </p>
              <Button className="w-full" onClick={() => setShowBroadcastDialog(true)}>
                Create Broadcast
              </Button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <Flag size={20} />
                </div>
                <h3 className="ml-3 text-sm font-medium text-gray-900">Content Moderation</h3>
              </div>
              <p className="text-xs text-gray-600 mb-4">
                Review flagged messages, manage reports, and take action on content that violates community guidelines.
              </p>
              <Button className="w-full" variant="destructive" onClick={() => setActiveTab("flagged")}>
                Review Flagged
              </Button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Eye size={20} />
                </div>
                <h3 className="ml-3 text-sm font-medium text-gray-900">Message Analytics</h3>
              </div>
              <p className="text-xs text-gray-600 mb-4">
                Track message engagement, delivery rates, and communication patterns across your community.
              </p>
              <Button
                className="w-full"
                variant="secondary"
                onClick={() => (window.location.href = "/admin/analytics")}
              >
                View Analytics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
