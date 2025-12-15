"use client"

import { useState } from "react"
import { Check, ArrowRight, ArrowLeft, Handshake, Info, ChevronDown, LinkIcon, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"

const steps = [
  { id: 1, name: "Welcome", description: "Welcome to the platform" },
  { id: 2, name: "Skills & Interests", description: "Set your preferences" },
  { id: 3, name: "Connections", description: "Find community members" },
  { id: 4, name: "Preferences", description: "Notification settings" },
  { id: 5, name: "Complete", description: "Setup complete" },
]

const professionalSkills = [
  "Project Management",
  "Marketing",
  "Finance",
  "Sales",
  "Product Development",
  "UX/UI Design",
  "Data Analysis",
  "Software Development",
  "Content Creation",
  "Public Speaking",
]

const industryInterests = [
  "Education",
  "Healthcare",
  "Sustainability",
  "Technology",
  "Agriculture",
  "Fashion",
  "Finance",
  "Social Impact",
  "Arts & Culture",
  "Food & Beverage",
]

const socialImpactAreas = [
  "Education Access",
  "Climate Action",
  "Gender Equality",
  "Rural Development",
  "Healthcare Access",
  "Clean Water",
  "Poverty Reduction",
  "Digital Inclusion",
]

const suggestedConnections = [
  {
    name: "Priya Sharma",
    title: "Education Innovator | Social Entrepreneur",
    location: "Mumbai, India • Jagriti Yatra 2022",
    initials: "PS",
    color: "bg-green-100 text-green-600",
    tags: ["Education", "Social Impact", "Rural Development"],
    mutualConnections: 3,
  },
  {
    name: "Vikram Thakur",
    title: "Sustainability Expert | Clean Energy Advocate",
    location: "Delhi, India • Jagriti Yatra 2022",
    initials: "VT",
    color: "bg-blue-100 text-blue-600",
    tags: ["Sustainability", "Climate Action", "Technology"],
    mutualConnections: 5,
  },
  {
    name: "Anjali Patel",
    title: "Healthcare Innovator | Medical Technology",
    location: "Bangalore, India • Jagriti Yatra 2021",
    initials: "AP",
    color: "bg-purple-100 text-purple-600",
    tags: ["Healthcare", "Technology", "Healthcare Access"],
    mutualConnections: 2,
  },
]

export default function WelcomeWizardPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [selectedImpactAreas, setSelectedImpactAreas] = useState<string[]>([])
  const [customSkills, setCustomSkills] = useState("")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [notificationTypes, setNotificationTypes] = useState({
    messages: true,
    connections: true,
    mentions: true,
    events: true,
    announcements: true,
    resources: false,
    digest: false,
  })
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    contactInfo: false,
    activityFeed: true,
  })

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleSkill = (skill: string, category: "skills" | "interests" | "impact") => {
    const setters = {
      skills: setSelectedSkills,
      interests: setSelectedInterests,
      impact: setSelectedImpactAreas,
    }
    const getters = {
      skills: selectedSkills,
      interests: selectedInterests,
      impact: selectedImpactAreas,
    }

    const current = getters[category]
    const setter = setters[category]

    if (current.includes(skill)) {
      setter(current.filter((s) => s !== skill))
    } else {
      setter([...current, skill])
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-blue-600">CohortSync</h1>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">Welcome to your community!</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Let's set up your profile and preferences to get the most out of your experience
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep > step.id
                      ? "bg-green-500 text-white"
                      : currentStep === step.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <div className="text-xs font-medium ml-2">{step.name}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-grow h-0.5 mx-2 ${currentStep > step.id ? "bg-green-500" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <div className="text-center space-y-6">
              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-100">
                <Handshake className="text-blue-600 w-12 h-12" />
              </div>
              <h3 className="text-xl leading-6 font-medium text-gray-900">Welcome to CohortSync, Rahul!</h3>
              <p className="text-base text-gray-500">
                You're now part of the Jagriti Yatra 2022 community. Let's get your profile set up so you can connect
                with fellow members and make the most of your experience.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm text-blue-800 flex items-center">
                  <Info className="w-4 h-4 mr-2" /> This wizard will help you:
                </p>
                <ul className="mt-2 text-sm text-blue-700 space-y-1">
                  <li className="flex items-start">
                    <Check className="w-4 h-4 mt-1 mr-2" />
                    <span>Set up your skills and interests</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 mt-1 mr-2" />
                    <span>Find and connect with community members</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 mt-1 mr-2" />
                    <span>Customize your notification preferences</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 mt-1 mr-2" />
                    <span>Get familiar with the platform features</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-end">
                <Button onClick={nextStep}>
                  Let's Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Skills & Interests */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Skills & Interests</h3>
              <p className="text-sm text-gray-500">
                Select your skills and interests to help us connect you with like-minded community members and relevant
                content.
              </p>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Professional Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {professionalSkills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill, "skills")}
                      className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-all hover:scale-105 ${
                        selectedSkills.includes(skill)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Industry Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {industryInterests.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleSkill(interest, "interests")}
                      className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-all hover:scale-105 ${
                        selectedInterests.includes(interest)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Social Impact Areas</Label>
                <div className="flex flex-wrap gap-2">
                  {socialImpactAreas.map((area) => (
                    <button
                      key={area}
                      onClick={() => toggleSkill(area, "impact")}
                      className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-all hover:scale-105 ${
                        selectedImpactAreas.includes(area)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="customSkills">Add custom skills or interests</Label>
                <Input
                  id="customSkills"
                  placeholder="Type and press Enter to add"
                  value={customSkills}
                  onChange={(e) => setCustomSkills(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={nextStep}>
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Connections */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Suggested Connections</h3>
              <p className="text-sm text-gray-500">
                Based on your profile and interests, here are some community members you might want to connect with.
              </p>

              <div className="space-y-4">
                {suggestedConnections.map((connection, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${connection.color}`}
                      >
                        {connection.initials}
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{connection.name}</h4>
                            <p className="text-xs text-gray-500">{connection.title}</p>
                            <p className="text-xs text-gray-500">{connection.location}</p>
                          </div>
                          <Button size="sm">
                            <User className="w-3 h-3 mr-1" /> Connect
                          </Button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {connection.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="mt-2 text-xs text-gray-600 flex items-center">
                          <LinkIcon className="w-3 h-3 mr-1 text-gray-400" /> {connection.mutualConnections} mutual
                          connections
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
                  Show more suggestions <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={nextStep}>
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Preferences */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Notification Preferences</h3>
              <p className="text-sm text-gray-500">
                Customize how and when you receive notifications from the platform.
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-xs text-gray-500">Receive updates via email</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                    <p className="text-xs text-gray-500">Receive alerts on your device</p>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Notification Types</h4>

                  <div className="space-y-3">
                    {Object.entries(notificationTypes).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={value}
                          onCheckedChange={(checked) => setNotificationTypes((prev) => ({ ...prev, [key]: checked }))}
                        />
                        <Label htmlFor={key} className="text-sm text-gray-700">
                          {key === "messages" && "Direct messages"}
                          {key === "connections" && "Connection requests"}
                          {key === "mentions" && "Mentions and comments"}
                          {key === "events" && "Event invitations and updates"}
                          {key === "announcements" && "Community announcements"}
                          {key === "resources" && "New resources and content"}
                          {key === "digest" && "Weekly digest"}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Privacy Settings</h4>

                  <div className="space-y-3">
                    {Object.entries(privacySettings).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={value}
                          onCheckedChange={(checked) => setPrivacySettings((prev) => ({ ...prev, [key]: checked }))}
                        />
                        <Label htmlFor={key} className="text-sm text-gray-700">
                          {key === "profileVisibility" && "Make my profile visible to all community members"}
                          {key === "contactInfo" && "Show my contact information to connections only"}
                          {key === "activityFeed" && "Show my activity in community feeds"}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={nextStep}>
                  Complete Setup <Check className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Completion */}
          {currentStep === 5 && (
            <div className="text-center space-y-6">
              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100">
                <Check className="text-green-600 w-12 h-12" />
              </div>
              <h3 className="text-xl leading-6 font-medium text-gray-900">You're all set!</h3>
              <p className="text-base text-gray-500">
                Your profile is now complete and you're ready to start engaging with your community.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm text-blue-800 flex items-center justify-center">
                  <Info className="w-4 h-4 mr-2" /> What's next?
                </p>
                <ul className="mt-2 text-sm text-blue-700 space-y-1">
                  <li className="flex items-start">
                    <Check className="w-4 h-4 mt-1 mr-2" />
                    <span>Explore the community wall to see what's happening</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 mt-1 mr-2" />
                    <span>Connect with the suggested members</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 mt-1 mr-2" />
                    <span>Check out resources shared by your community</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 mt-1 mr-2" />
                    <span>Introduce yourself with your first post</span>
                  </li>
                </ul>
              </div>
              <div>
                <Link href="/">
                  <Button className="w-full">
                    Go to Community Wall <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
