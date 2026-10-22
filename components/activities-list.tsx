'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ACTIVITY_KIND_LABELS, type Activity } from '@/lib/data/types'
import { ActivityForm } from './activity-form'
import { ConfirmDialog } from './confirm-dialog'

const number = (value: number) => value.toLocaleString('en-US')
const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { dateStyle: 'medium' })

// Dashboard-only (no public equivalent), so Edit/Delete are always shown —
// unlike ReportsList, which gates them behind allowStatusUpdate.
export function ActivitiesList({ activities }: { activities: Activity[] }) {
  const router = useRouter()
  const [items, setItems] = useState(activities)
  // Resync when the server sends fresh data, for example after router.refresh().
  useEffect(() => setItems(activities), [activities])
  const [editing, setEditing] = useState<Activity | null>(null)
  const [deleting, setDeleting] = useState<Activity | null>(null)

  const riverCleanUps = items.filter((a) => a.kind === 'clean_up').length
  const treesPlanted = items.reduce((sum, a) => sum + a.treesPlanted, 0)
  const youthEngaged = items.reduce((sum, a) => sum + a.youthCount, 0)
  const wasteCollectedKg = items.reduce((sum, a) => sum + a.wasteCollectedKg, 0)

  const sorted = [...items].sort((a, b) => (a.occurredOn < b.occurredOn ? 1 : -1))

  async function handleDelete() {
    if (!deleting) return
    const response = await fetch(`/api/activities/${deleting.id}`, { method: 'DELETE' })
    setDeleting(null)
    if (response.ok) router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat label="River clean-ups" value={number(riverCleanUps)} />
        <Stat label="Trees planted" value={number(treesPlanted)} />
        <Stat label="Youth engaged" value={number(youthEngaged)} />
        <Stat label="Waste collected" value={number(wasteCollectedKg)} unit="kg" />
      </div>

      <ul className="space-y-3">
        {sorted.length === 0 && (
          <li className="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">
            No activities logged yet.
          </li>
        )}
        {sorted.map((activity) => (
          <li key={activity.id} className="rounded-lg border border-border bg-card p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-medium">
                {ACTIVITY_KIND_LABELS[activity.kind]}
                {activity.location && <span className="text-muted-foreground"> · {activity.location}</span>}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDate(activity.occurredOn)} · {activity.youthCount} youth
              </p>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
              <span>{number(activity.participants)} participants</span>
              <span>{number(activity.peopleReached)} people reached</span>
              <span>{number(activity.peopleEmployed)} employed</span>
              <span>{number(activity.volunteers)} volunteers</span>
              <span>{number(activity.treesPlanted)} trees</span>
              <span>{number(activity.wasteCollectedKg)} kg waste</span>
              <span>{number(activity.areaRestoredM2)} m² restored</span>
            </div>
            {activity.description && <p className="mt-2 text-sm">{activity.description}</p>}
            {activity.photoUrls.length > 0 && (
              <div className="mt-3 flex gap-2">
                {activity.photoUrls.slice(0, 4).map((url) => (
                  // eslint-disable-next-line @next/next/no-img-element -- remote ImageKit URL, not a local asset
                  <img key={url} src={url} alt="" className="h-16 w-16 rounded-md object-cover" />
                ))}
              </div>
            )}
            <div className="mt-3 flex gap-3 text-sm">
              <button type="button" onClick={() => setEditing(activity)} className="text-accent hover:underline">
                Edit
              </button>
              <button type="button" onClick={() => setDeleting(activity)} className="text-destructive hover:underline">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editing && (
        <ActivityForm
          activity={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            router.refresh()
          }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete this activity?"
          description="This removes it from River watch and from these totals."
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  )
}

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-body text-3xl font-medium tabular-nums">
        {value}
        {unit && <span className="ml-1 text-base text-muted-foreground">{unit}</span>}
      </p>
    </div>
  )
}
