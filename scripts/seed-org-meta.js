import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const proposalsDir = join(__dirname, '..', 'proposals')

const sources = [
  { year: '2026', file: join(__dirname, '..', 'public', '2026-orgs.json') },
  { year: '2025', file: 'E:/proposalhub/2025-orgs.json' },
  { year: '2024', file: 'E:/proposalhub/2024-orgs.json' },
  { year: '2023', file: 'E:/proposalhub/2023-orgs.json' },
  { year: '2022', file: 'E:/proposalhub/2022-orgs.json' },
]

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-')
}

for (const { year, file } of sources) {
  const orgs = JSON.parse(readFileSync(file, 'utf8'))
  let written = 0

  for (const org of orgs) {
    const slug = slugify(org.name)
    const orgDir = join(proposalsDir, year, slug)
    const outPath = join(orgDir, 'org.json')

    if (!existsSync(orgDir)) continue
    writeFileSync(outPath, JSON.stringify({ name: org.name, desc: org.desc, img: org.img }, null, 2))
    written++
  }

  console.log(`${year}: wrote org.json for ${written} orgs`)
}
