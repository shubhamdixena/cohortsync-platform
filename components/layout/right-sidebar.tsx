"use client"
import { Calendar, TrendingUp, Users, MessageSquare, Bell, Plus } from "lucide-react"

export default function RightSidebar() {
  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 space-y-6 overflow-y-auto">
      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center">
            <Plus size={16} className="mr-2" />
            Create Post
          </button>
          <button className="w-full bg-white text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 border border-gray-200 flex items-center">
            <MessageSquare size={16} className="mr-2" />
            Start Discussion
          </button>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center mb-3">
          <Calendar size={18} className="text-gray-600 mr-2" />
          <h3 className="font-semibold text-gray-900">Upcoming Events</h3>
        </div>
        <div className="space-y-3">
          <div className="border-l-4 border-blue-500 pl-3">
            <p className="text-sm font-medium text-gray-900">Mumbai Entrepreneurs Meetup</p>
            <p className="text-xs text-gray-600">Tomorrow, 6:00 PM</p>
          </div>
          <div className="border-l-4 border-green-500 pl-3">
            <p className="text-sm font-medium text-gray-900">Social Impact Workshop</p>
            <p className="text-xs text-gray-600">Dec 28, 2:00 PM</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-3">
            <p className="text-sm font-medium text-gray-900">Tech Innovation Summit</p>
            <p className="text-xs text-gray-600">Jan 5, 9:00 AM</p>
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center mb-3">
          <TrendingUp size={18} className="text-gray-600 mr-2" />
          <h3 className="font-semibold text-gray-900">Trending Topics</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">#SocialImpact</span>
            <span className="text-xs text-gray-500">234 posts</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">#Sustainability</span>
            <span className="text-xs text-gray-500">189 posts</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">#TechForGood</span>
            <span className="text-xs text-gray-500">156 posts</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">#Entrepreneurship</span>
            <span className="text-xs text-gray-500">143 posts</span>
          </div>
        </div>
      </div>

      {/* Active Members */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center mb-3">
          <Users size={18} className="text-gray-600 mr-2" />
          <h3 className="font-semibold text-gray-900">Active Now</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm mr-3">
              RK
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-900">Rahul Kumar</p>
              <p className="text-xs text-gray-600">Online now</p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-medium text-xs mr-3">
              SM
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-900">Sanjay Mehta</p>
              <p className="text-xs text-gray-600">Online now</p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-medium text-xs mr-3">
              VT
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-900">Vikram Thakur</p>
              <p className="text-xs text-gray-600">Online now</p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center mb-3">
          <Bell size={18} className="text-gray-600 mr-2" />
          <h3 className="font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="space-y-3">
          <div className="text-xs">
            <span className="font-medium text-gray-900">Anjali Patel</span>
            <span className="text-gray-600"> shared a new resource</span>
            <p className="text-xs text-gray-500 mt-1">5 minutes ago</p>
          </div>
          <div className="text-xs">
            <span className="font-medium text-gray-900">Meera Gupta</span>
            <span className="text-gray-600"> joined Healthcare Innovation group</span>
            <p className="text-xs text-gray-500 mt-1">12 minutes ago</p>
          </div>
          <div className="text-xs">
            <span className="font-medium text-gray-900">Vikram Thakur</span>
            <span className="text-gray-600"> posted about clean energy</span>
            <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
          </div>
        </div>
      </div>
    </div>
  )
}
