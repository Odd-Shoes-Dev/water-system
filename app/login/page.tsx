import { Suspense } from 'react'
import { LoginForm } from '@/components/login-form'

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <header className="space-y-2">
        <h1 className="font-heading text-5xl">Sign in</h1>
        <p className="max-w-2xl text-muted-foreground">Team access to the Rain&amp;Renew dashboard.</p>
      </header>

      <div className="mx-auto max-w-xl">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
