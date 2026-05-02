import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { scan } from '../lib/scan.js'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeProposal(base, year, org, project, files = {}) {
  const dir = path.join(base, year, org, project)
  fs.mkdirSync(dir, { recursive: true })
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), content, 'utf-8')
  }
  return dir
}

function makeOrgReadme(base, year, org, content) {
  const dir = path.join(base, year, org)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'README.md'), content, 'utf-8')
}

const VALID_JSON = JSON.stringify({
  project_title: 'My GSoC Project',
  short_description: 'A project that does useful things.',
  organization: 'Test Org',
  difficulty: 'Medium',
  tech_stack: ['Python', 'Django'],
})

const VALID_YAML = `
project_title: My YAML Project
short_description: A project described in YAML.
organization: Test Org
difficulty: Easy
tech_stack:
  - Go
  - gRPC
`.trim()

const VALID_ORG_README = `# Test Org

## How to Contribute Your Proposal

Create a \`proposal.json\` file in your project folder.
`

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('scan — empty / missing directory', () => {
  it('returns empty results when proposals dir does not exist', () => {
    const { proposals, errors } = scan('/nonexistent/path/that/does/not/exist')
    expect(proposals).toEqual([])
    expect(errors).toEqual([])
  })

  it('returns empty results for an empty proposals directory', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gsoc-test-'))
    try {
      const { proposals, errors } = scan(tmpDir)
      expect(proposals).toEqual([])
      expect(errors).toEqual([])
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    }
  })
})

describe('scan — valid proposals', () => {
  let tmpDir

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gsoc-test-'))
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  it('indexes a valid proposal.json', () => {
    makeProposal(tmpDir, '2024', 'mozilla', 'my-project', { 'proposal.json': VALID_JSON })
    const { proposals, errors } = scan(tmpDir)
    expect(errors).toEqual([])
    expect(proposals).toHaveLength(1)
    expect(proposals[0].project_title).toBe('My GSoC Project')
    expect(proposals[0].orgSlug).toBe('mozilla')
    expect(proposals[0].year).toBe(2024)
  })

  it('indexes a valid proposal.yaml', () => {
    makeProposal(tmpDir, '2024', 'mozilla', 'yaml-project', { 'proposal.yaml': VALID_YAML })
    const { proposals, errors } = scan(tmpDir)
    expect(errors).toEqual([])
    expect(proposals).toHaveLength(1)
    expect(proposals[0].project_title).toBe('My YAML Project')
    expect(proposals[0].tech_stack).toEqual(['Go', 'gRPC'])
  })

  it('indexes a valid metadata.json (legacy format)', () => {
    const legacy = JSON.stringify({
      project_title: 'Legacy Project',
      short_description: 'Uses the old metadata.json format.',
      organization: 'Apache',
      name: 'Contributor Name',
    })
    makeProposal(tmpDir, '2023', 'apache', 'legacy-proj', { 'metadata.json': legacy })
    const { proposals, errors } = scan(tmpDir)
    expect(errors).toEqual([])
    expect(proposals[0].project_title).toBe('Legacy Project')
    expect(proposals[0].contributor_name).toBe('Contributor Name')
  })

  it('prefers proposal.json over proposal.yaml when both exist', () => {
    makeProposal(tmpDir, '2024', 'org', 'proj', {
      'proposal.json': VALID_JSON,
      'proposal.yaml': VALID_YAML,
    })
    const { proposals } = scan(tmpDir)
    expect(proposals[0].project_title).toBe('My GSoC Project')
  })

  it('resolves pdf_url from metadata field', () => {
    const withPdf = JSON.stringify({
      project_title: 'PDF Project',
      short_description: 'Has a remote PDF.',
      pdf_url: 'https://github.com/user/repo/blob/main/proposal.pdf',
    })
    makeProposal(tmpDir, '2024', 'org', 'proj', { 'proposal.json': withPdf })
    const { proposals } = scan(tmpDir)
    expect(proposals[0].pdf_url).toBe('https://github.com/user/repo/blob/main/proposal.pdf')
  })

  it('resolves pdf_url from a local proposal.pdf file', () => {
    makeProposal(tmpDir, '2024', 'org', 'proj', {
      'proposal.json': VALID_JSON,
      'proposal.pdf': '%PDF-1.4 fake pdf content',
    })
    const { proposals } = scan(tmpDir)
    expect(proposals[0].pdf_url).toBe('/proposals/2024/org/proj/proposal.pdf')
  })

  it('sets pdf_url to null when no PDF is available', () => {
    makeProposal(tmpDir, '2024', 'org', 'proj', { 'proposal.json': VALID_JSON })
    const { proposals } = scan(tmpDir)
    expect(proposals[0].pdf_url).toBeNull()
  })

  it('falls back to org slug as org name when organization field is absent', () => {
    const minimal = JSON.stringify({
      project_title: 'Minimal',
      short_description: 'No org field.',
    })
    makeProposal(tmpDir, '2024', 'apache-software-foundation', 'proj', { 'proposal.json': minimal })
    const { proposals } = scan(tmpDir)
    expect(proposals[0].organization).toBe('Apache Software Foundation')
  })

  it('handles multiple proposals across different orgs and years', () => {
    makeProposal(tmpDir, '2024', 'mozilla', 'proj-a', { 'proposal.json': VALID_JSON })
    makeProposal(tmpDir, '2023', 'apache', 'proj-b', {
      'proposal.json': JSON.stringify({
        project_title: 'Apache Project',
        short_description: 'An Apache proposal.',
      }),
    })
    const { proposals, errors } = scan(tmpDir)
    expect(errors).toEqual([])
    expect(proposals).toHaveLength(2)
  })
})

