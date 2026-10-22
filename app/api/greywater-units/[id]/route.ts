import { NextResponse } from 'next/server'
import { getDataStore } from '@/lib/data'
import { parseGreywaterUnitInput } from '@/lib/services/greywater-unit-input'

export const dynamic = 'force-dynamic'

// Dashboard-only (edit/delete a greywater system). Protected by proxy.ts.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = parseGreywaterUnitInput(body)
  if ('error' in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  try {
    const unit = await getDataStore().updateGreywaterUnit(id, parsed.unit)
    if (!unit) {
      return NextResponse.json({ error: 'Greywater system not found' }, { status: 404 })
    }
    return NextResponse.json({ unit })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Could not save that right now. Please try again.' }, { status: 502 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    await getDataStore().deleteGreywaterUnit(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Could not delete that right now. Please try again.' }, { status: 502 })
  }
}
