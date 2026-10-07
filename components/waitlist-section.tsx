'use client'

import { useState } from 'react'
import { WaitlistForm } from './waitlist-form'

export function WaitlistSection({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount)

  return (
    <section className="space-y-4 border-t border-border pt-10">
      <div>
        <h2 className="font-heading text-3xl">Join the programme</h2>
        <p className="text-muted-foreground">
          {count.toLocaleString('en-US')} {count === 1 ? 'person has' : 'people have'} joined so far.
        </p>
      </div>
      <div className="max-w-xl">
        <WaitlistForm onJoined={() => setCount((current) => current + 1)} />
      </div>
    </section>
  )
}
