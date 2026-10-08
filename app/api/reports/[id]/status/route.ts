import { NextResponse } from 'next/server'
import { getDataStore } from '@/lib/data'

export const dynamic = 'force-dynamic'

const ALLOWED_STATUSES = ['open', 'verified', 'resolved'] as const

// Dashboard-only action (used from River watch's "Mark resolved" button).
// Not access-controlled yet: see docs/known-issues.md.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params
  const id = Number(idParam)
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: 'Invalid report id' }, { status: 400 })
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const status = body?.status
  if (typeof status !== 'string' || !ALLOWED_STATUSES.includes(status as (typeof ALLOWED_STATUSES)[number])) {
    return NextResponse.json({ error: 'Status must be open, verified or resolved' }, { status: 400 })
  }

  try {
    const report = await getDataStore().updateRiverReportStatus(id, status as (typeof ALLOWED_STATUSES)[number])
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }
    return NextResponse.json({ report })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Could not update the report right now. Please try again.' }, { status: 502 })
  }
}
