'use client'

import { useEffect, useState } from 'react'
import { ActivitiesList } from './activities-list'
import { ActivityForm } from './activity-form'
import type { MapMarker } from './leaflet-map'
import { MapView } from './map-view'
import { ReportFormModal } from './report-form-modal'
import { ReportsList, type ReportListItem } from './reports-list'
import type { Activity } from '@/lib/data/types'

type Tab = 'reports' | 'restoration'

const number = (value: number) => value.toLocaleString('en-US')

export function RiverWatchTabs({
  reports,
  activities,
  markers,
}: {
  reports: ReportListItem[]
  activities: Activity[]
  markers: MapMarker[]
}) {
  const [tab, setTab] = useState<Tab>('reports')
  const [items, setItems] = useState(activities)
  useEffect(() => setItems(activities), [activities])
  const [reportFormOpen, setReportFormOpen] = useState(false)
  const [activityFormOpen, setActivityFormOpen] = useState(false)

  const openCount = reports.filter((r) => r.status === 'open').length
  const hotspotCount = reports.filter((r) => r.category === 'pollution_hotspot').length
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length

  const tabClass = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
      active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
    }`

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-4xl">River watch</h1>
        {tab === 'reports' ? (
          <button
            type="button"
            onClick={() => setReportFormOpen(true)}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            + Report issue
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setActivityFormOpen(true)}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            + Log activity
          </button>
        )}
      </div>

      <div className="inline-flex rounded-full border border-border bg-card p-1">
        <button type="button" onClick={() => setTab('reports')} className={tabClass(tab === 'reports')}>
          Reports
        </button>
        <button type="button" onClick={() => setTab('restoration')} className={tabClass(tab === 'restoration')}>
          Restoration
        </button>
      </div>

      {tab === 'reports' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <Stat label="Pollution reports" value={number(reports.length)} />
            <Stat label="Open issues" value={number(openCount)} />
            <Stat label="Pollution hotspots" value={number(hotspotCount)} />
            <Stat label="Resolved" value={number(resolvedCount)} />
          </div>
          <MapView markers={markers} center={[-0.61, 30.65]} zoom={13} heightClassName="h-[420px]" />
          <ReportsList reports={reports} allowStatusUpdate />
        </div>
      ) : (
        <ActivitiesList activities={items} />
      )}

      {reportFormOpen && (
        // Lets a logged-in team member report something they heard about,
        // using the same public form and validation as /reports.
        <ReportFormModal onClose={() => setReportFormOpen(false)} />
      )}

      {activityFormOpen && (
        <ActivityForm
          onClose={() => setActivityFormOpen(false)}
          onCreated={(activity) => {
            setItems((current) => [activity, ...current])
            setActivityFormOpen(false)
          }}
        />
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-body text-3xl font-medium tabular-nums">{value}</p>
    </div>
  )
}
