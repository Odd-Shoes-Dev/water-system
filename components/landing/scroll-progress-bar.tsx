'use client'

import { useScrollProgress } from './hooks'

export function ScrollProgressBar() {
  const percent = useScrollProgress()
  return (
    <div
      className="fixed inset-x-0 top-0 z-[2500] h-1 bg-gradient-to-r from-story-sun via-story-river to-story-leaf"
      style={{ width: `${percent}%` }}
      aria-hidden="true"
    />
  )
}
