// app/api/health/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Test Supabase connection
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Supabase connection failed',
        error: error.message,
        database: 'disconnected'
      },  { status: 503 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'API is healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      provider: 'supabase'
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'API health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        database: 'disconnected'
      },
      { status: 503 }
    )
  }
}
