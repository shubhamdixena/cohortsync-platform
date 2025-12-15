"use client"

import { useState } from "react"
import { currentUser } from "@/lib/data"
import { Linkedin, Upload, X, Plus, Save, RotateCcw } from "lucide-react"

export default function ProfileImproved() {
  const [activeSection, setActiveSection] = useState("profile-info")
  const [skills, setSkills] = useState(currentUser.skills)
  const [newSkill, setNewSkill] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLinkedInSyncing, setIsLinkedInSyncing] = useState(false)

  // State for form data
  const [formData, setFormData] = useState({
    firstName: currentUser.name.split(" ")[0],
    lastName: currentUser.name.split(" ")[1],
    email: currentUser.email,
    phone: currentUser.phone,
    jobTitle: currentUser.title.split(" at ")[0],
    company: currentUser.title.split(" at ")[1] || "",
    location: currentUser.location,
    cohort: currentUser.cohort,
    bio: currentUser.bio,
    social: { ...currentUser.social }
  })

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const syncLinkedIn = async () => {
    setIsLinkedInSyncing(true)
    // Simulate API call
    setTimeout(() => {
      setIsLinkedInSyncing(false)
      showToast("Profile synchronized with LinkedIn successfully!", "success")
    }, 2000)
  }

  const uploadPhoto = async () => {
    setIsUploading(true)
    
    // Create file input element
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = 'image/*'
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // Simulate file upload
        setTimeout(() => {
          setIsUploading(false)
          showToast("Photo uploaded successfully!", "success")
        }, 2000)
      } else {
        setIsUploading(false)
      }
    }
    fileInput.click()
  }

  const saveChanges = async () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      showToast("Changes saved successfully!", "success")
    }, 1500)
  }

  const resetForm = () => {
    // Reset form to original values
    setSkills(currentUser.skills)
    setNewSkill("")
    setFormData({
      firstName: currentUser.name.split(" ")[0],
      lastName: currentUser.name.split(" ")[1],
      email: currentUser.email,
      phone: currentUser.phone,
      jobTitle: currentUser.title.split(" at ")[0],
      company: currentUser.title.split(" at ")[1] || "",
      location: currentUser.location,
      cohort: currentUser.cohort,
      bio: currentUser.bio,
      social: { ...currentUser.social }
    })
    showToast("Form reset to original values", "info")
  }

  const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    const toast = document.createElement('div')
    toast.className = 'toast toast-end z-50'
    toast.innerHTML = `
      <div class="alert alert-${type}">
        <span>${message}</span>
      </div>
    `
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSocialChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social: {
        ...prev.social,
        [platform]: value
      }
    }))
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-1/4">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body p-0">
                <div className="tabs tabs-boxed tabs-lg flex-col bg-transparent gap-1 p-4">
                  <a
                    className={`tab tab-lg w-full justify-start gap-3 ${activeSection === "profile-info" ? "tab-active" : ""}`}
                    onClick={() => setActiveSection("profile-info")}
                  >
                    <i className="fas fa-user"></i>
                    Profile Information
                  </a>
                  <a
                    className={`tab tab-lg w-full justify-start gap-3 ${activeSection === "privacy" ? "tab-active" : ""}`}
                    onClick={() => setActiveSection("privacy")}
                  >
                    <i className="fas fa-shield-alt"></i>
                    Privacy Settings
                  </a>
                  <a
                    className={`tab tab-lg w-full justify-start gap-3 ${activeSection === "notifications" ? "tab-active" : ""}`}
                    onClick={() => setActiveSection("notifications")}
                  >
                    <i className="fas fa-bell"></i>
                    Notifications
                  </a>
                  <a
                    className={`tab tab-lg w-full justify-start gap-3 ${activeSection === "linkedin" ? "tab-active" : ""}`}
                    onClick={() => setActiveSection("linkedin")}
                  >
                    <i className="fab fa-linkedin"></i>
                    LinkedIn Integration
                  </a>
                  <a
                    className={`tab tab-lg w-full justify-start gap-3 ${activeSection === "account" ? "tab-active" : ""}`}
                    onClick={() => setActiveSection("account")}
                  >
                    <i className="fas fa-cog"></i>
                    Account Settings
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full md:w-3/4">
            {/* Profile Information Section */}
            {activeSection === "profile-info" && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="card-title text-2xl">Profile Information</h2>
                    <div className="flex items-center gap-4">
                      <div className="text-sm opacity-70">Last updated: May 15, 2023</div>
                      <button 
                        className={`btn btn-outline btn-sm gap-2 ${isLinkedInSyncing ? 'loading' : ''}`} 
                        onClick={syncLinkedIn}
                        disabled={isLinkedInSyncing}
                      >
                        {!isLinkedInSyncing && <Linkedin size={16} />}
                        {isLinkedInSyncing ? 'Syncing...' : 'Sync with LinkedIn'}
                      </button>
                    </div>
                  </div>

                  <form className="space-y-6">
                    {/* Profile Photo Section */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Profile Photo</span>
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="avatar placeholder">
                          <div className="bg-primary text-primary-content rounded-full w-20 h-20">
                            <span className="text-2xl font-bold">{currentUser.initials}</span>
                          </div>
                        </div>
                        <div>
                          <button
                            type="button"
                            className={`btn btn-primary btn-sm gap-2 ${isUploading ? 'loading' : ''}`}
                            onClick={uploadPhoto}
                            disabled={isUploading}
                          >
                            {!isUploading && <Upload size={16} />}
                            {isUploading ? 'Uploading...' : 'Upload Photo'}
                          </button>
                          <div className="text-xs opacity-60 mt-1">
                            Recommended: Square image, at least 400x400 pixels
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">First Name</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Last Name</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Email Address</span>
                        </label>
                        <input
                          type="email"
                          className="input input-bordered w-full"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Phone Number</span>
                        </label>
                        <input
                          type="tel"
                          className="input input-bordered w-full"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Job Title</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          value={formData.jobTitle}
                          onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Company/Organization</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Location</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Cohort</span>
                        </label>
                        <select
                          className="select select-bordered w-full"
                          value={formData.cohort}
                          onChange={(e) => handleInputChange('cohort', e.target.value)}
                        >
                          <option value="Jagriti Yatra 2022">Jagriti Yatra 2022</option>
                          <option value="Jagriti Yatra 2021">Jagriti Yatra 2021</option>
                          <option value="Jagriti Yatra 2020">Jagriti Yatra 2020</option>
                          <option value="Jagriti Yatra 2019">Jagriti Yatra 2019</option>
                        </select>
                      </div>
                    </div>

                    {/* Bio Section */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Bio</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered h-24"
                        placeholder="Brief description about yourself"
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                      ></textarea>
                      <label className="label">
                        <span className="label-text-alt">Brief description about yourself (max 300 characters)</span>
                        <span className="label-text-alt">{formData.bio.length}/300</span>
                      </label>
                    </div>

                    {/* Social Media Section */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Social Media Profiles</span>
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">
                              <i className="fab fa-linkedin text-blue-700 mr-2"></i>LinkedIn
                            </span>
                          </label>
                          <input
                            type="url"
                            className="input input-bordered w-full"
                            value={formData.social.linkedin}
                            onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">
                              <i className="fab fa-twitter text-blue-400 mr-2"></i>Twitter
                            </span>
                          </label>
                          <input
                            type="url"
                            className="input input-bordered w-full"
                            value={formData.social.twitter}
                            onChange={(e) => handleSocialChange('twitter', e.target.value)}
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">
                              <i className="fas fa-globe text-gray-600 mr-2"></i>Website
                            </span>
                          </label>
                          <input
                            type="url"
                            className="input input-bordered w-full"
                            value={formData.social.website}
                            onChange={(e) => handleSocialChange('website', e.target.value)}
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">
                              <i className="fab fa-github text-gray-800 mr-2"></i>GitHub
                            </span>
                          </label>
                          <input
                            type="url"
                            className="input input-bordered w-full"
                            value={formData.social.github}
                            onChange={(e) => handleSocialChange('github', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Skills Section */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Skills & Expertise</span>
                      </label>
                      <div className="card bg-base-200 p-4">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {skills.map((skill, index) => (
                            <div key={index} className="badge badge-primary gap-2 p-3">
                              {skill}
                              <button 
                                type="button"
                                className="btn btn-ghost btn-xs btn-circle"
                                onClick={() => removeSkill(skill)}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="join w-full">
                          <input
                            type="text"
                            placeholder="Add a skill..."
                            className="input input-bordered join-item flex-1"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                          />
                          <button
                            type="button"
                            className="btn btn-primary join-item gap-2"
                            onClick={addSkill}
                          >
                            <Plus size={16} />
                            Add
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="card-actions justify-end">
                      <button
                        type="button"
                        className="btn btn-ghost gap-2"
                        onClick={resetForm}
                      >
                        <RotateCcw size={16} />
                        Reset
                      </button>
                      <button
                        type="button"
                        className={`btn btn-primary gap-2 ${isSaving ? 'loading' : ''}`}
                        onClick={saveChanges}
                        disabled={isSaving}
                      >
                        {!isSaving && <Save size={16} />}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Privacy Settings Section */}
            {activeSection === "privacy" && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl">Privacy Settings</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Profile Visibility</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">Who can see my profile</div>
                            <div className="text-sm opacity-70">Control who can view your full profile information</div>
                          </div>
                          <select className="select select-bordered w-fit">
                            <option selected>All community members</option>
                            <option>Only my cohort</option>
                            <option>Only my connections</option>
                            <option>Only admins</option>
                          </select>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">Show my contact information</div>
                            <div className="text-sm opacity-70">Control who can see your email and phone number</div>
                          </div>
                          <select className="select select-bordered w-fit">
                            <option>All community members</option>
                            <option selected>Only my cohort</option>
                            <option>Only my connections</option>
                            <option>Only admins</option>
                            <option>No one</option>
                          </select>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">Show my social media profiles</div>
                            <div className="text-sm opacity-70">Control who can see your linked social accounts</div>
                          </div>
                          <select className="select select-bordered w-fit">
                            <option selected>All community members</option>
                            <option>Only my cohort</option>
                            <option>Only my connections</option>
                            <option>Only admins</option>
                            <option>No one</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="divider"></div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Activity Visibility</h3>
                      <div className="space-y-4">
                        <div className="form-control">
                          <label className="label cursor-pointer">
                            <div>
                              <div className="font-medium">Show my posts on the community wall</div>
                              <div className="text-sm opacity-70">
                                Your posts will be visible to all members who can see the community wall
                              </div>
                            </div>
                            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                          </label>
                        </div>

                        <div className="form-control">
                          <label className="label cursor-pointer">
                            <div>
                              <div className="font-medium">Show my comments on posts</div>
                              <div className="text-sm opacity-70">
                                Your comments will be visible to anyone who can see the post
                              </div>
                            </div>
                            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                          </label>
                        </div>

                        <div className="form-control">
                          <label className="label cursor-pointer">
                            <div>
                              <div className="font-medium">Show my shared resources</div>
                              <div className="text-sm opacity-70">Resources you share will be attributed to you</div>
                            </div>
                            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                          </label>
                        </div>

                        <div className="form-control">
                          <label className="label cursor-pointer">
                            <div>
                              <div className="font-medium">Show when I'm online</div>
                              <div className="text-sm opacity-70">
                                Other members can see when you're active on the platform
                              </div>
                            </div>
                            <input type="checkbox" className="toggle toggle-primary" />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="divider"></div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Data Usage</h3>
                      <div className="space-y-4">
                        <div className="form-control">
                          <label className="label cursor-pointer">
                            <div>
                              <div className="font-medium">Allow LinkedIn data synchronization</div>
                              <div className="text-sm opacity-70">
                                Automatically update your profile with information from LinkedIn
                              </div>
                            </div>
                            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                          </label>
                        </div>

                        <div className="form-control">
                          <label className="label cursor-pointer">
                            <div>
                              <div className="font-medium">Allow usage of my data for platform improvements</div>
                              <div className="text-sm opacity-70">
                                We use anonymized data to improve the platform experience
                              </div>
                            </div>
                            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions justify-end mt-6">
                    <button type="button" className="btn btn-ghost">
                      Cancel
                    </button>
                    <button type="button" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Other sections placeholder */}
            {activeSection === "notifications" && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl">Notification Preferences</h2>
                  <p className="opacity-70">Configure your notification settings here.</p>
                </div>
              </div>
            )}

            {activeSection === "linkedin" && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl">LinkedIn Integration</h2>
                  <p className="opacity-70">Manage your LinkedIn integration settings here.</p>
                </div>
              </div>
            )}

            {activeSection === "account" && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl">Account Settings</h2>
                  <p className="opacity-70">Manage your account settings here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
