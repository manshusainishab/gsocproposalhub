#!/usr/bin/env node
/**
 * create-2026-org-folders.js
 *
 * Reads orgs-1.json and orgs-2.json from the repo root,
 * then creates the folder structure:
 *
 *   proposals/2026/<org-slug>/
 *
 * Each org folder gets a README.md explaining how contributors
 * submit their accepted proposal.
 *
 * Usage:
 *   node scripts/create-2026-org-folders.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const REPO_ROOT = path.resolve(ROOT, '..')

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function loadJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf-8')) }
  catch { console.warn(`⚠️  Could not read ${file}`); return [] }
}

const orgsDataPath = path.join(ROOT, 'public', '2026-orgs.json')

console.log(`📂 Reading: ${orgsDataPath}`)

const allOrgs = loadJson(orgsDataPath)
const baseDir = path.join(ROOT, 'proposals', '2026')
fs.mkdirSync(baseDir, { recursive: true })

let created = 0, skipped = 0

for (const org of allOrgs) {
  const slug = slugify(org.name)
  const dir = path.join(baseDir, slug)

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })

    const readme = `# ${org.name}

> ${org.desc || ''}

## ✅ How to Submit Your Accepted Proposal

If you got accepted to GSoC 2026 with **${org.name}**, here's how to add your proposal to this archive.

### Step 1 — Create your project folder

Create a folder inside \`proposals/2026/${slug}/\` named after your project:

\`\`\`
proposals/2026/${slug}/<your-project-slug>/
\`\`\`

Use lowercase letters and hyphens only. Example: \`my-awesome-project\`

---

### Step 2 — Create \`proposal.json\`

Inside your project folder, create a file called \`proposal.json\` with the following structure:

\`\`\`json
{
  "project_title": "Your Exact GSoC Project Title",
  "contributor_name": "Your Name",
  "organization": "${org.name}",
  "short_description": "1-2 sentence description of your project.",
  "difficulty": "Medium",
  "tech_stack": ["Python", "TensorFlow", "React"],
  "gsoc_url": "https://summerofcode.withgoogle.com/programs/2026/projects/YOUR_PROJECT_ID",
  "pdf_url": "https://github.com/YOUR_USERNAME/YOUR_REPO/blob/main/proposal.pdf",
  "references": [
    { "title": "Implementation PR", "url": "https://github.com/org/repo/pull/1" },
    { "title": "My blog post", "url": "https://yourblog.com/post" },
    { "title": "Final report", "url": "https://..." }
  ]
}
\`\`\`

### Field reference

| Field | Required | Description |
|-------|----------|-------------|
| \`project_title\` | ✅ | Exact title from GSoC dashboard |
| \`contributor_name\` | ✅ | Your full name |
| \`organization\` | ✅ | Must be \`"${org.name}"\` |
| \`short_description\` | ✅ | 1-2 sentence project summary |
| \`difficulty\` | ➕ | \`Easy\` / \`Medium\` / \`Hard\` |
| \`tech_stack\` | ➕ | Array of technologies used |
| \`gsoc_url\` | ➕ | Link to your GSoC project page |
| \`pdf_url\` | ✅ | GitHub link to your proposal PDF |
| \`references\` | ➕ | Array of \`{ title, url }\` objects |

---

### Step 3 — Upload your proposal PDF

Upload your proposal as a PDF to **your own GitHub repository** and paste the link in \`pdf_url\`.

The site automatically converts GitHub blob URLs to raw URLs for client-side rendering:
\`\`\`
https://github.com/you/repo/blob/main/proposal.pdf   ← paste this as pdf_url
\`\`\`

---

### Step 4 — Open a Pull Request

Submit a PR to the main repo. We'll review and merge it!

> 📺 Watch the [video tutorial](https://gsocproposalhub.dev/how-to-add) for a full walkthrough.
`
    fs.writeFileSync(path.join(dir, 'README.md'), readme)
    created++
  } else {
    skipped++
  }
}

console.log(`\n✅ Created ${created} org folders for 2026`)
if (skipped > 0) console.log(`   (${skipped} already existed, skipped)`)
console.log(`📁 Location: proposals/2026/\n`)
