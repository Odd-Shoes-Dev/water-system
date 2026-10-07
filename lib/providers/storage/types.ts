// Shape every storage provider implements. Only files under lib/providers/storage
// talk to a vendor SDK or API; the rest of the app calls getStorageProvider().
export type UploadedFile = {
  url: string
  fileId: string
}

export type UploadFileInput = {
  data: Buffer
  fileName: string
  // Subfolder under this project's own storage folder, e.g. "river-reports".
  folder: string
}

export interface StorageProvider {
  uploadFile(input: UploadFileInput): Promise<UploadedFile>
}
