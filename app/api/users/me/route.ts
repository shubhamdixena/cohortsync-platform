import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/db-service'
import { createRouteHandlerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    console.log('GET /api/users/me: Checking authentication...')
    
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
    console.log('Auth check:', { authUser: authUser?.id, authError: authError?.message })
    
    const user = await getCurrentUser(supabase)
    
    console.log('GET /api/users/me result:', { 
      found: !!user, 
      id: user?.id, 
      email: user?.email,
      name: user?.name,
      role: user?.role,
      hasProfile: !!user?.profile
    })
    
    if (!user) {
      console.error('User not found in database')
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('GET /api/users/me error:', error)
    
    const errorMessage = error?.message || (typeof error === 'string' ? error : 'An unexpected error occurred')
    const errorDetails = error?.code || error?.hint || (typeof error === 'object' ? JSON.stringify(error) : String(error))
    
    return NextResponse.json({ 
      error: errorMessage,
      details: errorDetails
    }, { status: 500 })
  }
}
