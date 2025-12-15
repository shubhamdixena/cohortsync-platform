"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/lib/user-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TestUser() {
  const { userInfo, currentRole, isLoading, refreshUser } = useUser()
  const [testMessage, setTestMessage] = useState("")

  const handleRefresh = async () => {
    setTestMessage("Refreshing...")
    await refreshUser()
    setTestMessage("Refreshed!")
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Context Test</h1>
      
      <div className="mb-4">
        <Button onClick={handleRefresh}>Refresh User</Button>
        {testMessage && <p className="text-blue-600 mt-2">{testMessage}</p>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Context Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-semibold">Loading:</p>
            <p className="text-lg">{isLoading ? "Yes" : "No"}</p>
          </div>
          
          <div>
            <p className="font-semibold">Current Role:</p>
            <p className="text-lg">{currentRole || "null"}</p>
          </div>
          
          {userInfo ? (
            <>
              <div>
                <p className="font-semibold">Name:</p>
                <p className="text-lg">{userInfo.name || "null"}</p>
              </div>
              <div>
                <p className="font-semibold">Email:</p>
                <p className="text-lg">{userInfo.email || "null"}</p>
              </div>
              <div>
                <p className="font-semibold">Role:</p>
                <p className="text-lg">{userInfo.role || "null"}</p>
              </div>
              <div>
                <p className="font-semibold">Initials:</p>
                <p className="text-lg">{userInfo.initials || "null"}</p>
              </div>
              <div>
                <p className="font-semibold">Full User Info:</p>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(userInfo, null, 2)}
                </pre>
              </div>
            </>
          ) : (
            <p className="text-red-600">No user info loaded</p>
          )}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Check the console (F12) for "fetchUser" log messages</li>
            <li>The "Loading" field should change from "Yes" to "No" after data is fetched</li>
            <li>The user info should populate with your actual data</li>
            <li>If it says "No user info loaded", then /api/users/me is returning an error</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
