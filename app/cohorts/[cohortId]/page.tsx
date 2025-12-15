"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { cohorts, cohortPosts, members, currentUser } from "@/lib/data"
import { Calendar, MapPin, Users, FileText, MessageSquare, Heart, Share2, Download, Target } from "lucide-react"

export default function CohortPage() {
  const params = useParams()
  const cohortId = params.cohortId as string
  const [activeTab, setActiveTab] = useState("overview")

  const cohort = cohorts.find((c) => c.id === cohortId)
  const posts = cohortPosts[cohortId as keyof typeof cohortPosts] || []
  const cohortMembers = members.filter(
    (member) =>
      member.cohort.toLowerCase().includes(cohort?.name.toLowerCase().split(" ")[0] || "") &&
      member.cohort.includes(cohort?.year.toString() || ""),
  )

  if (!cohort) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Cohort not found</h1>
          <p className="text-gray-600 mt-2">The cohort you're looking for doesn't exist.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            Return to Community Wall
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10">
      <div className="flex flex-col md:flex-row">
        {/* Left Sidebar - Navigation */}
        <div className="w-full md:w-1/4 pr-0 md:pr-6 mb-6 md:mb-0">
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="flex flex-col">
              <Link href="/" className="px-6 py-4 text-gray-500 hover:text-blue-600 font-medium text-sm">
                Community Wall
              </Link>
              <Link href="/directory" className="px-6 py-4 text-gray-500 hover:text-blue-600 font-medium text-sm">
                Member Directory
              </Link>
              <Link href="/resources" className="px-6 py-4 text-gray-500 hover:text-blue-600 font-medium text-sm">
                Resources
              </Link>
              <Link href="/ai-search" className="px-6 py-4 text-gray-500 hover:text-blue-600 font-medium text-sm">
                AI Search
              </Link>
              <Link
                href={`/cohorts/${cohortId}`}
                className="px-6 py-4 text-blue-600 border-l-4 border-blue-600 bg-blue-50 font-medium text-sm"
              >
                {cohort.name}
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium text-gray-900 mb-4">My Sub-Groups</h3>
            <ul>
              {currentUser.subgroups.map((group, index) => (
                <li key={index} className="flex items-center py-2">
                  <span
                    className={`w-2 h-2 bg-${index === 0 ? "blue" : index === 1 ? "green" : index === 2 ? "purple" : "yellow"}-600 rounded-full`}
                  ></span>
                  <Link href="#" className="ml-2 text-sm text-gray-700 hover:text-blue-600">
                    {group}
                  </Link>
                </li>
              ))}
            </ul>
            <button className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-md text-sm font-medium hover:bg-gray-200">
              <Link href="#" className="block w-full h-full">
                Browse All Sub-Groups
              </Link>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full md:w-3/4">
          {/* Cohort Header */}
          <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
              <img
                src={cohort.coverImage || "/placeholder.svg"}
                alt={cohort.name}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-6 text-white">
                <h1 className="text-3xl font-bold">{cohort.name}</h1>
                <p className="text-lg opacity-90">{cohort.description}</p>
              </div>
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    cohort.status === "completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {cohort.status === "completed" ? "Completed" : "Active"}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{cohort.totalMembers}</div>
                  <div className="text-sm text-gray-600">Total Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{cohort.activeMembers}</div>
                  <div className="text-sm text-gray-600">Active Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{cohort.enterprises}</div>
                  <div className="text-sm text-gray-600">Enterprises Visited</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{cohort.duration}</div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {cohort.themes.map((theme, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {theme}
                  </span>
                ))}
              </div>

              <div className="flex items-center text-sm text-gray-600 space-x-4">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  {cohort.startDate} - {cohort.endDate}
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-1" />
                  {cohort.location}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: "overview", label: "Overview", icon: Target },
                  { id: "members", label: "Members", icon: Users },
                  { id: "activity", label: "Activity", icon: MessageSquare },
                  { id: "resources", label: "Resources", icon: FileText },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <tab.icon size={16} className="mr-2" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Highlights */}

              {/* Stats */}
            </div>
          )}

          {activeTab === "members" && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Cohort Members</h3>
                <span className="text-sm text-gray-600">{cohortMembers.length} members</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cohortMembers.map((member) => (
                  <div
                    key={member.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center mb-3">
                      <div
                        className={`w-12 h-12 rounded-full bg-${member.color}-100 flex items-center justify-center text-${member.color}-600 font-bold`}
                      >
                        {member.initials}
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">{member.name}</h4>
                        <p className="text-xs text-gray-500">{member.title}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{member.location}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full bg-${post.author.color}-100 flex items-center justify-center text-${post.author.color}-600 font-bold`}
                        >
                          {post.author.initials}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium">{post.author.name}</h3>
                          <p className="text-xs text-gray-500">{post.author.title}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{post.timestamp}</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-gray-800">{post.content}</p>
                      {post.images && (
                        <div className="mt-3">
                          <img
                            src={post.images[0] || "/placeholder.svg"}
                            alt="Post image"
                            className="rounded-lg max-w-full h-48 object-cover"
                          />
                        </div>
                      )}
                      {post.attachment && (
                        <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center">
                          <FileText className="text-gray-500" size={20} />
                          <div className="ml-3">
                            <h4 className="text-sm font-medium">{post.attachment.name}</h4>
                            <p className="text-xs text-gray-500">PDF Document • {post.attachment.size}</p>
                          </div>
                          <button className="ml-auto">
                            <Download size={16} className="text-gray-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center text-gray-500 hover:text-red-500">
                          <Heart size={16} className="mr-1" />
                          {post.likes}
                        </button>
                        <button className="flex items-center text-gray-500 hover:text-blue-500">
                          <MessageSquare size={16} className="mr-1" />
                          {post.comments.length}
                        </button>
                        <button className="flex items-center text-gray-500 hover:text-blue-500">
                          <Share2 size={16} className="mr-1" />
                          Share
                        </button>
                      </div>
                    </div>
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex items-start mb-3">
                        <div
                          className={`w-8 h-8 rounded-full bg-${comment.author.color}-100 flex items-center justify-center text-${comment.author.color}-600 font-bold text-xs`}
                        >
                          {comment.author.initials}
                        </div>
                        <div className="ml-2 bg-white p-2 rounded-lg shadow-sm flex-grow">
                          <h4 className="text-xs font-medium">{comment.author.name}</h4>
                          <p className="text-xs text-gray-800">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "resources" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Cohort Resources</h3>
              <div className="text-center py-8">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Cohort-specific resources will be displayed here.</p>
                <p className="text-sm text-gray-400 mt-2">
                  This section will show resources shared specifically within this cohort.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
