import { createRouteHandlerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getSubgroups, createSubgroup, joinSubgroup, leaveSubgroup } from '@/lib/db-service'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const subgroups = await getSubgroups(supabase)
    return NextResponse.json(subgroups)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const body = await request.json()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, subgroupId, ...subgroupData } = body

    if (action === 'join' && subgroupId) {
      const membership = await joinSubgroup(subgroupId, user.id, supabase)
      return NextResponse.json(membership)
    }

    if (action === 'leave' && subgroupId) {
      await leaveSubgroup(subgroupId, user.id, supabase)
      return NextResponse.json({ success: true })
    }

    // Create new subgroup
    const subgroup = await createSubgroup({
      id: crypto.randomUUID(),
      name: subgroupData.name,
      description: subgroupData.description || null,
      type: subgroupData.type,
      icon: subgroupData.icon || null,
      color: subgroupData.color || null,
      moderators: subgroupData.moderators || null,
      updatedAt: new Date().toISOString()
    }, supabase)

    return NextResponse.json(subgroup, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
