import fs from 'fs'
import path from 'path'
import {
  validateMetadata,
  validateReadme,
  validateOrgReadme,
  parseMetadataContent,
  getFormatFromFilename,
  METADATA_FILE_PRIORITY,
} from './validators.js'

function orgSlugToName(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

/**
 * Walk a proposals directory and return all valid proposals plus any errors.
 *
 * @param {string} proposalsDir - Absolute path to the proposals/ directory
 * @returns {{ proposals: object[], errors: string[] }}
 */
export function scan(proposalsDir) {
  const proposals = []
  const errors = []

  if (!fs.existsSync(proposalsDir)) {
    return { proposals, errors }
  }

  const years = fs.readdirSync(proposalsDir).filter(
    f => fs.statSync(path.join(proposalsDir, f)).isDirectory() && /^\d{4}$/.test(f)
  )

  for (const year of years) {
    const yearPath = path.join(proposalsDir, year)
    const orgs = fs.readdirSync(yearPath).filter(
      f => fs.statSync(path.join(yearPath, f)).isDirectory()
    )

    for (const org of orgs) {
      const orgPath = path.join(yearPath, org)

      // Validate org-level README.md if present
      const orgReadmePath = path.join(orgPath, 'README.md')
      if (fs.existsSync(orgReadmePath)) {
        try {
          const content = fs.readFileSync(orgReadmePath, 'utf-8')
          errors.push(...validateOrgReadme(content, `proposals/${year}/${org}/README.md`))
        } catch (e) {
          errors.push(`proposals/${year}/${org}/README.md: could not read — ${e.message}`)
        }
      }

      const projects = fs.readdirSync(orgPath).filter(
        f => fs.statSync(path.join(orgPath, f)).isDirectory()
      )

      for (const project of projects) {
        const projectPath = path.join(orgPath, project)

        // Find metadata file — first match in priority order wins
        let dataFile = null
        for (const filename of METADATA_FILE_PRIORITY) {
          if (fs.existsSync(path.join(projectPath, filename))) {
            dataFile = filename
            break
          }
        }

        if (!dataFile) {
          errors.push(
            `proposals/${year}/${org}/${project}: missing metadata file ` +
            `(expected proposal.json, proposal.yaml, metadata.json, or metadata.yaml)`
          )
          continue
        }

        // Validate project-level README.md if present
        const projectReadmePath = path.join(projectPath, 'README.md')
        if (fs.existsSync(projectReadmePath)) {
          try {
            const content = fs.readFileSync(projectReadmePath, 'utf-8')
            errors.push(...validateReadme(content, `proposals/${year}/${org}/${project}/README.md`))
          } catch (e) {
            errors.push(`proposals/${year}/${org}/${project}/README.md: could not read — ${e.message}`)
          }
        }

        // Parse metadata
        const dataPath = path.join(projectPath, dataFile)
        const format = getFormatFromFilename(dataFile)
        let metadata
        try {
          const raw = fs.readFileSync(dataPath, 'utf-8')
          metadata = parseMetadataContent(raw, format)
        } catch (e) {
          errors.push(`proposals/${year}/${org}/${project}/${dataFile}: ${e.message}`)
          continue
        }

        const metaErrors = validateMetadata(
          metadata,
          `proposals/${year}/${org}/${project}/${dataFile}`
        )
        errors.push(...metaErrors)

        if (metaErrors.length === 0) {
          const pdfUrl =
            metadata.pdf_url ||
            metadata.pdfUrl ||
            (fs.existsSync(path.join(projectPath, 'proposal.pdf'))
              ? `/proposals/${year}/${org}/${project}/proposal.pdf`
              : null)

          proposals.push({
            year: parseInt(year),
            yearSlug: year,
            orgSlug: org,
            projectSlug: project,
            project_title: metadata.project_title,
            organization: metadata.organization || orgSlugToName(org),
            contributor_name: metadata.contributor_name || metadata.name || null,
            short_description: metadata.short_description,
            difficulty: metadata.difficulty || null,
            tech_stack: metadata.tech_stack || [],
            gsoc_url: metadata.gsoc_url || null,
            pdf_url: pdfUrl,
            pdfUrl: pdfUrl,
            references: metadata.references || [],
          })
        }
      }
    }
  }

  return { proposals, errors }
}
