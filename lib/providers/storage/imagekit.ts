// ImageKit provider. This is the only file that calls ImageKit. To switch
// storage providers, write a new file here and change lib/providers/storage/index.ts.
//
// Uses ImageKit's plain upload API (https://upload.imagekit.io/api/v1/files/upload)
// with the account's private key, rather than adding the ImageKit SDK as a
// dependency. See imagekit_documention.json at the project root for the API shape.
import type { StorageProvider, UploadedFile, UploadImageInput } from './types'

const UPLOAD_URL = 'https://upload.imagekit.io/api/v1/files/upload'

function env(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is not set. Add it to .env.local (see .env.example).`)
  return value
}

// IMAGEKIT_APP_FOLDER keeps this project's uploads in their own folder, separate
// from other projects that may share the same ImageKit account.
function scopedFolder(folder: string): string {
  const appFolder = process.env.IMAGEKIT_APP_FOLDER ?? 'water-system'
  return `/${appFolder}/${folder}`.replace(/\/{2,}/g, '/')
}

export function createImageKitStorage(): StorageProvider {
  return {
    async uploadImage({ data, fileName, folder }: UploadImageInput): Promise<UploadedFile> {
      const privateKey = env('IMAGEKIT_PRIVATE_KEY')
      env('IMAGEKIT_URL_ENDPOINT') // validated here; the URL itself comes back in the response

      const form = new FormData()
      // Buffer's ArrayBufferLike type isn't assignable to Blob's BlobPart, so copy
      // it into a plain Uint8Array first.
      form.append('file', new Blob([new Uint8Array(data)]), fileName)
      form.append('fileName', fileName)
      form.append('folder', scopedFolder(folder))
      form.append('useUniqueFileName', 'true')

      const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: {
          // ImageKit's upload API uses HTTP Basic auth with the private key as the
          // username and no password.
          Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString('base64')}`,
        },
        body: form,
      })

      if (!response.ok) {
        const body = await response.text().catch(() => '')
        throw new Error(`ImageKit upload failed (${response.status}): ${body.slice(0, 300)}`)
      }

      const result = (await response.json()) as { url: string; fileId: string }
      return { url: result.url, fileId: result.fileId }
    },
  }
}
