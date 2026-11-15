import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin' // adjust path if needed

export async function GET(request) {
  const supabaseAdmin = getSupabaseAdmin() // <-- Call it inside the handler

  const { data, error } = await supabaseAdmin
    .from('your_table')
    .select('*')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function POST(request) {
  const supabaseAdmin = getSupabaseAdmin() // <-- Call it inside each handler that needs it
  // ... rest of your POST logic
}