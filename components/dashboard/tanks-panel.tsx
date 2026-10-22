'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { StreamsOverview, TankSummary } from '@/lib/services/streams'
import { ConfirmDialog } from '../confirm-dialog'
import { TankForm } from '../tank-form'

const number = (value: number) => value.toLocaleString('en-US')

export function TanksPanel({ overview }: { overview: StreamsOverview }) {
  const router = useRouter()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<TankSummary | null>(null)
  const [deleting, setDeleting] = useState<TankSummary | null>(null)

  function openEdit(tank: TankSummary) {
    setEditing(tank)
    setFormOpen(true)
  }

  function openAdd() {
    setEditing(null)
    setFormOpen(true)
  }

  async function handleDelete() {
    if (!deleting) return
    const response = await fetch(`/api/tanks/${deleting.id}`, { method: 'DELETE' })
    setDeleting(null)
    if (response.ok) router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-accent">Tanks</p>
          <h1 className="mt-2 font-heading text-4xl">Rainwater tanks</h1>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          + Add tank
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Tank</th>
              <th className="px-4 py-3 font-medium">Site</th>
              <th className="px-4 py-3 font-medium">Capacity</th>
              <th className="px-4 py-3 font-medium">Level now</th>
              <th className="px-4 py-3 font-medium">Harvested (30 days)</th>
              <th className="px-4 py-3 font-medium">Used (30 days)</th>
              <th className="px-4 py-3 font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {overview.tanks.map((tank) => (
              <tr key={tank.id} className="border-t border-border">
                <td className="px-4 py-3">{tank.name}</td>
                <td className="px-4 py-3">{tank.site}</td>
                <td className="px-4 py-3">{number(tank.capacityLitres)} litres</td>
                <td className="px-4 py-3">
                  <LevelBar percent={tank.latestLevelPercent} />
                </td>
                <td className="px-4 py-3">{number(tank.harvestedLast30Days)} litres</td>
                <td className="px-4 py-3">{number(tank.usedLast30Days)} litres</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3 whitespace-nowrap">
                    <button type="button" onClick={() => openEdit(tank)} className="text-accent hover:underline">
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(tank)}
                      className="text-destructive hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
        {overview.rainfall.map((r) => (
          <div key={r.site} className="rounded-lg border border-border bg-card p-3 sm:p-4">
            <p className="text-xs text-muted-foreground sm:text-sm">Rainfall, last 7 days · {r.site}</p>
            <p className="mt-1 font-body text-2xl font-medium tabular-nums sm:text-3xl">{r.last7DaysMm} mm</p>
          </div>
        ))}
      </div>

      {formOpen && (
        <TankForm
          tank={editing ?? undefined}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false)
            router.refresh()
          }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title={`Delete "${deleting.name}"?`}
          description="This hides it from the dashboard and the map. Its reading history is kept."
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  )
}

function LevelBar({ percent }: { percent: number | null }) {
  if (percent === null) return <span className="text-muted-foreground">No reading</span>
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-28 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-accent" style={{ width: `${percent}%` }} />
      </div>
      <span>{percent}%</span>
    </div>
  )
}
