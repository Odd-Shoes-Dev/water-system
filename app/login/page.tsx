import { redirect } from 'next/navigation'

// No real authentication yet: see docs/known-issues.md for the planned
// Google sign-in + email allowlist. For now, "logging in" just goes
// straight to the dashboard.
export default function LoginPage() {
  redirect('/dashboard')
}
