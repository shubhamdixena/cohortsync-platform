import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, getAllUsers, updateUser, updateProfile } from '@/lib/db-service'
import { createRouteHandlerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')
    
    if (userId) {
      console.log('API: Fetching user with ID:', userId)
      // Fetch User separately
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (userError) {
        console.error('Supabase User Error:', userError)
        return NextResponse.json({ 
          error: `Database error: ${userError.message}`,
          code: userError.code 
        }, { status: 500 })
      }
      
      if (!userData) {
        console.log('User not found for ID:', userId)
        return NextResponse.json({ 
          error: 'User not found',
          userId: userId 
        }, { status: 404 })
      }

      // Fetch Profile separately
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Supabase Profile Error:', profileError)
        // Don't fail - profile might not exist
      }
      
      const responseData = {
        ...userData,
        profile: profileData || null
      }
      
      console.log('Successfully fetched user:', userData.id, userData.name)
      console.log('User profile data:', responseData.profile)
      return NextResponse.json(responseData)
    }
    
    console.log('API: Fetching all users')
    const users = await getAllUsers(supabase)
    return NextResponse.json(users)
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      error: error?.message || 'An unexpected error occurred',
      details: typeof error === 'object' ? JSON.stringify(error, Object.getOwnPropertyNames(error)) : String(error)
    }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  console.log('PATCH /api/users started')
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const body = await request.json()
    console.log('PATCH /api/users body received:', Object.keys(body))
    
    if (!body) {
      return NextResponse.json({ error: 'Missing request body' }, { status: 400 })
    }

    // Try to get user from session (cookies)
    let user = null
    
    const { data: { user: sessionUser }, error: sessionError } = await supabase.auth.getUser()
    
    console.log('Session auth check:', { userId: sessionUser?.id, error: sessionError?.message })

    if (sessionUser) {
      user = sessionUser
      console.log('User authenticated via session:', user.id)
    } else if (sessionError) {
      console.error('Session auth error:', sessionError.message)
      
      // If no session, try Authorization header
      const authHeader = request.headers.get('Authorization')
      console.log('No session user, checking Authorization header:', !!authHeader)
      
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        console.log('Token found in header, attempting to verify...')
        
        // Set the token in the session and try to get the user
        const { data, error } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: ''
        })
        
        if (!error && data.user) {
          user = data.user
          console.log('User authenticated via token:', user.id)
        } else {
          console.error('Token verification failed:', error?.message)
        }
      }
    }
    
    if (!user) {
      console.error('PATCH /api/users: No authenticated user')
      return NextResponse.json({ 
        error: 'Unauthorized', 
        details: 'No valid session or token provided'
      }, { status: 401 })
    }
    
    console.log('PATCH /api/users user authenticated:', user.id)

    const { profile, ...userData } = body

    // Update User table
    if (Object.keys(userData).length > 0) {
      const updateData = {
        ...userData,
        updated_at: new Date().toISOString()
      }
      console.log('Updating user:', user.id, 'with fields:', Object.keys(updateData))
      const result = await updateUser(user.id, updateData, supabase)
      console.log('User updated successfully')
    }

    // Update Profile table
    if (profile && Object.keys(profile).length > 0) {
      const profileData = {
        ...profile,
        updated_at: new Date().toISOString()
      }
      console.log('Updating profile for user:', user.id, 'with fields:', Object.keys(profileData))
      const result = await updateProfile(user.id, profileData, supabase)
      console.log('Profile updated successfully')
    }

    const updatedUser = await getCurrentUser(supabase)
    return NextResponse.json(updatedUser)
  } catch (error: any) {
    console.error('PATCH /api/users error:', error)
    
    // Construct a safe error object
    let details = String(error)
    try {
      if (typeof error === 'object' && error !== null) {
        details = JSON.stringify(error, Object.getOwnPropertyNames(error))
      }
    } catch (e) {
      details = `Error serializing details: ${e}`
    }

    const errorResponse = {
      error: error?.message || (typeof error === 'string' ? error : 'An unexpected error occurred'),
      details
    }
    
    console.log('Returning error response:', errorResponse)
    
    return NextResponse.json(errorResponse, { status: 500 })
  }
}
