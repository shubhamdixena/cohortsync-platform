import { createRouteHandlerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getAnnouncements, createAnnouncement } from '@/lib/db-service'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const announcements = await getAnnouncements(supabase)
    return NextResponse.json(announcements)
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

    // Check if user is admin
    const { data: userData } = await supabase
      .from('User')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const announcement = await createAnnouncement({
      id: crypto.randomUUID(),
      title: body.title,
      content: body.content,
      priority: body.priority || 'NORMAL',
      status: body.status || 'DRAFT',
      category: body.category || null,
      targetAudience: body.targetAudience || null,
      createdById: user.id,
      publishedAt: body.publishedAt || null,
      expiresAt: body.expiresAt || null,
      updatedAt: new Date().toISOString()
    }, supabase)

    return NextResponse.json(announcement, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
