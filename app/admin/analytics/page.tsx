"use client"

import { useState } from "react"
import {
  TrendingUp,
  Users,
  MessageSquare,
  Eye,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("7d")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false)
    }, 2000)
  }

  const handleExport = () => {
    console.log("Exporting analytics report...")
    // Add export logic here
  }

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Track community engagement, member activity, and content performance across your platform.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} size="sm">
                <RefreshCw size={14} className={`mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExport} size="sm">
                <Download size={14} className="mr-1" />
                Export Report
              </Button>
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
                <p className="text-xs font-medium text-gray-600">Active Users</p>
                <p className="text-lg font-bold text-gray-900">892</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600 font-medium">+8%</span>
              <span className="text-xs text-gray-500 ml-2">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Total Posts</p>
                <p className="text-lg font-bold text-gray-900">3,456</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600 font-medium">+15%</span>
              <span className="text-xs text-gray-500 ml-2">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Engagement Rate</p>
                <p className="text-lg font-bold text-gray-900">68%</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <ArrowDownRight className="w-3 h-3 text-red-500 mr-1" />
              <span className="text-xs text-red-600 font-medium">-3%</span>
              <span className="text-xs text-gray-500 ml-2">vs last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Member Growth Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold">Member Growth</CardTitle>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 size={36} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 text-xs">Member growth chart would be displayed here</p>
                <Button variant="outline" size="sm" className="mt-2 bg-transparent text-xs">
                  Configure Chart
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Metrics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold">Engagement Metrics</CardTitle>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp size={36} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 text-xs">Engagement metrics chart would be displayed here</p>
                <Button variant="outline" size="sm" className="mt-2 bg-transparent text-xs">
                  Configure Chart
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Content & Active Members */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Content */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Performing Content</CardTitle>
            <Button variant="outline" size="sm" onClick={() => (window.location.href = "/admin/content")}>
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <h4 className="font-medium text-gray-900">May Meetup Announcement</h4>
                <p className="text-sm text-gray-600">Posted 2 days ago</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">124 views</p>
                <p className="text-sm text-gray-600">32 comments</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <h4 className="font-medium text-gray-900">Startup Funding Guide</h4>
                <p className="text-sm text-gray-600">Posted 1 week ago</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">89 views</p>
                <p className="text-sm text-gray-600">15 comments</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <h4 className="font-medium text-gray-900">Networking Event Mumbai</h4>
                <p className="text-sm text-gray-600">Posted 3 days ago</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">67 views</p>
                <p className="text-sm text-gray-600">8 comments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Most Active Members */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Most Active Members</CardTitle>
            <Button variant="outline" size="sm" onClick={() => (window.location.href = "/admin/members")}>
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-semibold text-blue-700">
                  AP
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900">Anjali Patel</h4>
                  <p className="text-sm text-gray-600">Mumbai Chapter</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">45 posts</p>
                <p className="text-sm text-gray-600">This month</p>
              </div>
            </div>
            <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center font-semibold text-green-700">
                  VT
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900">Vikram Thakur</h4>
                  <p className="text-sm text-gray-600">Delhi Chapter</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">38 posts</p>
                <p className="text-sm text-gray-600">This month</p>
              </div>
            </div>
            <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center font-semibold text-purple-700">
                  RM
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900">Ritu Mehta</h4>
                  <p className="text-sm text-gray-600">Social Entrepreneurs</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">31 posts</p>
                <p className="text-sm text-gray-600">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sub-Group Performance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sub-Group Performance</CardTitle>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = "/admin/subgroups")}>
            Manage Sub-Groups
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sub-Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Members
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posts This Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Engagement Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Growth
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                        MC
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">Mumbai Chapter</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">42</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">28</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">85%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge>+12%</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-semibold text-sm">
                        SE
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">Social Entrepreneurs</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">56</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">34</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">82%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge>+8%</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm">
                        DC
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">Delhi Chapter</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">38</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">22</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">78%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge>+5%</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
