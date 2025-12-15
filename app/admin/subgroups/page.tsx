"use client"

import { useState } from "react"
import { Plus, Search, Users, BarChart, Edit, UserPlus, Megaphone, Upload, Settings } from "lucide-react"
import { useUser } from "@/lib/user-context"
import Link from "next/link"
import { BarChart3, MessageSquare, Layers, Mail, BookOpen } from "lucide-react"

export default function SubgroupsManagement() {
  const { userInfo } = useUser()
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Sub-Groups Management</h1>
            <p className="text-sm text-gray-600 mt-1">
              Create and manage sub-groups to organize your community members by interests, location, or expertise.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button className="bg-blue-600 text-white px-3 py-2 rounded-md text-xs font-medium hover:bg-blue-700 flex items-center">
              <Plus size={14} className="mr-1" /> Create Sub-Group
            </button>
            <button className="bg-white text-gray-700 border border-gray-300 px-3 py-2 rounded-md text-xs font-medium hover:bg-gray-50 flex items-center">
              <Settings size={14} className="mr-1" /> Sub-Group Settings
            </button>
          </div>
        </div>
      </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="Search sub-groups..."
                  className="w-full bg-gray-100 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <Search size={14} />
                </div>
              </div>
              <div className="flex space-x-2">
                <select className="bg-gray-100 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white">
                  <option value="">All Categories</option>
                  <option value="location">Location-based</option>
                  <option value="interest">Interest-based</option>
                  <option value="expertise">Expertise-based</option>
                  <option value="industry">Industry-based</option>
                </select>
                <select className="bg-gray-100 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sub-Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Mumbai Chapter */}
            <div className="bg-white rounded-lg shadow transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                      MC
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">Mumbai Chapter</h3>
                      <p className="text-sm text-gray-500">Location-based</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Connect with entrepreneurs and changemakers in Mumbai. Share local opportunities, events, and
                  collaborate on city-specific initiatives.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Members</p>
                    <p className="text-lg font-semibold text-gray-900">42</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Activity Score</p>
                    <p className="text-lg font-semibold text-gray-900">85%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Posts This Month</p>
                    <p className="text-lg font-semibold text-gray-900">28</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Moderator</p>
                    <p className="text-sm font-medium text-gray-900">Anjali Patel</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center justify-center">
                    <Users size={14} className="mr-1" /> View Members
                  </button>
                  <button
                    className="p-2 text-gray-500 hover:text-blue-600 border border-gray-300 rounded-md hover:border-blue-300"
                    title="Analytics"
                  >
                    <BarChart size={14} />
                  </button>
                  <button
                    className="p-2 text-gray-500 hover:text-blue-600 border border-gray-300 rounded-md hover:border-blue-300"
                    title="Edit"
                  >
                    <Edit size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Delhi Chapter */}
            <div className="bg-white rounded-lg shadow transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg">
                      DC
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">Delhi Chapter</h3>
                      <p className="text-sm text-gray-500">Location-based</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Network with Delhi-based entrepreneurs, policymakers, and social innovators. Focus on government
                  partnerships and policy advocacy.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Members</p>
                    <p className="text-lg font-semibold text-gray-900">38</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Activity Score</p>
                    <p className="text-lg font-semibold text-gray-900">78%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Posts This Month</p>
                    <p className="text-lg font-semibold text-gray-900">22</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Moderator</p>
                    <p className="text-sm font-medium text-gray-900">Vikram Thakur</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center justify-center">
                    <Users size={14} className="mr-1" /> View Members
                  </button>
                  <button
                    className="p-2 text-gray-500 hover:text-blue-600 border border-gray-300 rounded-md hover:border-blue-300"
                    title="Analytics"
                  >
                    <BarChart size={14} />
                  </button>
                  <button
                    className="p-2 text-gray-500 hover:text-blue-600 border border-gray-300 rounded-md hover:border-blue-300"
                    title="Edit"
                  >
                    <Edit size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Bangalore Chapter */}
            <div className="bg-white rounded-lg shadow transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">
                      BC
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">Bangalore Chapter</h3>
                      <p className="text-sm text-gray-500">Location-based</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Moderate</span>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Tech entrepreneurs and startup ecosystem in Bangalore. Focus on technology solutions for social impact
                  and innovation.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Members</p>
                    <p className="text-lg font-semibold text-gray-900">31</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Activity Score</p>
                    <p className="text-lg font-semibold text-gray-900">65%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Posts This Month</p>
                    <p className="text-lg font-semibold text-gray-900">18</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Moderator</p>
                    <p className="text-sm font-medium text-gray-900">Sanjay Mehta</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center justify-center">
                    <Users size={14} className="mr-1" /> View Members
                  </button>
                  <button
                    className="p-2 text-gray-500 hover:text-blue-600 border border-gray-300 rounded-md hover:border-blue-300"
                    title="Analytics"
                  >
                    <BarChart size={14} />
                  </button>
                  <button
                    className="p-2 text-gray-500 hover:text-blue-600 border border-gray-300 rounded-md hover:border-blue-300"
                    title="Edit"
                  >
                    <Edit size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Social Entrepreneurs */}
            <div className="bg-white rounded-lg shadow transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-lg">
                      SE
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">Social Entrepreneurs</h3>
                      <p className="text-sm text-gray-500">Interest-based</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Dedicated to creating positive social impact through entrepreneurship. Share resources, collaborate on
                  projects, and discuss impact measurement.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Members</p>
                    <p className="text-lg font-semibold text-gray-900">56</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Activity Score</p>
                    <p className="text-lg font-semibold text-gray-900">82%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Posts This Month</p>
                    <p className="text-lg font-semibold text-gray-900">34</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Moderator</p>
                    <p className="text-sm font-medium text-gray-900">Ritu Mehta</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center justify-center">
                    <Users size={14} className="mr-1" /> View Members
                  </button>
                  <button
                    className="p-2 text-gray-500 hover:text-blue-600 border border-gray-300 rounded-md hover:border-blue-300"
                    title="Analytics"
                  >
                    <BarChart size={14} />
                  </button>
                  <button
                    className="p-2 text-gray-500 hover:text-blue-600 border border-gray-300 rounded-md hover:border-blue-300"
                    title="Edit"
                  >
                    <Edit size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Tech Innovators */}
            <div className="bg-white rounded-lg shadow transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold text-lg">
                      TI
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">Tech Innovators</h3>
                      <p className="text-sm text-gray-500">Expertise-based</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Technology experts and innovators working on cutting-edge solutions. Share technical insights, discuss
                  emerging technologies, and collaborate on tech projects.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Members</p>
                    <p className="text-lg font-semibold text-gray-900">29</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Activity Score</p>
                    <p className="text-lg font-semibold text-gray-900">71%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Posts This Month</p>
                    <p className="text-lg font-semibold text-gray-900">19</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Moderator</p>
                    <p className="text-sm font-medium text-gray-900">Neha Sharma</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center justify-center">
                    <Users size={14} className="mr-1" /> View Members
                  </button>
                  <button
                    className="p-2 text-gray-500 hover:text-blue-600 border border-gray-300 rounded-md hover:border-blue-300"
                    title="Analytics"
                  >
                    <BarChart size={14} />
                  </button>
                  <button
                    className="p-2 text-gray-500 hover:text-blue-600 border border-gray-300 rounded-md hover:border-blue-300"
                    title="Edit"
                  >
                    <Edit size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Women Leaders */}
            <div className="bg-white rounded-lg shadow transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-lg">
                      WL
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">Women Leaders</h3>
                      <p className="text-sm text-gray-500">Interest-based</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Empowering women entrepreneurs and leaders. Share experiences, mentorship opportunities, and discuss
                  challenges and solutions for women in business.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Members</p>
                    <p className="text-lg font-semibold text-gray-900">47</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Activity Score</p>
                    <p className="text-lg font-semibold text-gray-900">88%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Posts This Month</p>
                    <p className="text-lg font-semibold text-gray-900">31</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Moderator</p>
                    <p className="text-sm font-medium text-gray-900">Priya Gupta</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center justify-center">
                    <Users size={14} className="mr-1" /> View Members
                  </button>
                  <button
                    className="p-2 text-gray-500 hover:text-blue-600 border border-gray-300 rounded-md hover:border-blue-300"
                    title="Analytics"
                  >
                    <BarChart size={14} />
                  </button>
                  <button
                    className="p-2 text-gray-500 hover:text-blue-600 border border-gray-300 rounded-md hover:border-blue-300"
                    title="Edit"
                  >
                    <Edit size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Group Management Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sub-Group Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Plus size={20} />
                  </div>
                  <h3 className="ml-3 text-sm font-medium text-gray-900">Create New Sub-Group</h3>
                </div>
                <p className="text-xs text-gray-600 mb-4">
                  Set up a new sub-group to organize members by location, interests, or expertise areas.
                </p>
                <button className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Create Sub-Group
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <UserPlus size={20} />
                  </div>
                  <h3 className="ml-3 text-sm font-medium text-gray-900">Bulk Member Assignment</h3>
                </div>
                <p className="text-xs text-gray-600 mb-4">
                  Assign multiple members to sub-groups based on their profiles, interests, or location.
                </p>
                <button className="w-full bg-green-600 text-white py-2 rounded-md text-sm font-medium hover:bg-green-700">
                  Assign Members
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <BarChart size={20} />
                  </div>
                  <h3 className="ml-3 text-sm font-medium text-gray-900">Sub-Group Analytics</h3>
                </div>
                <p className="text-xs text-gray-600 mb-4">
                  View detailed analytics and performance metrics for all sub-groups in your community.
                </p>
                <button className="w-full bg-purple-600 text-white py-2 rounded-md text-sm font-medium hover:bg-purple-700">
                  View Analytics
                </button>
              </div>
            </div>
          </div>
    </div>
  )
}
