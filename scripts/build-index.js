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

const VALID_DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

function validateMetadata(metadata, filePath) {
  const errors = [];

  if (typeof metadata.year !== 'number') {
    errors.push(`${filePath}: "year" must be a number`);
  }
  if (!metadata.organization || typeof metadata.organization !== 'string') {
    errors.push(`${filePath}: "organization" is required and must be a string`);
  }
  if (!metadata.project_title || typeof metadata.project_title !== 'string') {
    errors.push(`${filePath}: "project_title" is required and must be a string`);
  }
  if (!VALID_DIFFICULTIES.includes(metadata.difficulty)) {
    errors.push(`${filePath}: "difficulty" must be one of: ${VALID_DIFFICULTIES.join(', ')}`);
  }
  if (!Array.isArray(metadata.tech_stack)) {
    errors.push(`${filePath}: "tech_stack" must be an array`);
  }
  if (!metadata.short_description || typeof metadata.short_description !== 'string') {
    errors.push(`${filePath}: "short_description" is required and must be a string`);
  }

  // Check for disallowed extra fields
  const allowedFields = ['name', 'year', 'organization', 'project_title', 'difficulty', 'tech_stack', 'short_description'];
  const extraFields = Object.keys(metadata).filter(k => !allowedFields.includes(k));
  if (extraFields.length > 0) {
    errors.push(`${filePath}: unexpected fields found: ${extraFields.join(', ')}`);
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

  // Walk: /proposals/{year}/{org-slug}/{project-slug}/
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
        const metadataPath = path.join(projectPath, 'metadata.json');
        const pdfPath = path.join(projectPath, 'proposal.pdf');

        // Check files exist
        if (!fs.existsSync(metadataPath)) {
          allErrors.push(`${projectPath}: missing metadata.json`);
          continue;
        }
        if (!fs.existsSync(pdfPath)) {
          allErrors.push(`${projectPath}: missing proposal.pdf`);
        }

        // Parse and validate metadata
        let metadata;
        try {
          const raw = fs.readFileSync(metadataPath, 'utf-8');
          metadata = JSON.parse(raw);
        } catch (e) {
          allErrors.push(`${metadataPath}: invalid JSON — ${e.message}`);
          continue;
        }

        const validationErrors = validateMetadata(metadata, metadataPath);
        allErrors.push(...validationErrors);

        if (validationErrors.length === 0) {
          proposals.push({
            ...metadata,
            yearSlug: year,
            orgSlug: org,
            projectSlug: project,
            pdfUrl: `/proposals/${year}/${org}/${project}/proposal.pdf`,
          });
        }
      }
    }
  }

  return { proposals, errors: allErrors };
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
    console.log('\n❌ Validation errors:');
    errors.forEach(e => console.log(`   • ${e}`));
    console.log('');
  }

  // Sort by year descending, then by org, then by project
  proposals.sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    if (a.organization < b.organization) return -1;
    if (a.organization > b.organization) return 1;
    return a.project_title.localeCompare(b.project_title);
  });

  // Write index
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_INDEX, JSON.stringify(proposals, null, 2));
  console.log(`✅ Generated proposals-index.json with ${proposals.length} proposals`);

  // Copy proposals to public for static serving
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
