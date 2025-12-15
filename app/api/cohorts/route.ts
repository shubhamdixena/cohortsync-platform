import { createRouteHandlerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getSubgroups } from '@/lib/db-service'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const subgroups = await getSubgroups(supabase)
    
    // Transform data to match UI expectations if needed
    // For example, calculating memberCount
    const cohorts = subgroups.map((group: any) => ({
      ...group,
      memberCount: group.members ? group.members.length : 0,
      // Ensure tags is parsed if it's a string
      tags: typeof group.tags === 'string' ? JSON.parse(group.tags) : group.tags || []
    }))

    return NextResponse.json(cohorts)
  } catch (error: any) {
    console.error('Error fetching cohorts:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
