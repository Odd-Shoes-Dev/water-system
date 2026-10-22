import { randomBytes } from 'node:crypto'

// Turns a name into a lowercase, hyphenated id fragment, e.g. "Kakyeka Primary" -> "kakyeka-primary".
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

// Builds a human-readable, almost-certainly-unique id for a new tank or
// greywater unit (both use a text primary key, not an auto-increment). A
// short random suffix avoids needing a select-then-insert uniqueness check.
export function slugId(prefix: string, name: string): string {
  const slug = slugify(name) || 'unnamed'
  return `${prefix}-${slug}-${randomBytes(3).toString('hex')}`
}
