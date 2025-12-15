"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ArrowRight, ArrowLeft, User, Upload, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

const steps = [
  { id: 1, name: "Account", description: "Create your account" },
  { id: 2, name: "Profile", description: "Set up your profile" },
  { id: 3, name: "Cohort", description: "Join your cohort" },
  { id: 4, name: "Complete", description: "Registration complete" },
]

export default function RegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
    firstName: "",
    lastName: "",
    location: "",
    headline: "",
    linkedinProfile: "",
    inviteCode: "",
    cohortProgram: "",
    cohortYear: "",
    role: "",
    referralSource: "",
  })

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields")
      return false
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    if (!formData.terms) {
      setError("You must agree to the Terms of Service")
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.firstName || !formData.lastName) {
      setError("Please fill in all required fields")
      return false
    }
    return true
  }

  const nextStep = () => {
    setError("")
    
    // Validate current step before proceeding
    if (currentStep === 1 && !validateStep1()) {
      return
    }
    if (currentStep === 2 && !validateStep2()) {
      return
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setError("")
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const completeRegistration = async () => {
    setError("")
    setLoading(true)

    try {
      console.log('Step 1: Creating user with Supabase Auth...')
      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            location: formData.location,
            headline: formData.headline,
          },
        },
      })

      if (authError) {
        console.error('Auth error:', authError)
        setError(authError.message)
        setLoading(false)
        return
      }

      console.log('Step 1 ✓: Auth user created with ID:', authData.user?.id)

      if (authData.user) {
        // Create User and Profile records in the database
        const { data: { session } } = await supabase.auth.getSession()
        
        console.log('Step 2: Session check - Session exists:', !!session)
        
        if (session) {
          // Create User record
          const userInitials = `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase()
          
          // Map role to valid enum values (MEMBER or ADMIN)
          // "member", "mentor", "alumni" all map to MEMBER
          const userRole = formData.role ? 'MEMBER' : 'MEMBER'
          
          console.log('Step 3: Creating User record', {
            firstName: formData.firstName,
            lastName: formData.lastName,
            initials: userInitials,
            role: userRole,
            formDataRole: formData.role,
            status: 'PENDING'
          })
          const { error: userError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              email: formData.email,
              name: `${formData.firstName} ${formData.lastName}`,
              initials: userInitials,
              role: userRole,
              status: 'PENDING', // Admin needs to approve
              password: 'managed_by_supabase_auth',
              updated_at: new Date().toISOString()
            })

          if (userError) {
            console.error('Error creating user record:', {
              message: userError.message,
              code: userError.code,
              details: userError.details,
              hint: userError.hint,
              fullError: userError
            })
            setError(`Failed to create user record: ${userError.message || 'Unknown error'}`)
            setLoading(false)
            return
          }

          console.log('Step 3 ✓: User record created')

          // Create Profile record
          console.log('Step 4: Creating Profile record')
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: crypto.randomUUID(),
              user_id: authData.user.id,
              title: formData.headline,
              bio: formData.location,
              linkedin: formData.linkedinProfile,
              expertise: JSON.stringify([]),
              skills: JSON.stringify([]),
              looking_for: JSON.stringify([]),
              offering: JSON.stringify([]),
              updated_at: new Date().toISOString()
            })

          if (profileError) {
            console.error('Error creating profile record:', {
              message: profileError.message,
              code: profileError.code,
              details: profileError.details,
              hint: profileError.hint,
              fullError: profileError
            })
            setError(`Failed to create profile record: ${profileError.message || 'Unknown error'}`)
            setLoading(false)
            return
          }

          console.log('Step 4 ✓: Profile record created')
        }

        // Move to completion step
        setCurrentStep(4)
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login")
          router.refresh()
        }, 2000)
      }
    } catch (err: any) {
      console.error('Registration exception:', err)
      setError(err.message || "An error occurred during registration")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
            <span className="text-xl font-bold text-white">CS</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Join your cohort community and stay connected
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

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="shadow-lg border-gray-200">
          <div className="p-6">
            {/* Step 1: Account Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="mt-1 border-gray-300 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    className="mt-1 border-gray-300 focus:border-blue-500"
                    disabled={loading}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Must be at least 8 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                    className="mt-1 border-gray-300 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.terms}
                    onCheckedChange={(checked) => updateFormData("terms", checked)}
                    disabled={loading}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                    I agree to the{" "}
                    <Link href="#" className="text-blue-600 hover:text-blue-700">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-blue-600 hover:text-blue-700">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button 
                  onClick={nextStep} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: Profile Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <Label htmlFor="firstName" className="text-gray-700 font-medium">First name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                      className="mt-1 border-gray-300 focus:border-blue-500"
                      disabled={loading}
                    />
                  </div>
                  <div className="w-1/2">
                    <Label htmlFor="lastName" className="text-gray-700 font-medium">Last name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                      className="mt-1 border-gray-300 focus:border-blue-500"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" className="text-gray-700 font-medium">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={(e) => updateFormData("location", e.target.value)}
                    className="mt-1 border-gray-300 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="headline" className="text-gray-700 font-medium">Professional headline</Label>
                  <Input
                    id="headline"
                    placeholder="e.g., Entrepreneur | Impact Maker"
                    value={formData.headline}
                    onChange={(e) => updateFormData("headline", e.target.value)}
                    className="mt-1 border-gray-300 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="linkedinProfile" className="text-gray-700 font-medium">
                    LinkedIn profile URL <span className="text-gray-500 text-sm">(optional)</span>
                  </Label>
                  <Input
                    id="linkedinProfile"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={formData.linkedinProfile}
                    onChange={(e) => updateFormData("linkedinProfile", e.target.value)}
                    className="mt-1 border-gray-300 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>

                <div className="flex justify-between gap-4">
                  <Button 
                    variant="outline" 
                    onClick={prevStep}
                    disabled={loading}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={nextStep}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Cohort Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="inviteCode" className="text-gray-700 font-medium">Invitation code</Label>
                  <Input
                    id="inviteCode"
                    placeholder="Enter your invitation code"
                    value={formData.inviteCode}
                    onChange={(e) => updateFormData("inviteCode", e.target.value)}
                    className="mt-1 border-gray-300 focus:border-blue-500"
                    disabled={loading}
                  />
                  <p className="mt-1 text-xs text-gray-500">Optional - Required to join a specific cohort</p>
                </div>

                <div>
                  <Label htmlFor="cohortProgram" className="text-gray-700 font-medium">Program</Label>
                  <Select
                    value={formData.cohortProgram}
                    onValueChange={(value) => updateFormData("cohortProgram", value)}
                    disabled={loading}
                  >
                    <SelectTrigger className="mt-1 border-gray-300">
                      <SelectValue placeholder="Select your program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chevening">Chevening</SelectItem>
                      <SelectItem value="jagriti">Jagriti Yatra</SelectItem>
                      <SelectItem value="un">UN Youth Exchange</SelectItem>
                      <SelectItem value="startup">Startup India</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="role" className="text-gray-700 font-medium">Your role</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => updateFormData("role", value)}
                    disabled={loading}
                  >
                    <SelectTrigger className="mt-1 border-gray-300">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="mentor">Mentor</SelectItem>
                      <SelectItem value="alumni">Alumni</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between gap-4">
                  <Button 
                    variant="outline" 
                    onClick={prevStep}
                    disabled={loading}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={completeRegistration}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? "Creating account..." : "Complete Registration"}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Completion */}
            {currentStep === 4 && (
              <div className="text-center space-y-6 py-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Registration successful!</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Please check your email to verify your account. You'll be redirected to login shortly.
                  </p>
                </div>
                <Button 
                  onClick={() => router.push("/login")}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Go to Login
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Sign In Link */}
        {currentStep !== 4 && (
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
