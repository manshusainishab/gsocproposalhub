import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const proposalsDir = join(__dirname, '..', 'proposals');

const sources = [
  { year: '2022', file: 'E:/proposalhub/2022-orgs.json' },
  { year: '2023', file: 'E:/proposalhub/2023-orgs.json' },
  { year: '2024', file: 'E:/proposalhub/2024-orgs.json' },
  { year: '2025', file: 'E:/proposalhub/2025-orgs.json' },
];

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function readme(org, year, slug) {
  return `# ${org.name}

${org.desc}

## How to contribute your proposal

1. Create a folder here named after your project (use lowercase, hyphens):
   \`\`\`
   proposals/${year}/${slug}/<your-project-slug>/
   \`\`\`

2. Inside that folder, create a \`proposal.json\` file:
   \`\`\`json
   {
     "project_title": "Your Project Title",
     "short_description": "A brief description of your project.",
     "difficulty": "Medium",
     "tech_stack": ["Python", "TensorFlow"],
     "name": "Your Name (optional)",
     "pdfUrl": "https://github.com/<you>/<repo>/blob/main/proposal.pdf"
   }
   \`\`\`

3. The \`pdfUrl\` should be a link to your PDF on GitHub.
   We automatically convert GitHub blob URLs to raw URLs for rendering.

4. Open a Pull Request — we'll review and merge it!
`;
}

for (const { year, file } of sources) {
  const orgs = JSON.parse(readFileSync(file, 'utf8'));
  const yearDir = join(proposalsDir, year);
  mkdirSync(yearDir, { recursive: true });

  let created = 0, skipped = 0;

  for (const org of orgs) {
    const slug = slugify(org.name);
    const orgDir = join(yearDir, slug);

    if (existsSync(orgDir)) {
      skipped++;
      continue;
    }

    mkdirSync(orgDir, { recursive: true });
    writeFileSync(join(orgDir, 'README.md'), readme(org, year, slug));
    created++;
  }

  console.log(`${year}: ${created} created, ${skipped} skipped`);
}
