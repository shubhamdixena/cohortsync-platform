"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import {
  ArrowLeft,
  Save,
  RotateCcw,
  Upload,
  Linkedin,
  Plus,
  X,
  User,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Globe,
  Twitter,
  Building,
  Users,
  Edit,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ProfileEdit() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLinkedInSyncing, setIsLinkedInSyncing] = useState(false)

  // Helper function to safely parse JSON
  const safeJsonParse = (value: any): any[] => {
    if (!value) return []
    if (Array.isArray(value)) return value
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value)
        return Array.isArray(parsed) ? parsed : []
      } catch (e) {
        console.warn('Failed to parse:', value, e)
        return []
      }
    }
    return []
  }

  // State for form data - initialize empty
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobTitle: "",
    location: "",
    cohort: "",
    bio: "",
    social: { linkedin: "", twitter: "", website: "", github: "" }
  })

  // Load real user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/users/me')
        if (response.ok) {
          const data = await response.json()
          setUserData(data)
          
          // Update form with real data
          const firstName = data.name?.split(" ")[0] || ""
          const lastName = data.name?.split(" ").slice(1).join(" ") || ""
          const jobTitle = data.profile?.title || ""
          
          setFormData({
            firstName,
            lastName,
            email: data.email || "",
            phone: data.phone || "",
            jobTitle,
            location: data.location || "",
            cohort: data.profile?.cohort || "",
            bio: data.bio || "",
            social: {
              linkedin: data.profile?.linkedin || "",
              twitter: data.profile?.twitter || "",
              website: data.profile?.website || "",
              github: data.profile?.github || ""
            }
          })
          
          // Parse skills if available
          if (data.profile?.skills) {
            setSkills(safeJsonParse(data.profile.skills))
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        // Use fallback data
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

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
    // Feature not implemented yet
    toast({
      title: "Coming Soon",
      description: "LinkedIn synchronization is coming soon!",
      variant: "default",
    })
  }

  const uploadPhoto = async () => {
    // Feature not implemented yet
    toast({
      title: "Coming Soon",
      description: "Photo upload is coming soon!",
      variant: "default",
    })
  }

  const saveChanges = async () => {
    setIsSaving(true)
    try {
      // Get the current auth token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        console.error('No active session:', sessionError)
        toast({
          title: "Error",
          description: "No active session. Please log in again.",
          variant: "destructive"
        })
        setIsSaving(false)
        return
      }

      console.log('Session found, updating profile for user:', session.user.id)

      const response = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone || null,
          location: formData.location || null,
          bio: formData.bio || null,
          profile: {
            title: formData.jobTitle || null,
            linkedin: formData.social.linkedin || null,
            twitter: formData.social.twitter || null,
            website: formData.social.website || null,
            github: formData.social.github || null,
            skills: skills && skills.length > 0 ? JSON.stringify(skills) : null,
            cohort: formData.cohort || null,
          }
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Profile updated successfully:', data)
        toast({
          title: "Success",
          description: "Changes saved successfully!",
        })
      } else {
        let errorData: any = {};
        try {
          const text = await response.text()
          console.log('Raw error response:', text)
          
          if (!text) {
             errorData = { error: `Server error: ${response.status} ${response.statusText} (Empty response)` }
          } else {
            try {
              errorData = JSON.parse(text)
            } catch {
              errorData = { error: `Server error: ${response.status} ${response.statusText}`, details: text }
            }
          }
        } catch (e) {
          console.error('Failed to read error response:', e)
          errorData = { error: `Server error: ${response.status} ${response.statusText}` }
        }
        
        // Ensure errorData has an error property
        if (!errorData || typeof errorData !== 'object') {
             errorData = { error: `Server error: ${response.status} ${response.statusText}` }
        } else if (!errorData.error) {
             errorData.error = `Server error: ${response.status} ${response.statusText}`
        }

        console.error('API error:', errorData)
        toast({
          title: "Error",
          description: errorData.error || "Failed to save changes. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        title: "Error",
        description: "An error occurred while saving.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const resetForm = () => {
    // Reset form to original values from userData
    const firstName = userData.name?.split(" ")[0] || ""
    const lastName = userData.name?.split(" ").slice(1).join(" ") || ""
    const jobTitle = userData.profile?.title || ""
    
    let resetSkills = []
    if (userData.profile?.skills) {
      resetSkills = safeJsonParse(userData.profile.skills)
    }
    
    setSkills(resetSkills)
    setNewSkill("")
    setFormData({
      firstName,
      lastName,
      email: userData.email || "",
      phone: userData.phone || "",
      jobTitle,
      location: userData.location || "",
      cohort: userData.profile?.cohort || "",
      bio: userData.bio || "",
      social: {
        linkedin: userData.profile?.linkedin || "",
        twitter: userData.profile?.twitter || "",
        website: userData.profile?.website || "",
        github: userData.profile?.github || ""
      }
    })
    toast({
      title: "Reset",
      description: "Form reset to original values",
    })
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
    <div className="max-w-4xl mx-auto space-y-6">
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading your profile...</div>
        </div>
      )}
      
      {!loading && (
        <>
      {/* Back Navigation */}
      <div>
        <Link href="/directory" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft size={16} className="mr-1" />
          Back to Directory
        </Link>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-muted-foreground font-bold text-xl">
                    {userData?.initials || formData.firstName.charAt(0) + formData.lastName.charAt(0)}
                  </span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  onClick={uploadPhoto}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload size={14} />
                  )}
                </Button>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Edit Profile</h1>
                <p className="text-muted-foreground">{formData.firstName} {formData.lastName}</p>
                <div className="flex items-center text-muted-foreground mt-1">
                  <MapPin size={14} className="mr-1" />
                  <span className="text-sm">{formData.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={syncLinkedIn}
                disabled={isLinkedInSyncing}
              >
                {isLinkedInSyncing ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Linkedin size={16} className="mr-2" />
                )}
                Sync LinkedIn
              </Button>
              <Button onClick={resetForm} variant="outline">
                <RotateCcw size={16} className="mr-2" />
                Reset
              </Button>
              <Button onClick={saveChanges} disabled={isSaving}>
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Save size={16} className="mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Personal Info & Contact */}
        <div className="lg:col-span-1 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User size={20} className="mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Last name"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="City, Country"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cohort">Cohort</Label>
                <div className="relative">
                  <Users size={16} className="absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="cohort"
                    value={formData.cohort}
                    onChange={(e) => handleInputChange("cohort", e.target.value)}
                    placeholder="Your cohort"
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your.email@example.com"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Profiles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <div className="relative">
                  <Linkedin size={16} className="absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="linkedin"
                    value={formData.social.linkedin || ""}
                    onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <div className="relative">
                  <Twitter size={16} className="absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="twitter"
                    value={formData.social.twitter || ""}
                    onChange={(e) => handleSocialChange("twitter", e.target.value)}
                    placeholder="https://twitter.com/username"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe size={16} className="absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="website"
                    value={formData.social.website || ""}
                    onChange={(e) => handleSocialChange("website", e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Professional Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase size={20} className="mr-2" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                  placeholder="Your current job title"
                />
              </div>
            </CardContent>
          </Card>

          {/* About Me */}
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills & Expertise */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="group cursor-pointer">
                    {skill}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-1 h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeSkill(skill)}
                    >
                      <X size={12} />
                    </Button>
                  </Badge>
                ))}
              </div>
              
              <Separator />
              
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a new skill"
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                />
                <Button onClick={addSkill} variant="outline" size="icon">
                  <Plus size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary">
                      {formData.firstName?.[0]}{formData.lastName?.[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{formData.firstName} {formData.lastName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formData.jobTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">{formData.location}</p>
                  </div>
                </div>
                
                {formData.bio && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {formData.bio.slice(0, 200)}{formData.bio.length > 200 && "..."}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-1">
                  {skills.slice(0, 6).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {skills.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{skills.length - 6} more
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
        </>
      )}
    </div>
  )
}
