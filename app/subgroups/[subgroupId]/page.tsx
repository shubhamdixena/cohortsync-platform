"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Users, MessageSquare, Calendar, Settings, UserPlus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const subgroups = {
  "ai-tech": {
    id: "ai-tech",
    name: "AI & Tech",
    description: "Exploring artificial intelligence and emerging technologies for social impact",
    memberCount: 24,
    category: "Technology",
    isPrivate: false,
    createdDate: "March 2023",
    moderators: ["Rahul Kumar", "Priya Sharma"],
    tags: ["AI", "Technology", "Innovation", "Social Impact"],
    members: [
      { id: "1", name: "Rahul Kumar", initials: "RK", title: "Tech Entrepreneur", isOnline: true },
      { id: "2", name: "Priya Sharma", initials: "PS", title: "AI Researcher", isOnline: false },
      { id: "3", name: "Amit Patel", initials: "AP", title: "Data Scientist", isOnline: true },
    ],
    posts: [
      {
        id: "1",
        author: { name: "Rahul Kumar", initials: "RK", title: "Tech Entrepreneur" },
        content:
          "Excited to share insights from the recent AI for Good summit. The potential for AI to solve social challenges is immense. Key takeaways: 1) Focus on ethical AI development 2) Ensure inclusive datasets 3) Build with community feedback",
        timestamp: "2 hours ago",
        comments: 5,
      },
      {
        id: "2",
        author: { name: "Priya Sharma", initials: "PS", title: "AI Researcher" },
        content:
          "Looking for collaborators on a machine learning project for predicting crop yields in drought-prone areas. This could help farmers make better decisions about planting and resource allocation.",
        timestamp: "5 hours ago",
        comments: 8,
      },
    ],
  },
  "startup-founders": {
    id: "startup-founders",
    name: "Startup Founders",
    description: "A community of entrepreneurs sharing experiences and supporting each other's journey",
    memberCount: 18,
    category: "Entrepreneurship",
    isPrivate: false,
    createdDate: "January 2023",
    moderators: ["Sanjay Mehta"],
    tags: ["Startups", "Entrepreneurship", "Funding", "Growth"],
    members: [
      { id: "3", name: "Sanjay Mehta", initials: "SM", title: "Sustainable Agriculture Expert", isOnline: true },
      { id: "4", name: "Meera Gupta", initials: "MG", title: "Healthcare Innovation", isOnline: false },
    ],
    posts: [
      {
        id: "1",
        author: { name: "Sanjay Mehta", initials: "SM", title: "Sustainable Agriculture Expert" },
        content:
          "Just completed our Series A funding round! Key lessons learned: 1) Have a clear growth strategy 2) Build strong relationships with investors early 3) Focus on unit economics. Happy to share more details with fellow founders.",
        timestamp: "1 day ago",
        comments: 12,
      },
    ],
  },
}

export default function SubgroupPage() {
  const params = useParams()
  const subgroupId = params.subgroupId as string
  const [activeTab, setActiveTab] = useState("posts")

  const subgroup = subgroups[subgroupId as keyof typeof subgroups]

  if (!subgroup) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Sub-group not found</h1>
          <p className="text-gray-600 mt-2">The sub-group you're looking for doesn't exist.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            Return to Community Wall
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center space-x-2">
        <Link href="/" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <span className="text-gray-500">Back to Community Wall</span>
      </div>

      {/* Sub-group Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{subgroup.name}</CardTitle>
              <p className="text-gray-600">{subgroup.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Users size={16} className="mr-1" />
                  {subgroup.memberCount} members
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  Created {subgroup.createdDate}
                </div>
                {subgroup.isPrivate && <Badge variant="secondary">Private</Badge>}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <UserPlus size={16} className="mr-1" />
                Join Group
              </Button>
              <Button variant="outline" size="sm">
                <Settings size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {subgroup.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <Card>
        <CardHeader>
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab("posts")}
              className={`pb-2 border-b-2 font-medium text-sm ${
                activeTab === "posts"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <MessageSquare size={16} className="inline mr-1" />
              Posts
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`pb-2 border-b-2 font-medium text-sm ${
                activeTab === "members"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Users size={16} className="inline mr-1" />
              Members
            </button>
          </div>
        </CardHeader>
      </Card>

      {/* Tab Content */}
      {activeTab === "posts" && (
        <div className="space-y-4">
          {/* Create Post */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  JS
                </div>
                <div className="flex-1">
                  <Button variant="outline" className="w-full justify-start text-gray-500 bg-transparent">
                    Share your thoughts with the group...
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts */}
          {subgroup.posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="pt-6">
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
                    <p className="text-gray-800 leading-relaxed mb-3">{post.content}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <button className="hover:text-blue-600">
                        <MessageSquare size={16} className="inline mr-1" />
                        {post.comments} comments
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "members" && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Moderators</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subgroup.members.slice(0, 2).map((member) => (
                    <div key={member.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold">
                        {member.initials}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{member.name}</h4>
                        <p className="text-sm text-gray-500">{member.title}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {member.isOnline && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                        <Badge variant="secondary">Moderator</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">All Members</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subgroup.members.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold">
                        {member.initials}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{member.name}</h4>
                        <p className="text-sm text-gray-500">{member.title}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {member.isOnline && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                        <Button variant="outline" size="sm">
                          Message
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
