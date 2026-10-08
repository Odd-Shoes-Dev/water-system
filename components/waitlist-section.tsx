'use client'

import { useState } from 'react'
import { WaitlistForm } from './waitlist-form'

// The heading and intro live on the page that uses this, so it can be
// embedded (a short teaser) or stand alone (the full /waitlist page)
// without repeating itself.
export function WaitlistSection({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount)

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        {count.toLocaleString('en-US')} {count === 1 ? 'person has' : 'people have'} joined so far.
      </p>
      <div className="mx-auto max-w-xl">
        <WaitlistForm onJoined={() => setCount((current) => current + 1)} />
      </div>
    </div>
  )
}
