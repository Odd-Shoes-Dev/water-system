'use client'

// Last resort: used only if the root layout itself fails. It must include its own
// <html> and <body>, and it can't rely on the theme or navigation.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  console.error(error)

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'hsl(200 33% 98%)',
          color: 'hsl(210 50% 10%)',
          fontFamily: 'Manrope, system-ui, sans-serif',
          padding: '16px',
        }}
      >
        <div style={{ maxWidth: 420, textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 40, fontWeight: 400 }}>
            Something went wrong.
          </h1>
          <p style={{ color: 'hsl(210 15% 42%)' }}>
            Rain &amp; Renew couldn&apos;t load right now. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: 16,
              borderRadius: 999,
              border: 0,
              background: 'hsl(205 85% 20%)',
              color: 'hsl(195 40% 98%)',
              padding: '10px 24px',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