describe('scan — error cases', () => {
  let tmpDir

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gsoc-test-'))
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  it('reports an error for a project with no metadata file', () => {
    makeProposal(tmpDir, '2024', 'org', 'proj', { 'proposal.pdf': '%PDF-1.4' })
    const { proposals, errors } = scan(tmpDir)
    expect(proposals).toHaveLength(0)
    expect(errors.some(e => e.includes('missing metadata file'))).toBe(true)
  })

  it('reports an error for invalid JSON syntax', () => {
    makeProposal(tmpDir, '2024', 'org', 'proj', { 'proposal.json': '{broken: json' })
    const { errors } = scan(tmpDir)
    expect(errors.some(e => e.includes('Invalid JSON'))).toBe(true)
  })

  it('reports an error for invalid YAML syntax', () => {
    makeProposal(tmpDir, '2024', 'org', 'proj', { 'proposal.yaml': 'key: [unclosed bracket' })
    const { errors } = scan(tmpDir)
    expect(errors.some(e => e.includes('Invalid YAML'))).toBe(true)
  })

  it('reports an error for missing required field (project_title)', () => {
    const bad = JSON.stringify({ short_description: 'desc' })
    makeProposal(tmpDir, '2024', 'org', 'proj', { 'proposal.json': bad })
    const { errors } = scan(tmpDir)
    expect(errors.some(e => e.includes('project_title'))).toBe(true)
  })

  it('reports an error for an invalid difficulty value', () => {
    const bad = JSON.stringify({
      project_title: 'T',
      short_description: 'D',
      difficulty: 'expert',
    })
    makeProposal(tmpDir, '2024', 'org', 'proj', { 'proposal.json': bad })
    const { errors } = scan(tmpDir)
    expect(errors.some(e => e.includes('difficulty'))).toBe(true)
  })

  it('does not include a proposal with schema errors in the output', () => {
    makeProposal(tmpDir, '2024', 'org', 'proj', {
      'proposal.json': JSON.stringify({ short_description: 'no title' }),
    })
    const { proposals } = scan(tmpDir)
    expect(proposals).toHaveLength(0)
  })
})

describe('scan — README validation', () => {
  let tmpDir

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gsoc-test-'))
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  it('passes with a valid org README', () => {
    makeOrgReadme(tmpDir, '2026', 'test-org', VALID_ORG_README)
    makeProposal(tmpDir, '2026', 'test-org', 'proj', { 'proposal.json': VALID_JSON })
    const { errors } = scan(tmpDir)
    expect(errors).toEqual([])
  })

  it('reports an error for an empty org README', () => {
    makeOrgReadme(tmpDir, '2026', 'test-org', '')
    makeProposal(tmpDir, '2026', 'test-org', 'proj', { 'proposal.json': VALID_JSON })
    const { errors } = scan(tmpDir)
    expect(errors.some(e => e.includes('README.md') && e.includes('empty'))).toBe(true)
  })

  it('reports an error for a binary/corrupted org README', () => {
    makeOrgReadme(tmpDir, '2026', 'test-org', '# Org\n\nHello\0world')
    makeProposal(tmpDir, '2026', 'test-org', 'proj', { 'proposal.json': VALID_JSON })
    const { errors } = scan(tmpDir)
    expect(errors.some(e => e.includes('null bytes'))).toBe(true)
  })

  it('reports an error for an org README missing submission instructions', () => {
    const noInstructions = '# My Org\n\nThis org participates in GSoC.\n'
    makeOrgReadme(tmpDir, '2026', 'test-org', noInstructions)
    makeProposal(tmpDir, '2026', 'test-org', 'proj', { 'proposal.json': VALID_JSON })
    const { errors } = scan(tmpDir)
    expect(errors.some(e => /how to (submit|contribute)/i.test(e))).toBe(true)
  })

  it('validates a project-level README.md if present', () => {
    makeProposal(tmpDir, '2024', 'org', 'proj', {
      'proposal.json': VALID_JSON,
      'README.md': '',
    })
    const { errors } = scan(tmpDir)
    expect(errors.some(e => e.includes('README.md') && e.includes('empty'))).toBe(true)
  })

  it('accepts a valid project-level README.md', () => {
    makeProposal(tmpDir, '2024', 'org', 'proj', {
      'proposal.json': VALID_JSON,
      'README.md': '# My Proposal\n\nThis proposal aims to implement a feature in the org.\n',
    })
    const { errors } = scan(tmpDir)
    expect(errors).toEqual([])
  })
})
