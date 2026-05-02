import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { scan } from './lib/scan.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')
const PROPOSALS_DIR = path.join(ROOT, 'proposals')
const PUBLIC_DIR = path.join(ROOT, 'public')
const OUTPUT_INDEX = path.join(PUBLIC_DIR, 'proposals-index.json')
const OUTPUT_PROPOSALS = path.join(PUBLIC_DIR, 'proposals')

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

function main() {
  console.log('🔍 Scanning proposals...')
  const { proposals, errors } = scan(PROPOSALS_DIR)

  if (errors.length > 0) {
    console.log('\n⚠️  Validation warnings:')
    errors.forEach(e => console.log(`   • ${e}`))
    console.log('')
  }

  proposals.sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year
    if (a.organization < b.organization) return -1
    if (a.organization > b.organization) return 1
    return a.project_title.localeCompare(b.project_title)
  })

  fs.mkdirSync(PUBLIC_DIR, { recursive: true })
  fs.writeFileSync(OUTPUT_INDEX, JSON.stringify(proposals, null, 2))
  console.log(`✅ Generated proposals-index.json with ${proposals.length} proposals`)

  if (fs.existsSync(PROPOSALS_DIR)) {
    if (fs.existsSync(OUTPUT_PROPOSALS)) {
      fs.rmSync(OUTPUT_PROPOSALS, { recursive: true })
    }
    copyDir(PROPOSALS_DIR, OUTPUT_PROPOSALS)
    console.log('✅ Copied proposals to public/proposals/')
  }

  console.log('🎉 Build index complete!\n')
}

main()
