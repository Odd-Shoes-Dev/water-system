import { NextResponse } from 'next/server'
import { getDataStore } from '@/lib/data'
import { REPORT_CATEGORIES } from '@/lib/data/types'

export const dynamic = 'force-dynamic'

// Dashboard-only (edit/delete a report). Protected by proxy.ts. Deliberately
// narrower than the public submission: photos and coordinates stay as
// originally submitted, this only covers the fields someone would actually
// need to correct. Status changes go through /api/reports/[id]/status instead.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params
  const id = Number(idParam)
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: 'Invalid report id' }, { status: 400 })
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const category = body.category
  const description = typeof body.description === 'string' ? body.description.trim() : ''
  const locationDescription = typeof body.locationDescription === 'string' ? body.locationDescription.trim() : ''
  const reporterName =
    typeof body.reporterName === 'string' && body.reporterName.trim() ? body.reporterName.trim() : null

  if (typeof category !== 'string' || !(category in REPORT_CATEGORIES)) {
    return NextResponse.json({ error: 'Choose a valid category' }, { status: 400 })
  }
  if (locationDescription.length < 2 || locationDescription.length > 200) {
    return NextResponse.json({ error: 'Enter a location between 2 and 200 characters' }, { status: 400 })
  }
  if (description.length > 1000) {
    return NextResponse.json({ error: 'Description must be 1000 characters or fewer' }, { status: 400 })
  }

  try {
    const report = await getDataStore().updateRiverReport(id, {
      category: category as keyof typeof REPORT_CATEGORIES,
      description,
      locationDescription,
      reporterName,
    })
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }
    return NextResponse.json({ report })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Could not save that right now. Please try again.' }, { status: 502 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params
  const id = Number(idParam)
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: 'Invalid report id' }, { status: 400 })
  }

  try {
    await getDataStore().deleteRiverReport(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Could not delete that right now. Please try again.' }, { status: 502 })
  }
}
