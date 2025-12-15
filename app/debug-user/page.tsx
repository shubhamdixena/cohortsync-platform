"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export default function DebugUser() {
  const [userData, setUserData] = useState<any>(null)
  const [authUser, setAuthUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First check auth status
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        setAuthUser({ user, error: authError?.message })
        
        if (!user) {
          setError('Not authenticated')
          setLoading(false)
          return
        }

        // Now fetch user data from API
        const response = await fetch('/api/users/me')
        console.log('Debug: API response status', response.status)
        
        if (response.ok) {
          const data = await response.json()
          setUserData(data)
          console.log('Debug: User data received', data)
        } else {
          const errorData = await response.json()
          setError(`API error: ${response.status} - ${errorData.error}`)
          console.log('Debug: API error', errorData)
        }
      } catch (err: any) {
        setError(err.message)
        console.error('Debug: Exception', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleRefresh = async () => {
    setLoading(true)
    window.location.reload()
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Debug User Info</h1>
      
      <Button onClick={handleRefresh} className="mb-4">Refresh</Button>
      
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600 bg-red-50 p-2 rounded mb-4">Error: {error}</p>}
      
      {authUser && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Auth Status</CardTitle>
          </CardHeader>
          <CardContent>
            {authUser.user ? (
              <div className="space-y-2">
                <p><span className="font-semibold">Auth User ID:</span> {authUser.user.id}</p>
                <p><span className="font-semibold">Email:</span> {authUser.user.email}</p>
              </div>
            ) : (
              <p className="text-red-600">Not authenticated</p>
            )}
          </CardContent>
        </Card>
      )}
      
      {userData && (
        <Card>
          <CardHeader>
            <CardTitle>User Data from Database</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-semibold">Email:</p>
                <p className="font-mono bg-gray-100 p-2 rounded">{userData.email}</p>
              </div>
              <div>
                <p className="font-semibold">Name:</p>
                <p className="font-mono bg-gray-100 p-2 rounded">{userData.name || '(empty)'}</p>
              </div>
              <div>
                <p className="font-semibold">Initials:</p>
                <p className="font-mono bg-gray-100 p-2 rounded">{userData.initials || '(empty)'}</p>
              </div>
              <div>
                <p className="font-semibold">Role:</p>
                <p className="font-mono bg-gray-100 p-2 rounded">
                  {userData.role || '(empty)'} (type: {typeof userData.role})
                </p>
              </div>
              <div>
                <p className="font-semibold">Status:</p>
                <p className="font-mono bg-gray-100 p-2 rounded">{userData.status || '(empty)'}</p>
              </div>
              <div>
                <p className="font-semibold">ID:</p>
                <p className="font-mono bg-gray-100 p-2 rounded text-sm">{userData.id}</p>
              </div>
              <div>
                <p className="font-semibold">Full Data:</p>
                <pre className="font-mono bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(userData, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
