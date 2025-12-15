"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Mail,
  Calendar,
  Users,
  UserCheck,
  UserX,
  Clock,
  Eye,
  Phone,
  MapPin,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

type Member = {
  id: string
  email: string
  name: string
  role: string
  status: string
  profile?: {
    firstName: string
    lastName: string
    location: string
    headline: string
    cohort: string
    expertise: string
    skills: string
  }
  createdAt: string
}

export default function MembersManagement() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showMemberDialog, setShowMemberDialog] = useState(false)
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [messageContent, setMessageContent] = useState("")
  const [approvalAction, setApprovalAction] = useState("")
  const [approvalReason, setApprovalReason] = useState("")

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      }
    } catch (error) {
      console.error('Error fetching members:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveMember = (member: Member) => {
    setSelectedMember(member)
    setApprovalAction("approve")
    setShowApprovalDialog(true)
  }

  const handleRejectMember = (member: Member) => {
    setSelectedMember(member)
    setApprovalAction("reject")
    setShowApprovalDialog(true)
  }

  const handleConfirmApproval = async () => {
    if (!selectedMember) return

    try {
      const newStatus = approvalAction === "approve" ? "active" : "rejected"
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedMember.id,
          status: newStatus
        })
      })

      if (response.ok) {
        alert('Member status updated successfully')
        // Refresh member list
        fetchMembers()
      } else {
        const error = await response.json()
        alert('Failed to update member status: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error updating member status:', error)
      alert('Error updating member status')
    }

    setShowApprovalDialog(false)
    setApprovalReason("")
    setSelectedMember(null)
    setApprovalAction("")
  }

  const handleSendMessage = () => {
    console.log(`Sending message to ${selectedMember?.name}: ${messageContent}`)
    setShowMessageDialog(false)
    setMessageContent("")
    setSelectedMember(null)
  }

  const openMessageDialog = (member: Member) => {
    setSelectedMember(member)
    setShowMessageDialog(true)
  }

  const openViewDialog = useCallback((member: Member) => {
    setSelectedMember(member)
    setShowViewDialog(true)
  }, [])

  // Filter members based on status tab - memoized
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesTab = 
        activeTab === "all" ||
        (activeTab === "active" && member.status === "active") ||
        (activeTab === "pending" && member.status === "pending") ||
        (activeTab === "suspended" && member.status === "suspended")
      
      const matchesSearch = 
        !searchQuery ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.profile?.headline?.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesTab && matchesSearch
    })
  }, [members, activeTab, searchQuery])

  const getStatusBadgeVariant = useCallback((status: string) => {
    switch (status) {
      case "active": return "default"
      case "pending": return "secondary"
      case "suspended": return "destructive"
      default: return "outline"
    }
  }, [])

  const getInitials = useCallback((name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }, [])

  // Mock member data for view dialog
  const getMemberDetails = (name) => {
    const members = {
      "Anjali Patel": {
        name: "Anjali Patel",
        email: "anjali@example.com",
        phone: "+91 98765 43210",
        title: "Social Impact Consultant",
        location: "Mumbai, India",
        linkedin: "https://linkedin.com/in/anjalipatel",
        bio: "Passionate about creating sustainable social impact through innovative business models. 8+ years experience in consulting for NGOs and social enterprises.",
        joinDate: "March 15, 2023",
        cohort: "2023 Batch",
        subgroups: ["Mumbai Chapter", "Social Entrepreneurs"],
        stats: {
          posts: 45,
          comments: 128,
          connections: 67,
          resourcesShared: 12,
        },
        recentActivity: [
          "Posted about upcoming Mumbai meetup",
          "Shared funding opportunity resource",
          "Commented on social impact discussion",
        ],
      },
      "Sanjay Kumar": {
        name: "Sanjay Kumar",
        email: "sanjay@example.com",
        phone: "+91 87654 32109",
        title: "Tech Entrepreneur",
        location: "Bangalore, India",
        linkedin: "https://linkedin.com/in/sanjaykumar",
        bio: "Building innovative tech solutions for rural education. Former software engineer turned social entrepreneur with focus on EdTech.",
        applicationDate: "2 days ago",
        referredBy: "Vikram Thakur",
        industry: "Technology",
        experience: "5+ years",
        applicationReason:
          "Looking to connect with like-minded social entrepreneurs and learn from experienced mentors in the community.",
      },
    }
    return members[name] || {}
  }

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Member Management</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage community members, review applications, and monitor member activity across your platform.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Button size="sm">
                <Plus size={14} className="mr-1" /> Add Member
              </Button>
              <Button variant="outline" size="sm">
                <Filter size={14} className="mr-1" /> Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Member Tabs */}
      <Card>
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("all")}
              className={`${activeTab === "all" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-3 px-4 border-b-2 font-medium text-xs`}
            >
              All Members{" "}
              <Badge variant="secondary" className="ml-1 text-xs">
                247
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`${activeTab === "active" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-3 px-4 border-b-2 font-medium text-xs`}
            >
              Active{" "}
              <Badge variant="secondary" className="ml-1 text-xs">
                189
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`${activeTab === "pending" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Pending Approval{" "}
              <Badge variant="destructive" className="ml-1">
                3
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab("inactive")}
              className={`${activeTab === "inactive" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Inactive{" "}
              <Badge variant="outline" className="ml-1">
                55
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
                placeholder="Search members..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>
            <div className="flex space-x-2">
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Cohorts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">Cohort 2023</SelectItem>
                  <SelectItem value="2022">Cohort 2022</SelectItem>
                  <SelectItem value="2021">Cohort 2021</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Sub-Groups" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mumbai">Mumbai Chapter</SelectItem>
                  <SelectItem value="delhi">Delhi Chapter</SelectItem>
                  <SelectItem value="bangalore">Bangalore Chapter</SelectItem>
                  <SelectItem value="social">Social Entrepreneurs</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter size={16} />
              </Button>
            </div>
          </div>
        </CardContent>

        {/* Members List */}
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading members...</div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No members found</div>
          ) : (
            <div className="space-y-4">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className={`border rounded-lg p-4 ${
                    member.status === "active"
                      ? "border-green-200 bg-green-50"
                      : member.status === "pending"
                        ? "border-yellow-200 bg-yellow-50"
                        : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
                        {getInitials(member.name)}
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                          <Badge variant={getStatusBadgeVariant(member.status)}>
                            {member.status === "active" ? "Active" : member.status === "pending" ? "Pending Approval" : "Suspended"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {member.profile?.headline || member.role} • {member.profile?.location || "Location not set"}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-500">
                              {member.status === "pending" ? "Applied:" : "Joined:"}
                            </p>
                            <p className="text-xs font-medium">
                              {new Date(member.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Cohort:</p>
                            <p className="text-xs font-medium">{member.profile?.cohort || "Not set"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Role:</p>
                            <p className="text-xs font-medium">{member.role}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Status:</p>
                            <p className="text-xs font-medium">{member.status}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Mail size={12} className="mr-1" /> {member.email}
                          </span>
                          <span className="flex items-center">
                            <Calendar size={12} className="mr-1" /> Joined{" "}
                            {new Date(member.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {member.status === "pending" ? (
                        <>
                          <Button size="sm" onClick={() => handleApproveMember(member)}>
                            <UserCheck size={12} className="mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleRejectMember(member)}>
                            <UserX size={12} className="mr-1" /> Reject
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => openViewDialog(member)}>
                            <Eye size={12} className="mr-1" /> View
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => openMessageDialog(member)}>
                            <Mail size={16} />
                          </Button>
                        </>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {member.status === "pending" ? (
                            <>
                              <DropdownMenuItem onClick={() => openViewDialog(member)}>View Details</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openMessageDialog(member)}>Send Message</DropdownMenuItem>
                            </>
                          ) : (
                            <>
                              <DropdownMenuItem>Edit Member</DropdownMenuItem>
                              <DropdownMenuItem>View Activity</DropdownMenuItem>
                              <DropdownMenuItem>Make Admin</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Suspend Member</DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Member Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0">
                  {getInitials(selectedMember.name)}
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900">{selectedMember.name}</h3>
                  <p className="text-sm text-gray-600">{selectedMember.profile?.headline || selectedMember.role}</p>
                  <Badge className="mt-2" variant={getStatusBadgeVariant(selectedMember.status)}>
                    {selectedMember.status}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Email</Label>
                  <p className="text-sm font-medium">{selectedMember.email}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Location</Label>
                  <p className="text-sm font-medium">{selectedMember.profile?.location || "Not set"}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Cohort</Label>
                  <p className="text-sm font-medium">{selectedMember.profile?.cohort || "Not set"}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Role</Label>
                  <p className="text-sm font-medium">{selectedMember.role}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Joined Date</Label>
                  <p className="text-sm font-medium">{new Date(selectedMember.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">LinkedIn</Label>
                  <p className="text-sm font-medium">{selectedMember.profile?.linkedinProfile || "Not provided"}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval/Rejection Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{approvalAction === "approve" ? "Approve Member" : "Reject Application"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {approvalAction === "approve"
                ? `Are you sure you want to approve ${selectedMember?.name}'s membership application?`
                : `Are you sure you want to reject ${selectedMember?.name}'s membership application?`}
            </p>
            <div>
              <Label htmlFor="reason">
                {approvalAction === "approve" ? "Welcome message (optional)" : "Reason for rejection"}
              </Label>
              <Textarea
                id="reason"
                rows={3}
                value={approvalReason}
                onChange={(e) => setApprovalReason(e.target.value)}
                placeholder={
                  approvalAction === "approve"
                    ? "Welcome to the community! We're excited to have you..."
                    : "Please provide a reason for rejection..."
                }
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmApproval}
                variant={approvalAction === "approve" ? "default" : "destructive"}
              >
                {approvalAction === "approve" ? "Approve Member" : "Reject Application"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message to {selectedMember?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={4}
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Enter your message..."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendMessage}>Send Message</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Member Management Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Member Management Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Plus size={20} />
                </div>
                <h3 className="ml-3 text-sm font-medium text-gray-900">Bulk Member Import</h3>
              </div>
              <p className="text-xs text-gray-600 mb-4">
                Import multiple members at once using CSV upload with automatic validation and sub-group assignment.
              </p>
              <Button className="w-full">Import Members</Button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Mail size={20} />
                </div>
                <h3 className="ml-3 text-sm font-medium text-gray-900">Member Communication</h3>
              </div>
              <p className="text-xs text-gray-600 mb-4">
                Send targeted messages to specific member groups, cohorts, or individual members with tracking.
              </p>
              <Button className="w-full" variant="secondary">
                Send Message
              </Button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <Users size={20} />
                </div>
                <h3 className="ml-3 text-sm font-medium text-gray-900">Member Analytics</h3>
              </div>
              <p className="text-xs text-gray-600 mb-4">
                View detailed analytics on member engagement, activity patterns, and community participation.
              </p>
              <Button className="w-full" variant="secondary">
                View Analytics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Member Dialog OLD */}
      <Dialog style={{display: "none"}} open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-6">
              {(() => {
                const member = getMemberDetails(selectedMember)
                return (
                  <>
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0">
                        {member.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-gray-600">{member.title}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <MapPin size={14} className="mr-1" /> {member.location}
                          </span>
                          {member.linkedin && (
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 hover:text-blue-800"
                            >
                              <ExternalLink size={14} className="mr-1" /> LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <Mail size={14} className="mr-2 text-gray-400" />
                            <span>{member.email}</span>
                          </div>
                          {member.phone && (
                            <div className="flex items-center">
                              <Phone size={14} className="mr-2 text-gray-400" />
                              <span>{member.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Membership Details</h4>
                        <div className="space-y-2 text-sm">
                          {member.joinDate && (
                            <div>
                              <span className="text-gray-500">Joined:</span> {member.joinDate}
                            </div>
                          )}
                          {member.applicationDate && (
                            <div>
                              <span className="text-gray-500">Applied:</span> {member.applicationDate}
                            </div>
                          )}
                          {member.cohort && (
                            <div>
                              <span className="text-gray-500">Cohort:</span> {member.cohort}
                            </div>
                          )}
                          {member.referredBy && (
                            <div>
                              <span className="text-gray-500">Referred by:</span> {member.referredBy}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {member.bio && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Bio</h4>
                          <p className="text-sm text-gray-600">{member.bio}</p>
                        </div>
                      </>
                    )}

                    {member.applicationReason && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Application Reason</h4>
                          <p className="text-sm text-gray-600">{member.applicationReason}</p>
                        </div>
                      </>
                    )}

                    {member.subgroups && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Sub-Groups</h4>
                          <div className="flex flex-wrap gap-2">
                            {member.subgroups.map((group, index) => (
                              <Badge key={index} variant="secondary">
                                {group}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {member.stats && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Activity Stats</h4>
                          <div className="grid grid-cols-4 gap-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-blue-600">{member.stats.posts}</p>
                              <p className="text-xs text-gray-500">Posts</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-600">{member.stats.comments}</p>
                              <p className="text-xs text-gray-500">Comments</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-purple-600">{member.stats.connections}</p>
                              <p className="text-xs text-gray-500">Connections</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-orange-600">{member.stats.resourcesShared}</p>
                              <p className="text-xs text-gray-500">Resources</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {member.recentActivity && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Recent Activity</h4>
                          <div className="space-y-2">
                            {member.recentActivity.map((activity, index) => (
                              <div key={index} className="flex items-center text-sm text-gray-600">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                                {activity}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                        Close
                      </Button>
                      <Button
                        onClick={() => {
                          setShowViewDialog(false)
                          openMessageDialog(selectedMember)
                        }}
                      >
                        Send Message
                      </Button>
                    </div>
                  </>
                )
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval/Rejection Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{approvalAction === "approve" ? "Approve Member" : "Reject Application"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {approvalAction === "approve"
                ? `Are you sure you want to approve ${selectedMember}'s membership application?`
                : `Are you sure you want to reject ${selectedMember}'s membership application?`}
            </p>
            <div>
              <Label htmlFor="reason">
                {approvalAction === "approve" ? "Welcome message (optional)" : "Reason for rejection"}
              </Label>
              <Textarea
                id="reason"
                rows={3}
                value={approvalReason}
                onChange={(e) => setApprovalReason(e.target.value)}
                placeholder={
                  approvalAction === "approve"
                    ? "Welcome to the community! We're excited to have you..."
                    : "Please provide a reason for rejection..."
                }
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmApproval}
                variant={approvalAction === "approve" ? "default" : "destructive"}
              >
                {approvalAction === "approve" ? "Approve Member" : "Reject Application"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message to {selectedMember}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={4}
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Enter your message..."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendMessage}>Send Message</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Member Management Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Member Management Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Plus size={20} />
                </div>
                <h3 className="ml-3 text-sm font-medium text-gray-900">Bulk Member Import</h3>
              </div>
              <p className="text-xs text-gray-600 mb-4">
                Import multiple members at once using CSV upload with automatic validation and sub-group assignment.
              </p>
              <Button className="w-full">Import Members</Button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Mail size={20} />
                </div>
                <h3 className="ml-3 text-sm font-medium text-gray-900">Member Communication</h3>
              </div>
              <p className="text-xs text-gray-600 mb-4">
                Send targeted messages to specific member groups, cohorts, or individual members with tracking.
              </p>
              <Button className="w-full" variant="secondary">
                Send Message
              </Button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <Users size={20} />
                </div>
                <h3 className="ml-3 text-sm font-medium text-gray-900">Member Analytics</h3>
              </div>
              <p className="text-xs text-gray-600 mb-4">
                View detailed analytics on member engagement, activity patterns, and community participation.
              </p>
              <Button className="w-full" variant="secondary">
                View Analytics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
