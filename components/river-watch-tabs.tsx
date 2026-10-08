'use client'

import { useState } from 'react'
import { ActivitiesList } from './activities-list'
import type { MapMarker } from './leaflet-map'
import { MapView } from './map-view'
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

  const openCount = reports.filter((r) => r.status === 'open').length
  const hotspotCount = reports.filter((r) => r.category === 'pollution_hotspot').length
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length

  const tabClass = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
      active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
    }`

  return (
    <div className="space-y-6">
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
        <ActivitiesList activities={activities} />
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
