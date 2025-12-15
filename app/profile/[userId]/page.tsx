"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Mail,
  MapPin,
  Calendar,
  Users,
  ExternalLink,
  MessageCircle,
  MoreHorizontal,
  Search,
  HandHeart,
  Building,
  Briefcase,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface UserProfile {
  id: string
  name: string
  initials: string
  title?: string
  location?: string
  email: string
  bio?: string
  expertise?: string[]
  skills?: string[]
  joinDate?: string
  cohort?: string
  industry?: string
  subgroups?: string[]
  avatar?: string
  social?: {
    linkedin?: string
    twitter?: string
    website?: string
    github?: string
  }
  lookingFor?: string[]
  offering?: string[]
  experience?: Array<{
    title: string
    company: string
    duration: string
    description?: string
  }>
  referrals?: Array<{
    organization: string
    type: string
    category: string
  }>
}

export default function UserProfile() {
  const params = useParams()
  const userId = params.userId as string
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        console.log('Fetching user with ID:', userId)
        const response = await fetch(`/api/users?id=${userId}`)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('API Error Response:', response.status, errorText)
          setError(`User not found (${response.status})`)
          return
        }
        
        const data = await response.json()
        console.log('Raw API Response:', data)
        
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
        
        // Parse profile data if it's a string
        const userData: UserProfile = {
          id: data.id,
          name: data.name,
          initials: data.initials,
          title: data.profile?.title || 'Member',
          location: data.location || 'Unknown',
          email: data.email,
          bio: data.bio || data.profile?.bio || '',
          expertise: safeJsonParse(data.profile?.expertise),
          skills: safeJsonParse(data.profile?.skills),
          joinDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A',
          cohort: data.profile?.cohort || '',
          industry: data.profile?.industry || '',
          subgroups: safeJsonParse(data.profile?.subgroups),
          avatar: data.avatar,
          social: {
            linkedin: data.profile?.linkedin ? (data.profile.linkedin.startsWith('http') ? data.profile.linkedin : `https://${data.profile.linkedin}`) : undefined,
            twitter: data.profile?.twitter ? (data.profile.twitter.startsWith('http') ? data.profile.twitter : `https://twitter.com/${data.profile.twitter}`) : undefined,
            website: data.profile?.website ? (data.profile.website.startsWith('http') ? data.profile.website : `https://${data.profile.website}`) : undefined,
            github: data.profile?.github ? (data.profile.github.startsWith('http') ? data.profile.github : `https://github.com/${data.profile.github}`) : undefined,
          },
          lookingFor: safeJsonParse(data.profile?.lookingFor),
          offering: safeJsonParse(data.profile?.offering),
          experience: safeJsonParse(data.profile?.experience),
          referrals: safeJsonParse(data.profile?.referrals),
        }
        
        console.log('Parsed User Data:', userData)
        setUser(userData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(`Failed to load user profile: ${errorMessage}`)
        console.error('Error fetching user:', err)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId])


  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading user profile...</p>
            <p className="text-xs text-gray-500 mt-2">User ID: {userId}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user || error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">User Not Found</h1>
              <p className="text-gray-600 mb-2">{error || "The user profile you're looking for doesn't exist."}</p>
              <p className="text-xs text-gray-500 mb-4">User ID: {userId}</p>
              <details className="text-left bg-gray-100 p-3 rounded mb-4 text-xs">
                <summary className="cursor-pointer font-semibold">Debug Information</summary>
                <pre className="mt-2 text-xs overflow-auto">{`Error: ${error || 'No user data returned from API'}\nUser ID: ${userId}\nAPI Endpoint: /api/users?id=${userId}`}</pre>
              </details>
              <Link href="/directory" className="text-blue-600 hover:text-blue-800">
                ← Back to Directory
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                <span className="text-muted-foreground font-bold text-xl">{user.initials}</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                <p className="text-muted-foreground">{user.title}</p>
                <div className="flex items-center text-muted-foreground mt-1">
                  <MapPin size={14} className="mr-1" />
                  <span className="text-sm">{user.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button>
                <MessageCircle size={16} className="mr-1" />
                Message
              </Button>
              <Button variant="outline" size="icon">
                <MoreHorizontal size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Looking For & Offering */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* I am Looking For */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search size={20} className="mr-2" />I am looking for
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user.lookingFor && user.lookingFor.length > 0 ? (
              <div className="space-y-2">
                {user.lookingFor.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No specific needs listed at the moment.</p>
            )}
          </CardContent>
        </Card>

        {/* I am Offering */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HandHeart size={20} className="mr-2" />I am offering
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user.offering && user.offering.length > 0 ? (
              <div className="space-y-2">
                {user.offering.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No offerings listed at the moment.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - About & Contact */}
        <div className="lg:col-span-1 space-y-6">
          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {user.bio ||
                  "Passionate entrepreneur focused on creating sustainable solutions for social impact. Always looking to connect with like-minded individuals who want to make a difference."}
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail size={16} className="mr-3" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar size={16} className="mr-3" />
                  <span>Joined {user.joinDate}</span>
                </div>
              </div>

              {/* Social Links */}
              {user.social && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Social Profiles</h4>
                  <div className="space-y-2">
                    {user.social.linkedin && (
                      <a
                        href={user.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink size={14} className="mr-2" />
                        LinkedIn
                      </a>
                    )}
                    {user.social.twitter && (
                      <a
                        href={user.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink size={14} className="mr-2" />
                        Twitter
                      </a>
                    )}
                    {user.social.website && (
                      <a
                        href={user.social.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink size={14} className="mr-2" />
                        Website
                      </a>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase size={20} className="mr-2" />
                Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.experience && user.experience.length > 0 ? (
                <div className="space-y-4">
                  {user.experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-muted pl-4">
                      <h3 className="font-semibold text-foreground">{exp.title}</h3>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                      <p className="text-xs text-muted-foreground">{exp.duration}</p>
                      {exp.description && <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No experience information available.</p>
              )}
            </CardContent>
          </Card>

          {/* Referrals & Introductions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building size={20} className="mr-2" />
                Referrals & Introductions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.referrals && user.referrals.length > 0 ? (
                <div className="space-y-3">
                  {user.referrals.map((referral, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-foreground">{referral.organization}</h4>
                        <p className="text-sm text-muted-foreground">{referral.type}</p>
                      </div>
                      <Badge variant="secondary">{referral.category}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No referrals or introductions available at the moment.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Community Involvement */}
          <Card>
            <CardHeader>
              <CardTitle>Community Involvement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Cohort</h3>
                  <div className="flex items-center">
                    <Users size={16} className="mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{user.cohort}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Industry</h3>
                  <Badge variant="outline">{user.industry}</Badge>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-2">Sub-Groups</h3>
                <div className="flex flex-wrap gap-2">
                  {(user.subgroups ?? []).map((group, index) => (
                    <Badge key={index} variant="secondary">
                      {group}
                    </Badge>
                  ))}
                  {!user.subgroups?.length && (
                    <span className="text-sm text-muted-foreground">No sub-groups listed.</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills & Expertise */}
          {user.skills?.length ? (
            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* Recent Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Just attended an amazing workshop on sustainable business practices. The insights on circular
                    economy were particularly enlightening!
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>3 days ago</span>
                    <div className="flex items-center space-x-4">
                      <span>12 likes</span>
                      <span>5 comments</span>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Looking for collaborators on a new social impact project focused on education in rural areas. DM me
                    if interested!
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>1 week ago</span>
                    <div className="flex items-center space-x-4">
                      <span>8 likes</span>
                      <span>3 comments</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
