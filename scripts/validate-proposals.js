#!/usr/bin/env node
/**
 * Strict proposal validator — exits with code 1 if any validation errors are found.
 * Run manually:   node scripts/validate-proposals.js
 * Run via npm:    npm run validate
 * Used in CI to block invalid contributions before merge.
 */
import path from 'path'
import { fileURLToPath } from 'url'
import { scan } from './lib/scan.js'
import {
  validateFolderName,
  validateYear,
  METADATA_FILE_PRIORITY,
} from './lib/validators.js'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')
const DEFAULT_PROPOSALS_DIR = path.join(ROOT, 'proposals')

/**
 * Run full structural + schema validation on a proposals directory.
 * Exported so tests can call it with a temp directory.
 *
 * @param {string} [proposalsDir]
 * @returns {{ errors: string[], warnings: string[] }}
 */
export function validateAll(proposalsDir = DEFAULT_PROPOSALS_DIR) {
  const errors = []
  const warnings = []

  if (!fs.existsSync(proposalsDir)) {
    warnings.push('No proposals directory found — nothing to validate')
    return { errors, warnings }
  }

  // --- Structural checks (folder names, year dirs) ---
  const yearEntries = fs.readdirSync(proposalsDir).filter(
    f => fs.statSync(path.join(proposalsDir, f)).isDirectory()
  )

  for (const year of yearEntries) {
    const yearErrors = validateYear(year)
    if (yearErrors.length > 0) {
      warnings.push(...yearErrors.map(e => `proposals/${year}: ${e}`))
      continue
    }

    const yearPath = path.join(proposalsDir, year)
    const orgEntries = fs.readdirSync(yearPath).filter(
      f => fs.statSync(path.join(yearPath, f)).isDirectory()
    )

    for (const org of orgEntries) {
      errors.push(...validateFolderName(org).map(e => `proposals/${year}/${org}: ${e}`))

      const orgPath = path.join(yearPath, org)
      const projectEntries = fs.readdirSync(orgPath).filter(
        f => fs.statSync(path.join(orgPath, f)).isDirectory()
      )

      for (const project of projectEntries) {
        errors.push(
          ...validateFolderName(project).map(e => `proposals/${year}/${org}/${project}: ${e}`)
        )
      }
    }
  }

  // --- Schema + content checks (delegates to scan) ---
  const { errors: scanErrors } = scan(proposalsDir)
  errors.push(...scanErrors)

  return { errors, warnings }
}

function main() {
  console.log('🔍 Validating proposals...\n')
  const { errors, warnings } = validateAll()

  if (warnings.length > 0) {
    console.log('⚠️  Warnings:')
    warnings.forEach(w => console.log(`   • ${w}`))
    console.log('')
  }

  if (errors.length === 0) {
    console.log('✅ All proposals are valid!\n')
    process.exit(0)
  } else {
    console.error(`❌ Found ${errors.length} error${errors.length === 1 ? '' : 's'}:\n`)
    errors.forEach(e => console.error(`   • ${e}`))
    console.error('')
    process.exit(1)
  }
}

main()
