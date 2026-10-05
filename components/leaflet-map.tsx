'use client'

import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import { mapTiles } from '@/lib/providers/maps'

export type MapMarker = {
  id: string | number
  latitude: number
  longitude: number
  title: string
  subtitle?: string
  color?: string
}

export default function LeafletMap({
  markers,
  center = [0.5, 32.3],
  zoom = 7,
}: {
  markers: MapMarker[]
  center?: [number, number]
  zoom?: number
}) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer url={mapTiles.url} attribution={mapTiles.attribution} />
      {markers.map((marker) => (
        <CircleMarker
          key={marker.id}
          center={[marker.latitude, marker.longitude]}
          radius={8}
          pathOptions={{ color: marker.color ?? 'hsl(186 72% 40%)', fillOpacity: 0.85 }}
        >
          <Popup>
            <strong>{marker.title}</strong>
            {marker.subtitle && <div>{marker.subtitle}</div>}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
