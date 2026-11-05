'use client'

import { useMemo, useState } from 'react'

// createdAt crosses the server/client boundary as a string: WaitlistEntry is
// a Date on the server, same pattern as ReportListItem in reports-list.tsx.
export type WaitlistEntryListItem = {
  id: number
  name: string
  place: string
  phone: string
  email: string | null
  photoUrl: string | null
  audioUrl: string | null
  createdAt: string
}

type SortOption = 'newest' | 'oldest' | 'name'

const PAGE_SIZE = 25
const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { dateStyle: 'medium' })

export function WaitlistPanel({ entries }: { entries: WaitlistEntryListItem[] }) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('newest')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    const matches = !term
      ? entries
      : entries.filter((entry) =>
          [entry.name, entry.place, entry.phone, entry.email ?? ''].some((field) =>
            field.toLowerCase().includes(term),
          ),
        )

    const sorted = [...matches]
    if (sort === 'newest') sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    else if (sort === 'oldest') sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    else sorted.sort((a, b) => a.name.localeCompare(b.name))
    return sorted
  }, [entries, search, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageEntries = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function updateSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function updateSort(value: SortOption) {
    setSort(value)
    setPage(1)
  }

  const inputClass = 'rounded-md border border-input bg-background px-3 py-2 text-sm'

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Waitlist</p>
        <h1 className="mt-2 font-heading text-4xl">Programme waitlist</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {entries.length.toLocaleString('en-US')} {entries.length === 1 ? 'person has' : 'people have'} joined so
          far. Contact details are only ever shown here, never on the public site.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => updateSearch(e.target.value)}
          placeholder="Search name, place, phone or email"
          className={`${inputClass} w-full max-w-sm`}
        />
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Sort by
            <select value={sort} onChange={(e) => updateSort(e.target.value as SortOption)} className={inputClass}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </label>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–
        {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length.toLocaleString('en-US')}
        {search && ` (filtered from ${entries.length.toLocaleString('en-US')})`}
      </p>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Place</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Evidence</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {pageEntries.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                  {entries.length === 0 ? 'No one has joined the waitlist yet.' : 'No entries match that search.'}
                </td>
              </tr>
            )}
            {pageEntries.map((entry) => (
              <tr key={entry.id} className="border-t border-border">
                <td className="px-4 py-3">{entry.name}</td>
                <td className="px-4 py-3">{entry.place}</td>
                <td className="px-4 py-3">
                  <a href={`tel:${entry.phone}`} className="text-accent hover:underline">
                    {entry.phone}
                  </a>
                </td>
                <td className="px-4 py-3">
                  {entry.email ? (
                    <a href={`mailto:${entry.email}`} className="text-accent hover:underline">
                      {entry.email}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {entry.photoUrl && (
                      <a href={entry.photoUrl} target="_blank" rel="noopener noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element -- remote ImageKit URL, not a local asset */}
                        <img src={entry.photoUrl} alt={`Photo submitted by ${entry.name}`} className="h-10 w-10 rounded-md object-cover" />
                      </a>
                    )}
                    {entry.audioUrl && (
                      <a href={entry.audioUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                        Voice note
                      </a>
                    )}
                    {!entry.photoUrl && !entry.audioUrl && <span className="text-muted-foreground">—</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(entry.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent disabled:pointer-events-none disabled:opacity-40"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              aria-current={n === currentPage ? 'page' : undefined}
              className={`h-9 w-9 rounded-full text-sm font-medium transition-colors ${
                n === currentPage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent disabled:pointer-events-none disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
