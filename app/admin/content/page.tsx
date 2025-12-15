"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  Flag,
  Book,
  FileText,
  MessageSquare,
  Eye,
  Download,
  ThumbsUp,
  ExternalLink,
  Clock,
} from "lucide-react"
import { useUser } from "@/lib/user-context"
import Link from "next/link"
import { BarChart3, Users, Mail, UserPlus, Megaphone, Layers, Upload, BookOpen, Settings } from "lucide-react"

export default function ContentManagement() {
  const { userInfo } = useUser()
  const [activeTab, setActiveTab] = useState("all")

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Content Management</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage posts, announcements, resources, and moderate content across your community.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button className="bg-blue-600 text-white px-3 py-2 rounded-md text-xs font-medium hover:bg-blue-700 flex items-center">
              <FileText size={14} className="mr-1" /> Create Content
            </button>
            <button className="bg-white text-gray-700 border border-gray-300 px-3 py-2 rounded-md text-xs font-medium hover:bg-gray-50 flex items-center">
              <Filter size={14} className="mr-1" /> Content Settings
            </button>
          </div>
        </div>
      </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`${activeTab === "all" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-3 px-4 border-b-2 font-medium text-xs`}
                >
                  All Content{" "}
                  <span className="ml-1 bg-gray-100 text-gray-700 py-0.5 px-2 rounded-full text-xs">87</span>
                </button>
                <button
                  onClick={() => setActiveTab("flagged")}
                  className={`${activeTab === "flagged" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-3 px-4 border-b-2 font-medium text-xs`}
                >
                  Flagged <span className="ml-1 bg-red-100 text-red-800 py-0.5 px-2 rounded-full text-xs">1</span>
                </button>
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`${activeTab === "pending" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-3 px-4 border-b-2 font-medium text-xs`}
                >
                  Pending Approval{" "}
                  <span className="ml-1 bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full text-xs">3</span>
                </button>
                <button
                  onClick={() => setActiveTab("archived")}
                  className={`${activeTab === "archived" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-3 px-4 border-b-2 font-medium text-xs`}
                >
                  Archived <span className="ml-1 bg-gray-100 text-gray-700 py-0.5 px-2 rounded-full text-xs">12</span>
                </button>
              </nav>
            </div>

            {/* Search and Filters */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-grow relative">
                  <input
                    type="text"
                    placeholder="Search content..."
                    className="w-full bg-gray-100 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <Search size={16} />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <select className="bg-gray-100 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white">
                    <option value="">All Types</option>
                    <option value="post">Posts</option>
                    <option value="announcement">Announcements</option>
                    <option value="resource">Resources</option>
                  </select>
                  <select className="bg-gray-100 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white">
                    <option value="">All Sub-Groups</option>
                    <option value="mumbai">Mumbai Chapter</option>
                    <option value="delhi">Delhi Chapter</option>
                    <option value="bangalore">Bangalore Chapter</option>
                    <option value="social">Social Entrepreneurs</option>
                  </select>
                  <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200">
                    <Filter size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Flagged Content Alert */}
            {activeTab === "flagged" && (
              <div className="p-6 bg-red-50 border-b border-red-200">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs flex-shrink-0">
                    <Flag size={16} />
                  </div>
                  <div className="ml-3 flex-grow">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">Content Flagged for Review</p>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">High Priority</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      A post in General Discussion has been flagged by multiple members for potentially violating
                      community guidelines.
                    </p>
                    <div className="mt-3 flex space-x-2">
                      <button className="bg-red-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-700">
                        Review Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content List */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Content Item - Flagged */}
                <div className="border border-red-200 rounded-lg p-4 bg-red-50 transition-all hover:shadow-md hover:-translate-y-1">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold text-xs flex-shrink-0">
                      SK
                    </div>
                    <div className="ml-3 flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Startup Funding Opportunity</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Posted by Sanjay Kumar • 2 hours ago • General Discussion
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full h-fit">Flagged</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Looking for co-founders for my new startup. We've secured initial funding from [External
                        Investment Firm]. Contact me at example@email.com for details...
                      </p>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <span className="mr-3 flex items-center">
                          <MessageSquare size={12} className="mr-1" /> 5 comments
                        </span>
                        <span className="mr-3 flex items-center">
                          <Eye size={12} className="mr-1" /> 42 views
                        </span>
                        <span className="mr-3 flex items-center">
                          <Flag size={12} className="mr-1" /> 3 reports
                        </span>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <button className="bg-white text-gray-700 border border-gray-300 px-3 py-1 rounded text-xs font-medium hover:bg-gray-50">
                          View
                        </button>
                        <button className="bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-yellow-700">
                          Edit
                        </button>
                        <button className="bg-red-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-700">
                          Remove
                        </button>
                        <button className="bg-white text-blue-600 border border-blue-300 px-3 py-1 rounded text-xs font-medium hover:bg-blue-50">
                          Contact Author
                        </button>
                      </div>
                      <div className="mt-3 p-2 bg-red-100 rounded-md">
                        <p className="text-xs text-red-800 flex items-center">
                          <Flag size={12} className="mr-1" /> <span className="font-medium">Reason for flagging:</span>{" "}
                          Contains external promotional content and personal contact information
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Item - Announcement */}
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50 transition-all hover:shadow-md hover:-translate-y-1">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
                      RK
                    </div>
                    <div className="ml-3 flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">May Meetup Details</p>
                          <p className="text-xs text-gray-500 mt-1">Posted by You • 1 day ago • Announcements</p>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full h-fit">
                          Announcement
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Join us for our monthly meetup on May 28th at 6 PM. We'll be discussing entrepreneurship
                        opportunities and networking...
                      </p>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <span className="mr-3 flex items-center">
                          <MessageSquare size={12} className="mr-1" /> 18 comments
                        </span>
                        <span className="mr-3 flex items-center">
                          <Eye size={12} className="mr-1" /> 124 views
                        </span>
                        <span className="mr-3 flex items-center">
                          <ThumbsUp size={12} className="mr-1" /> 32 likes
                        </span>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <button className="bg-white text-gray-700 border border-gray-300 px-3 py-1 rounded text-xs font-medium hover:bg-gray-50">
                          View
                        </button>
                        <button className="bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-yellow-700">
                          Edit
                        </button>
                        <button className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-purple-700">
                          Pin to Top
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Item - Resource */}
                <div className="border border-green-200 rounded-lg p-4 transition-all hover:shadow-md hover:-translate-y-1">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs flex-shrink-0">
                      AP
                    </div>
                    <div className="ml-3 flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Startup Funding Guide</p>
                          <p className="text-xs text-gray-500 mt-1">Posted by Anjali Patel • 1 day ago • Resources</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full h-fit">
                          Resource
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        A comprehensive guide to securing funding for early-stage startups in India, including
                        government schemes, angel investors, and venture capital...
                      </p>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <span className="mr-3 flex items-center">
                          <MessageSquare size={12} className="mr-1" /> 12 comments
                        </span>
                        <span className="mr-3 flex items-center">
                          <Eye size={12} className="mr-1" /> 78 views
                        </span>
                        <span className="mr-3 flex items-center">
                          <Download size={12} className="mr-1" /> 45 downloads
                        </span>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <button className="bg-white text-gray-700 border border-gray-300 px-3 py-1 rounded text-xs font-medium hover:bg-gray-50">
                          View
                        </button>
                        <button className="bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-yellow-700">
                          Edit
                        </button>
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700">
                          Feature
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Item - Regular Post */}
                <div className="border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md hover:-translate-y-1">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs flex-shrink-0">
                      VT
                    </div>
                    <div className="ml-3 flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Upcoming Networking Event</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Posted by Vikram Thakur • 3 hours ago • Mumbai Chapter
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full h-fit">Post</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        I'm organizing a networking event for entrepreneurs in Mumbai next month. Would anyone be
                        interested in collaborating or attending?
                      </p>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <span className="mr-3 flex items-center">
                          <MessageSquare size={12} className="mr-1" /> 8 comments
                        </span>
                        <span className="mr-3 flex items-center">
                          <Eye size={12} className="mr-1" /> 42 views
                        </span>
                        <span className="mr-3 flex items-center">
                          <ThumbsUp size={12} className="mr-1" /> 15 likes
                        </span>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <button className="bg-white text-gray-700 border border-gray-300 px-3 py-1 rounded text-xs font-medium hover:bg-gray-50">
                          View
                        </button>
                        <button className="bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-yellow-700">
                          Edit
                        </button>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700">
                          Convert to Announcement
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Item - Pending Approval */}
                <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50 transition-all hover:shadow-md hover:-translate-y-1">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs flex-shrink-0">
                      RM
                    </div>
                    <div className="ml-3 flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Social Impact Measurement Workshop</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Posted by Ritu Mehta • 5 hours ago • Social Entrepreneurs
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full h-fit">
                          Pending Approval
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        I'm hosting a workshop on social impact measurement next week. The workshop will include
                        materials from [External Organization] and cover their proprietary framework...
                      </p>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <span className="mr-3 flex items-center">
                          <ExternalLink size={12} className="mr-1" /> Contains external links
                        </span>
                        <span className="mr-3 flex items-center">
                          <Clock size={12} className="mr-1" /> Awaiting review
                        </span>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <button className="bg-white text-gray-700 border border-gray-300 px-3 py-1 rounded text-xs font-medium hover:bg-gray-50">
                          View
                        </button>
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700">
                          Approve
                        </button>
                        <button className="bg-red-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-700">
                          Reject
                        </button>
                        <button className="bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-yellow-700">
                          Edit & Approve
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center">
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{" "}
                    <span className="font-medium">87</span> content items
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
                  <span className="text-gray-500">...</span>
                  <button className="bg-white text-gray-700 px-3 py-1 rounded-md text-sm border border-gray-300 hover:bg-gray-50">
                    18
                  </button>
                  <button className="bg-white text-gray-700 px-3 py-1 rounded-md text-sm border border-gray-300 hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Content Moderation Guidelines */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Moderation Guidelines</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Handling Flagged Content</h3>
                  <p className="text-xs text-gray-600 mb-3">When content is flagged by community members:</p>
                  <ol className="text-xs text-gray-600 space-y-2 list-decimal pl-4">
                    <li>Review the content against community guidelines</li>
                    <li>Contact the author for clarification if needed</li>
                    <li>Edit or remove content that violates guidelines</li>
                    <li>Provide feedback to the author</li>
                    <li>Document the action taken</li>
                  </ol>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Content Approval Process</h3>
                  <p className="text-xs text-gray-600 mb-3">For content requiring approval:</p>
                  <ol className="text-xs text-gray-600 space-y-2 list-decimal pl-4">
                    <li>Verify the accuracy of information</li>
                    <li>Check for external links and promotional content</li>
                    <li>Ensure compliance with community guidelines</li>
                    <li>Approve, edit, or reject with feedback</li>
                    <li>Categorize and tag appropriately</li>
                  </ol>
                </div>
              </div>
              <div className="mt-4">
                <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  <Book size={16} className="mr-1" /> View Complete Moderation Handbook
                </a>
              </div>
            </div>
          </div>
    </div>
  )
}
