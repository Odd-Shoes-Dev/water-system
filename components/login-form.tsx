'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    const data = new FormData(event.currentTarget)
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.get('email'), password: data.get('password') }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        setError(body?.error ?? 'Could not sign in')
        return
      }

      const next = searchParams.get('next')
      router.push(next && next.startsWith('/') ? next : '/dashboard')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'w-full rounded-md border border-input bg-background px-3 py-2 text-sm'

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-card p-5">
      <label className="block space-y-1 text-sm">
        <span className="font-medium">Email</span>
        <input name="email" type="email" required autoComplete="email" className={inputClass} />
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-medium">Password</span>
        <input name="password" type="password" required autoComplete="current-password" className={inputClass} />
      </label>

      {error && (
        <p role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {submitting ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
