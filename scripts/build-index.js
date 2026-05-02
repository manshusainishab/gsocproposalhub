import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PROPOSALS_DIR = path.join(ROOT, 'proposals');
const PUBLIC_DIR = path.join(ROOT, 'public');
const OUTPUT_INDEX = path.join(PUBLIC_DIR, 'proposals-index.json');
const OUTPUT_PROPOSALS = path.join(PUBLIC_DIR, 'proposals');

// Required fields
const REQUIRED_FIELDS = ['project_title', 'short_description'];

function validateMetadata(metadata, filePath) {
  const errors = [];
  for (const f of REQUIRED_FIELDS) {
    if (!metadata[f] || typeof metadata[f] !== 'string') {
      errors.push(`${filePath}: "${f}" is required and must be a string`);
    }
  }
  if (metadata.tech_stack && !Array.isArray(metadata.tech_stack)) {
    errors.push(`${filePath}: "tech_stack" must be an array`);
  }
  if (metadata.references && !Array.isArray(metadata.references)) {
    errors.push(`${filePath}: "references" must be an array`);
  }
  return errors;
}

function walkProposals() {
  const proposals = [];
  const allErrors = [];

  if (!fs.existsSync(PROPOSALS_DIR)) {
    console.log('⚠️  No /proposals directory found. Creating empty index.');
    return { proposals, errors: allErrors };
  }

  // Walk: proposals/{year}/{org-slug}/{project-slug}/proposal.json
  const years = fs.readdirSync(PROPOSALS_DIR).filter(f =>
    fs.statSync(path.join(PROPOSALS_DIR, f)).isDirectory() && /^\d{4}$/.test(f)
  );

  for (const year of years) {
    const yearPath = path.join(PROPOSALS_DIR, year);
    const orgs = fs.readdirSync(yearPath).filter(f =>
      fs.statSync(path.join(yearPath, f)).isDirectory()
    );

    for (const org of orgs) {
      const orgPath = path.join(yearPath, org);
      const projects = fs.readdirSync(orgPath).filter(f =>
        fs.statSync(path.join(orgPath, f)).isDirectory()
      );

      for (const project of projects) {
        const projectPath = path.join(orgPath, project);

        // Support both proposal.json and metadata.json
        const proposalJsonPath = path.join(projectPath, 'proposal.json');
        const metadataJsonPath = path.join(projectPath, 'metadata.json');
        const dataPath = fs.existsSync(proposalJsonPath)
          ? proposalJsonPath
          : fs.existsSync(metadataJsonPath)
            ? metadataJsonPath
            : null;

        if (!dataPath) {
          allErrors.push(`${projectPath}: missing proposal.json`);
          continue;
        }

        let metadata;
        try {
          metadata = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        } catch (e) {
          allErrors.push(`${dataPath}: invalid JSON — ${e.message}`);
          continue;
        }

        const validationErrors = validateMetadata(metadata, dataPath);
        allErrors.push(...validationErrors);

        if (validationErrors.length === 0) {
          // Resolve PDF url: prefer pdf_url field, then pdfUrl, then look for proposal.pdf
          const pdfUrl =
            metadata.pdf_url ||
            metadata.pdfUrl ||
            (fs.existsSync(path.join(projectPath, 'proposal.pdf'))
              ? `/proposals/${year}/${org}/${project}/proposal.pdf`
              : null);

          proposals.push({
            year: parseInt(year),
            yearSlug: year,
            orgSlug: org,
            projectSlug: project,
            // Core fields
            project_title: metadata.project_title,
            organization: metadata.organization || orgSlugToName(org),
            contributor_name: metadata.contributor_name || metadata.name || null,
            short_description: metadata.short_description,
            difficulty: metadata.difficulty || null,
            tech_stack: metadata.tech_stack || [],
            // New fields
            gsoc_url: metadata.gsoc_url || null,
            pdf_url: pdfUrl,
            pdfUrl: pdfUrl, // keep backwards compat
            references: metadata.references || [],
          });
        }
      }
    }
  }

  return { proposals, errors: allErrors };
}

/** Convert an org slug back to a display name (fallback) */
function orgSlugToName(slug) {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function main() {
  console.log('🔍 Scanning proposals...');
  const { proposals, errors } = walkProposals();

  if (errors.length > 0) {
    console.log('\n⚠️  Validation warnings:');
    errors.forEach(e => console.log(`   • ${e}`));
    console.log('');
  }

  proposals.sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    if (a.organization < b.organization) return -1;
    if (a.organization > b.organization) return 1;
    return a.project_title.localeCompare(b.project_title);
  });

  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_INDEX, JSON.stringify(proposals, null, 2));
  console.log(`✅ Generated proposals-index.json with ${proposals.length} proposals`);

  if (fs.existsSync(PROPOSALS_DIR)) {
    if (fs.existsSync(OUTPUT_PROPOSALS)) {
      fs.rmSync(OUTPUT_PROPOSALS, { recursive: true });
    }
    copyDir(PROPOSALS_DIR, OUTPUT_PROPOSALS);
    console.log('✅ Copied proposals to public/proposals/');
  }

  console.log('🎉 Build index complete!\n');
}

main();
