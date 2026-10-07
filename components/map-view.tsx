'use client'

import dynamic from 'next/dynamic'
import type { MapMarker } from './leaflet-map'

// Leaflet needs the browser, so the map is loaded only on the client.
const LeafletMap = dynamic(() => import('./leaflet-map'), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-muted-foreground">Loading map…</div>,
})

export function MapView({
  heightClassName = 'h-[420px]',
  ...props
}: {
  markers: MapMarker[]
  center?: [number, number]
  zoom?: number
  heightClassName?: string
}) {
  return (
    <div className={`${heightClassName} w-full overflow-hidden rounded-lg border border-border bg-card`}>
      <LeafletMap {...props} />
    </div>
  )
}
