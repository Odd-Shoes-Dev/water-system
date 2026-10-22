'use client'

import { useState } from 'react'
import type { Position } from './location-picker'

const round = (n: number) => Math.round(n * 1e6) / 1e6

// Shared position/target/"use my location" state for any form embedding
// LocationPicker. Extracted from components/report-form.tsx, which keeps its
// own copy (left alone — this hook only serves newer forms).
export function useLocationPicker(initial: Position) {
  const [position, setPosition] = useState<Position>(initial)
  const [target, setTarget] = useState<(Position & { nonce: number }) | null>(null)
  const [locating, setLocating] = useState(false)
  const [locationMessage, setLocationMessage] = useState<string | null>(null)

  function useMyLocation() {
    setLocationMessage(null)
    if (!navigator.geolocation) {
      setLocationMessage('This browser cannot find your location. Move the map to your spot instead.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (result) => {
        const found = { latitude: round(result.coords.latitude), longitude: round(result.coords.longitude) }
        setPosition(found)
        setTarget({ ...found, nonce: Date.now() })
        setLocating(false)
        setLocationMessage(
          `Found you, accurate to about ${Math.round(result.coords.accuracy)} m. Drag the map to put the pin on the exact spot.`,
        )
      },
      (failure) => {
        setLocating(false)
        setLocationMessage(
          failure.code === failure.PERMISSION_DENIED
            ? 'Location access is blocked. You can still move the map to your spot.'
            : 'Could not get your location. Move the map to your spot.',
        )
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0 },
    )
  }

  return { position, setPosition, target, locating, locationMessage, useMyLocation }
}
