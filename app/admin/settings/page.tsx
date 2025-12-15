"use client"

import { useState } from "react"
import { Save, Globe, Lock, Mail, Smartphone, Eye, EyeOff } from "lucide-react"

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general")
  const [showApiKey, setShowApiKey] = useState(false)

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Community Settings</h1>
            <p className="text-sm text-gray-600 mt-1">
              Configure your community settings, privacy options, and administrative preferences.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="bg-blue-600 text-white px-3 py-2 rounded-md text-xs font-medium hover:bg-blue-700 flex items-center">
              <Save size={14} className="mr-1" /> Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("general")}
              className={`${activeTab === "general" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-3 px-4 border-b-2 font-medium text-xs`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={`${activeTab === "privacy" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-3 px-4 border-b-2 font-medium text-xs`}
            >
              Privacy & Security
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`${activeTab === "notifications" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-3 px-4 border-b-2 font-medium text-xs`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`${activeTab === "members" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-3 px-4 border-b-2 font-medium text-xs`}
            >
              Member Settings
            </button>
          </nav>
        </div>

        <div className="p-4">
          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Community Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Community Name</label>
                    <input
                      type="text"
                      defaultValue="Social Entrepreneurs Network"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Community URL</label>
                    <input
                      type="text"
                      defaultValue="social-entrepreneurs"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Community Description</label>
                <textarea
                  rows={4}
                  defaultValue="A vibrant community of social entrepreneurs working together to create positive impact and drive meaningful change in society."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Regional Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Timezone</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="es">Spanish</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy & Security Settings */}
          {activeTab === "privacy" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Community Visibility</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Public Community</p>
                        <p className="text-xs text-gray-600">Anyone can discover and view your community</p>
                      </div>
                    </div>
                    <input type="radio" name="visibility" className="text-blue-600" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Lock className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Private Community</p>
                        <p className="text-xs text-gray-600">Only invited members can access the community</p>
                      </div>
                    </div>
                    <input type="radio" name="visibility" className="text-blue-600" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Member Permissions</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Allow members to create posts</p>
                      <p className="text-xs text-gray-600">Members can create new posts in the community</p>
                    </div>
                    <input type="checkbox" className="text-blue-600" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Allow members to create sub-groups</p>
                      <p className="text-xs text-gray-600">Members can create and manage their own sub-groups</p>
                    </div>
                    <input type="checkbox" className="text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Require post approval</p>
                      <p className="text-xs text-gray-600">All posts must be approved by moderators</p>
                    </div>
                    <input type="checkbox" className="text-blue-600" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">API Access</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                    <div className="flex">
                      <input
                        type={showApiKey ? "text" : "password"}
                        defaultValue="sk_live_1234567890abcdef"
                        className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        readOnly
                      />
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="border border-l-0 border-gray-300 rounded-r-md px-3 py-2 bg-gray-50 hover:bg-gray-100"
                      >
                        {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                    Regenerate API Key
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">New member notifications</p>
                        <p className="text-xs text-gray-600">Get notified when new members join</p>
                      </div>
                    </div>
                    <input type="checkbox" className="text-blue-600" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Flagged content alerts</p>
                        <p className="text-xs text-gray-600">Get notified when content is flagged</p>
                      </div>
                    </div>
                    <input type="checkbox" className="text-blue-600" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Weekly activity digest</p>
                        <p className="text-xs text-gray-600">Receive weekly summary of community activity</p>
                      </div>
                    </div>
                    <input type="checkbox" className="text-blue-600" defaultChecked />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Push Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Smartphone className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Urgent alerts</p>
                        <p className="text-xs text-gray-600">Critical notifications that require immediate attention</p>
                      </div>
                    </div>
                    <input type="checkbox" className="text-blue-600" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Smartphone className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Member activity</p>
                        <p className="text-xs text-gray-600">Notifications about member posts and interactions</p>
                      </div>
                    </div>
                    <input type="checkbox" className="text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Member Settings */}
          {activeTab === "members" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Membership Requirements</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Require admin approval for new members</p>
                      <p className="text-xs text-gray-600">All new member applications must be reviewed</p>
                    </div>
                    <input type="checkbox" className="text-blue-600" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Require referral for membership</p>
                      <p className="text-xs text-gray-600">New members must be referred by existing members</p>
                    </div>
                    <input type="checkbox" className="text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Enable member directory</p>
                      <p className="text-xs text-gray-600">Allow members to browse and search member profiles</p>
                    </div>
                    <input type="checkbox" className="text-blue-600" defaultChecked />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Requirements</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Require profile completion</p>
                      <p className="text-xs text-gray-600">Members must complete their profile before participating</p>
                    </div>
                    <input type="checkbox" className="text-blue-600" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Require professional information</p>
                      <p className="text-xs text-gray-600">Members must provide work and industry details</p>
                    </div>
                    <input type="checkbox" className="text-blue-600" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Allow profile visibility control</p>
                      <p className="text-xs text-gray-600">Members can control who sees their profile information</p>
                    </div>
                    <input type="checkbox" className="text-blue-600" defaultChecked />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Member Limits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maximum members</label>
                    <input
                      type="number"
                      defaultValue="5000"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Posts per member per day</label>
                    <input
                      type="number"
                      defaultValue="10"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
