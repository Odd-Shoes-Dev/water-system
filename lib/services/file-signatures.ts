// Confirms a file's actual bytes match its declared type, instead of trusting
// the browser-reported MIME type alone (which is easy to spoof by renaming a
// file). This is a second check alongside the type allow-list in the upload
// route, not a replacement for it.

function startsWith(bytes: Uint8Array, signature: number[], offset = 0): boolean {
  if (bytes.length < offset + signature.length) return false
  return signature.every((byte, i) => bytes[offset + i] === byte)
}

function asciiAt(bytes: Uint8Array, text: string, offset: number): boolean {
  if (bytes.length < offset + text.length) return false
  for (let i = 0; i < text.length; i++) {
    if (bytes[offset + i] !== text.charCodeAt(i)) return false
  }
  return true
}

const SIGNATURE_CHECKS: Record<string, (bytes: Uint8Array) => boolean> = {
  'image/jpeg': (b) => startsWith(b, [0xff, 0xd8, 0xff]),
  'image/png': (b) => startsWith(b, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  'image/gif': (b) => asciiAt(b, 'GIF87a', 0) || asciiAt(b, 'GIF89a', 0),
  'image/webp': (b) => asciiAt(b, 'RIFF', 0) && asciiAt(b, 'WEBP', 8),
  'audio/mpeg': (b) => startsWith(b, [0x49, 0x44, 0x33]) || (b.length > 1 && b[0] === 0xff && (b[1] & 0xe0) === 0xe0),
  'audio/wav': (b) => asciiAt(b, 'RIFF', 0) && asciiAt(b, 'WAVE', 8),
  'audio/ogg': (b) => asciiAt(b, 'OggS', 0),
  'audio/webm': (b) => startsWith(b, [0x1a, 0x45, 0xdf, 0xa3]),
  'audio/mp4': (b) => asciiAt(b, 'ftyp', 4),
  'audio/x-m4a': (b) => asciiAt(b, 'ftyp', 4),
  'audio/aac': (b) => startsWith(b, [0xff, 0xf1]) || startsWith(b, [0xff, 0xf9]),
}

export function matchesDeclaredType(bytes: Uint8Array, mimeType: string): boolean {
  const check = SIGNATURE_CHECKS[mimeType]
  // No rule for this type: fall back to the allow-list already enforced by
  // the caller, rather than blocking something we don't know how to check.
  return check ? check(bytes) : true
}
