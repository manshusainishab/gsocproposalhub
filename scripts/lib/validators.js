import { load as yamlLoad } from 'js-yaml'

export const REQUIRED_FIELDS = ['project_title', 'short_description']

// Supports both legacy (Beginner/Intermediate/Advanced) and 2026 (Easy/Medium/Hard) formats
export const DIFFICULTY_VALUES = new Set([
  'Beginner', 'Intermediate', 'Advanced',
  'Easy', 'Medium', 'Hard',
])

// Checked in priority order — first match wins
export const METADATA_FILE_PRIORITY = [
  'proposal.json',
  'proposal.yaml',
  'proposal.yml',
  'metadata.json',
  'metadata.yaml',
  'metadata.yml',
]

/**
 * Validate a proposal metadata object.
 * Returns an array of error strings; empty array means valid.
 */
export function validateMetadata(metadata, filePath = '') {
  const errors = []
  const ref = filePath ? `${filePath}: ` : ''

  for (const field of REQUIRED_FIELDS) {
    if (!metadata[field] || typeof metadata[field] !== 'string' || !metadata[field].trim()) {
      errors.push(`${ref}"${field}" is required and must be a non-empty string`)
    }
  }

  if (metadata.tech_stack !== undefined && !Array.isArray(metadata.tech_stack)) {
    errors.push(`${ref}"tech_stack" must be an array`)
  }

  if (metadata.references !== undefined && !Array.isArray(metadata.references)) {
    errors.push(`${ref}"references" must be an array`)
  }

  if (metadata.difficulty !== undefined && !DIFFICULTY_VALUES.has(metadata.difficulty)) {
    errors.push(
      `${ref}"difficulty" must be one of: ${[...DIFFICULTY_VALUES].join(', ')} — got "${metadata.difficulty}"`
    )
  }

  if (metadata.year !== undefined && typeof metadata.year !== 'number') {
    errors.push(`${ref}"year" must be a number, not a string`)
  }

  return errors
}

/**
 * Validate a folder name follows naming conventions.
 * Returns an array of error strings; empty array means valid.
 */
export function validateFolderName(name) {
  if (!name) return ['folder name must not be empty']

  const errors = []
  if (/[A-Z]/.test(name)) errors.push(`"${name}": must be all lowercase (no uppercase letters)`)
  if (/ /.test(name)) errors.push(`"${name}": must not contain spaces (use hyphens instead)`)
  if (/[^a-z0-9-]/.test(name)) errors.push(`"${name}": may only contain lowercase letters, digits, and hyphens`)
  if (/^-|-$/.test(name)) errors.push(`"${name}": must not start or end with a hyphen`)

  return errors
}

/**
 * Validate a year string from a directory name.
 * Returns an array of error strings; empty array means valid.
 */
export function validateYear(yearStr) {
  if (!/^\d{4}$/.test(yearStr)) {
    return [`"${yearStr}": year directory must be a 4-digit number (e.g. 2024)`]
  }
  const y = parseInt(yearStr, 10)
  const errors = []
  if (y < 2005) errors.push(`"${yearStr}": GSoC started in 2005 — year must be 2005 or later`)
  if (y > new Date().getFullYear() + 1) errors.push(`"${yearStr}": year is too far in the future`)
  return errors
}

/**
 * Validate README.md content is not corrupted or empty.
 * Returns an array of error strings; empty array means valid.
 */
export function validateReadme(content, filePath = '') {
  const ref = filePath ? `${filePath}: ` : ''

  if (!content || content.trim() === '') {
    return [`${ref}README.md is empty`]
  }
  if (content.includes('\0')) {
    return [`${ref}README.md contains null bytes — file may be corrupted or binary`]
  }

  const errors = []
  if (content.trim().length < 20) {
    errors.push(`${ref}README.md content is too short (minimum 20 characters)`)
  }
  if (!/^#/m.test(content)) {
    errors.push(`${ref}README.md has no markdown headings (expected at least one "# Heading" line)`)
  }

  return errors
}

/**
 * Validate an org-level README.md, including submission-instruction checks.
 * Returns an array of error strings; empty array means valid.
 */
export function validateOrgReadme(content, filePath = '') {
  const errors = validateReadme(content, filePath)
  const ref = filePath ? `${filePath}: ` : ''

  const basicFailed = errors.some(e =>
    e.includes('empty') || e.includes('null bytes') || e.includes('too short')
  )

  if (!basicFailed) {
    if (!/how to (submit|contribute)/i.test(content)) {
      errors.push(`${ref}org README.md is missing a "How to Submit" or "How to Contribute" section`)
    }
    const mentionsMetadata =
      content.includes('proposal.json') ||
      content.includes('metadata.json') ||
      content.includes('proposal.yaml') ||
      content.includes('metadata.yaml')
    if (!mentionsMetadata) {
      errors.push(`${ref}org README.md must reference the metadata file format (proposal.json or proposal.yaml)`)
    }
  }

  return errors
}

/**
 * Parse metadata from a raw string given its format ('json' or 'yaml').
 * Returns the parsed object, or throws Error on failure.
 */
export function parseMetadataContent(content, format) {
  if (format === 'json') {
    try {
      return JSON.parse(content)
    } catch (e) {
      throw new Error(`Invalid JSON: ${e.message}`)
    }
  }

  if (format === 'yaml') {
    let result
    try {
      result = yamlLoad(content)
    } catch (e) {
      throw new Error(`Invalid YAML: ${e.message}`)
    }
    if (result === null || result === undefined) {
      throw new Error('YAML content parsed to null — file may be empty or only contain comments')
    }
    if (typeof result !== 'object' || Array.isArray(result)) {
      throw new Error(
        `YAML must be a mapping (key: value pairs), got ${Array.isArray(result) ? 'a list' : typeof result}`
      )
    }
    return result
  }

  throw new Error(`Unsupported format "${format}" — expected "json" or "yaml"`)
}

/**
 * Return the format ('json' or 'yaml') for a given filename, or null if unrecognised.
 */
export function getFormatFromFilename(filename) {
  const ext = filename.split('.').pop().toLowerCase()
  if (ext === 'json') return 'json'
  if (ext === 'yaml' || ext === 'yml') return 'yaml'
  return null
}
