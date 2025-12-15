import { createRouteHandlerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getResources, createResource } from '@/lib/db-service'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const resources = await getResources(supabase)
    return NextResponse.json(resources)
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

    const resource = await createResource({
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description || null,
      type: body.type,
      category: body.category,
      url: body.url || null,
      fileUrl: body.fileUrl || null,
      fileSize: body.fileSize || null,
      downloads: 0,
      featured: body.featured || false,
      accessLevel: body.accessLevel || 'MEMBERS_ONLY',
      uploadedById: user.id,
      tags: body.tags || null,
      updatedAt: new Date().toISOString()
    }, supabase)

    return NextResponse.json(resource, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
