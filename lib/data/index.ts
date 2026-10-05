import { createDemoStore } from '@/lib/providers/database/demo'
import { createNeonStore } from '@/lib/providers/database/neon'
import type { DataStore } from './store'

// Chooses the data provider in one place. Without DATABASE_URL the app runs on
// simulated demo data, so it works before Neon is set up.
let store: DataStore | undefined

export function getDataStore(): DataStore {
  if (!store) {
    const url = process.env.DATABASE_URL
    store = url ? createNeonStore(url) : createDemoStore()
  }
  return store
}
