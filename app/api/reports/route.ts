import { NextResponse } from 'next/server'
import { getDataStore } from '@/lib/data'
import { REPORT_CATEGORIES, type ReportCategory } from '@/lib/data/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  const reports = await getDataStore().listRiverReports()
  return NextResponse.json({ reports })
}

// Youth submit reports from the app. Login and photo uploads come later; for
// now the photo URL is optional.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const category = body.category
  const description = typeof body.description === 'string' ? body.description.trim() : ''
  const latitude = Number(body.latitude)
  const longitude = Number(body.longitude)
  const reporterName = typeof body.reporterName === 'string' && body.reporterName.trim()
    ? body.reporterName.trim()
    : null
  const photoUrl = typeof body.photoUrl === 'string' && body.photoUrl.trim() ? body.photoUrl.trim() : null

  if (typeof category !== 'string' || !(category in REPORT_CATEGORIES)) {
    return NextResponse.json({ error: 'Choose a valid report category' }, { status: 400 })
  }
  if (description.length > 500) {
    return NextResponse.json({ error: 'Description must be 500 characters or fewer' }, { status: 400 })
  }
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    return NextResponse.json({ error: 'Latitude must be between -90 and 90' }, { status: 400 })
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return NextResponse.json({ error: 'Longitude must be between -180 and 180' }, { status: 400 })
  }

  const report = await getDataStore().createRiverReport({
    category: category as ReportCategory,
    description,
    latitude,
    longitude,
    photoUrl,
    reporterName,
  })
  return NextResponse.json({ report }, { status: 201 })
}
