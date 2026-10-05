'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { mapTiles } from '@/lib/providers/maps'

export type Position = { latitude: number; longitude: number }

// Moving the map, not the pin: the pin stays in the middle of the screen, so a
// finger never hides the exact spot. Whatever is under the pin is the location.
const round = (n: number) => Math.round(n * 1e6) / 1e6

function CenterTracker({ onChange }: { onChange: (position: Position) => void }) {
  const map = useMapEvents({
    moveend() {
      const center = map.getCenter()
      onChange({ latitude: round(center.lat), longitude: round(center.lng) })
    },
  })
  return null
}

// Jumps the map to a new place, for example after "Use my location".
function MoveTo({ target }: { target: (Position & { nonce: number }) | null }) {
  const map = useMap()
  useEffect(() => {
    if (target) map.setView([target.latitude, target.longitude], 18)
  }, [map, target])
  return null
}

export default function LocationPicker({
  value,
  target,
  onChange,
}: {
  value: Position
  target: (Position & { nonce: number }) | null
  onChange: (position: Position) => void
}) {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-md border border-input">
      <MapContainer
        center={[value.latitude, value.longitude]}
        zoom={17}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer url={mapTiles.url} attribution={mapTiles.attribution} />
        <CenterTracker onChange={onChange} />
        <MoveTo target={target} />
      </MapContainer>

      {/* The pin's tip sits exactly at the centre of the map. */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 z-[1000] -translate-x-1/2 -translate-y-full">
        <svg width="32" height="40" viewBox="0 0 32 40" className="drop-shadow-md">
          <path
            d="M16 0C7.2 0 0 7.2 0 16c0 11.2 16 24 16 24s16-12.8 16-24C32 7.2 24.8 0 16 0z"
            fill="hsl(186 72% 40%)"
          />
          <circle cx="16" cy="16" r="6" fill="white" />
        </svg>
      </div>
    </div>
  )
}
