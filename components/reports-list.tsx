'use client'

import { useState } from 'react'
import { ImageLightbox } from './image-lightbox'
import { MapView } from './map-view'
import { Modal } from './modal'
import { REPORT_CATEGORIES, type ReportCategory } from '@/lib/data/types'

// RiverReport.createdAt is a Date on the server; dates cross into a client
// component as plain strings, so this mirrors RiverReport with that one change.
export type ReportListItem = {
  id: number
  category: ReportCategory
  description: string
  locationDescription: string
  latitude: number
  longitude: number
  photoUrls: string[]
  reporterName: string | null
  status: 'open' | 'verified' | 'resolved'
  createdAt: string
}

const statusStyles: Record<string, string> = {
  open: 'bg-warning/15 text-warning',
  verified: 'bg-accent/15 text-accent',
  resolved: 'bg-success/15 text-success',
}

export function ReportsList({ reports }: { reports: ReportListItem[] }) {
  const [selected, setSelected] = useState<ReportListItem | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  function openReport(report: ReportListItem) {
    setSelected(report)
    setLightboxIndex(null)
  }

  return (
    <>
      <ul className="divide-y divide-border rounded-lg border border-border bg-card">
        {reports.map((report) => (
          <li key={report.id}>
            <button
              type="button"
              onClick={() => openReport(report)}
              className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/60"
            >
              <div className="flex items-center gap-3">
                {report.photoUrls.length > 0 && (
                  <div className="flex shrink-0 -space-x-3">
                    {report.photoUrls.slice(0, 3).map((url, index) => (
                      // eslint-disable-next-line @next/next/no-img-element -- remote ImageKit URL, not a local asset
                      <img
                        key={url}
                        src={url}
                        alt={`Photo ${index + 1} submitted with the ${REPORT_CATEGORIES[report.category].toLowerCase()} report`}
                        className="h-14 w-14 rounded-md border-2 border-card object-cover"
                      />
                    ))}
                    {report.photoUrls.length > 3 && (
                      <span className="flex h-14 w-14 items-center justify-center rounded-md border-2 border-card bg-muted text-xs font-medium text-muted-foreground">
                        +{report.photoUrls.length - 3}
                      </span>
                    )}
                  </div>
                )}
                <div>
                  <p className="font-medium">{REPORT_CATEGORIES[report.category]}</p>
                  <p className="text-sm text-muted-foreground">{report.locationDescription}</p>
                  {report.description && <p className="text-sm text-muted-foreground">{report.description}</p>}
                </div>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs capitalize ${statusStyles[report.status] ?? 'bg-muted'}`}>
                {report.status}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <Modal
          onClose={() => setSelected(null)}
          titleId="report-modal-title"
          disableEscape={lightboxIndex !== null}
        >
          <div className="flex items-start justify-between gap-4">
            <h3 id="report-modal-title" className="font-heading text-2xl">
              {REPORT_CATEGORIES[selected.category]}
            </h3>
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close"
              className="shrink-0 rounded-full p-1 text-xl leading-none text-muted-foreground transition-colors hover:text-foreground"
            >
              ×
            </button>
          </div>

          <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs capitalize ${statusStyles[selected.status] ?? 'bg-muted'}`}>
            {selected.status}
          </span>

          {selected.photoUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {selected.photoUrls.map((url, index) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  aria-label={`View photo ${index + 1} of ${selected.photoUrls.length} full size`}
                  className="aspect-square overflow-hidden rounded-md transition-opacity hover:opacity-80"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- remote ImageKit URL, not a local asset */}
                  <img
                    src={url}
                    alt={`Photo ${index + 1} submitted with this report`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-medium">Where</dt>
              <dd className="text-muted-foreground">{selected.locationDescription}</dd>
            </div>
            {selected.description && (
              <div>
                <dt className="font-medium">Description</dt>
                <dd className="text-muted-foreground">{selected.description}</dd>
              </div>
            )}
            <div>
              <dt className="font-medium">Reported by</dt>
              <dd className="text-muted-foreground">{selected.reporterName ?? 'Anonymous'}</dd>
            </div>
            <div>
              <dt className="font-medium">Submitted</dt>
              <dd className="text-muted-foreground">
                {new Date(selected.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
              </dd>
            </div>
            <div>
              <dt className="font-medium">Coordinates</dt>
              <dd className="text-muted-foreground">
                {selected.latitude.toFixed(5)}, {selected.longitude.toFixed(5)}
              </dd>
            </div>
          </dl>

          <div className="mt-4">
            <MapView
              heightClassName="h-56"
              zoom={16}
              center={[selected.latitude, selected.longitude]}
              markers={[
                {
                  id: selected.id,
                  latitude: selected.latitude,
                  longitude: selected.longitude,
                  title: REPORT_CATEGORIES[selected.category],
                },
              ]}
            />
          </div>
        </Modal>
      )}

      {selected && lightboxIndex !== null && (
        <ImageLightbox
          photos={selected.photoUrls}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}
