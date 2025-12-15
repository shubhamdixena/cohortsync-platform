import { NextRequest, NextResponse } from 'next/server'
import { updateUser } from '@/lib/db-service'
import { getSupabaseAdmin } from '@/lib/supabase'
import { createRouteHandlerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'

export async function PATCH(request: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  try {
    const body = await request.json()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: userData } = await supabase
      .from('User')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const { userId, status, ...otherUpdates } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Update the specified user
    const updateData = {
      status,
      ...otherUpdates,
      updatedAt: new Date().toISOString()
    }
    
    console.log('Admin updating user', userId, 'with:', updateData)
    
    // Use admin client to bypass RLS
    const adminSupabase = getSupabaseAdmin()
    const updatedUser = await updateUser(userId, updateData, adminSupabase)
    return NextResponse.json(updatedUser)
  } catch (error: any) {
    console.error('Admin PATCH /api/admin/users error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
