import { createImageKitStorage } from './imagekit'
import type { StorageProvider } from './types'

export type { StorageProvider, UploadedFile, UploadFileInput } from './types'

let provider: StorageProvider | undefined

export function getStorageProvider(): StorageProvider {
  if (!provider) provider = createImageKitStorage()
  return provider
}

export function isStorageConfigured(): boolean {
  return Boolean(process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT)
}
