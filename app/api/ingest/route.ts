import { NextResponse } from 'next/server'
import { getDataStore } from '@/lib/data'
import { ingestTankReadings } from '@/lib/services/ingest'

// Sensors POST readings here with "Authorization: Bearer <device key>".
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const result = await ingestTankReadings(
    getDataStore(),
    request.headers.get('authorization'),
    body,
  )

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }
  return NextResponse.json({ accepted: result.accepted }, { status: 202 })
}
