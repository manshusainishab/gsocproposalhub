import { describe, it, expect } from 'vitest'
import {
  validateMetadata,
  validateFolderName,
  validateYear,
  validateReadme,
  validateOrgReadme,
  parseMetadataContent,
  getFormatFromFilename,
  DIFFICULTY_VALUES,
  METADATA_FILE_PRIORITY,
} from '../lib/validators.js'

// ---------------------------------------------------------------------------
// validateMetadata
// ---------------------------------------------------------------------------
describe('validateMetadata', () => {
  const valid = {
    project_title: 'My GSoC Project',
    short_description: 'A meaningful project description.',
  }

  it('accepts valid minimal metadata', () => {
    expect(validateMetadata(valid)).toEqual([])
  })

  it('accepts valid full metadata', () => {
    const full = {
      ...valid,
      contributor_name: 'Jane Doe',
      organization: 'Mozilla',
      difficulty: 'Medium',
      tech_stack: ['Rust', 'JavaScript'],
      year: 2024,
      gsoc_url: 'https://summerofcode.withgoogle.com/programs/2024/projects/x',
      pdf_url: 'https://github.com/user/repo/blob/main/proposal.pdf',
      references: [{ title: 'PR', url: 'https://github.com/org/repo/pull/1' }],
    }
    expect(validateMetadata(full)).toEqual([])
  })

  it('rejects missing project_title', () => {
    const errors = validateMetadata({ short_description: 'desc' })
    expect(errors).toHaveLength(1)
    expect(errors[0]).toMatch(/project_title/)
  })

  it('rejects missing short_description', () => {
    const errors = validateMetadata({ project_title: 'Title' })
    expect(errors).toHaveLength(1)
    expect(errors[0]).toMatch(/short_description/)
  })

  it('rejects empty string project_title', () => {
    const errors = validateMetadata({ project_title: '', short_description: 'desc' })
    expect(errors[0]).toMatch(/project_title/)
  })

  it('rejects whitespace-only project_title', () => {
    const errors = validateMetadata({ project_title: '   ', short_description: 'desc' })
    expect(errors[0]).toMatch(/project_title/)
  })

  it('rejects tech_stack as a string', () => {
    const errors = validateMetadata({ ...valid, tech_stack: 'Python, Django' })
    expect(errors[0]).toMatch(/tech_stack.*array/)
  })

  it('accepts tech_stack as an array', () => {
    expect(validateMetadata({ ...valid, tech_stack: ['Python', 'Django'] })).toEqual([])
  })

  it('rejects references as an object', () => {
    const errors = validateMetadata({ ...valid, references: { title: 'x', url: 'y' } })
    expect(errors[0]).toMatch(/references.*array/)
  })

  it('accepts references as an array', () => {
    expect(validateMetadata({ ...valid, references: [] })).toEqual([])
  })

  it('rejects an invalid difficulty value', () => {
    const errors = validateMetadata({ ...valid, difficulty: 'expert' })
    expect(errors[0]).toMatch(/difficulty/)
    expect(errors[0]).toMatch(/"expert"/)
  })

  it.each([...DIFFICULTY_VALUES])('accepts difficulty "%s"', (d) => {
    expect(validateMetadata({ ...valid, difficulty: d })).toEqual([])
  })

  it('rejects year as a string', () => {
    const errors = validateMetadata({ ...valid, year: '2024' })
    expect(errors[0]).toMatch(/year.*number/)
  })

  it('accepts year as a number', () => {
    expect(validateMetadata({ ...valid, year: 2024 })).toEqual([])
  })

  it('includes the filePath in error messages when provided', () => {
    const errors = validateMetadata({ short_description: 'desc' }, 'proposals/2024/org/proj/proposal.json')
    expect(errors[0]).toMatch(/proposals\/2024\/org\/proj\/proposal\.json/)
  })

  it('omits path prefix when filePath is empty', () => {
    const errors = validateMetadata({ short_description: 'desc' })
    expect(errors[0]).not.toMatch(/undefined/)
    expect(errors[0]).not.toMatch(/null/)
  })
})

// ---------------------------------------------------------------------------
// validateFolderName
// ---------------------------------------------------------------------------
describe('validateFolderName', () => {
  it('accepts a valid lowercase-hyphen name', () => {
    expect(validateFolderName('apache-software-foundation')).toEqual([])
  })

  it('accepts a name with digits', () => {
    expect(validateFolderName('project-2024')).toEqual([])
  })

  it('accepts a single word', () => {
    expect(validateFolderName('mozilla')).toEqual([])
  })

  it('rejects uppercase letters', () => {
    const errors = validateFolderName('Mozilla')
    expect(errors[0]).toMatch(/lowercase/)
  })

  it('rejects spaces', () => {
    const errors = validateFolderName('my project')
    expect(errors[0]).toMatch(/spaces/)
  })

  it('rejects underscores', () => {
    const errors = validateFolderName('my_project')
    expect(errors[0]).toMatch(/only contain/)
  })

  it('rejects a leading hyphen', () => {
    const errors = validateFolderName('-leading')
    expect(errors[0]).toMatch(/hyphen/)
  })

  it('rejects a trailing hyphen', () => {
    const errors = validateFolderName('trailing-')
    expect(errors[0]).toMatch(/hyphen/)
  })

  it('rejects an empty string', () => {
    expect(validateFolderName('')).not.toEqual([])
  })

  it('rejects mixed-case names', () => {
    const errors = validateFolderName('My-Project')
    expect(errors[0]).toMatch(/lowercase/)
  })
})

// ---------------------------------------------------------------------------
// validateYear
// ---------------------------------------------------------------------------
describe('validateYear', () => {
  it('accepts the first GSoC year (2005)', () => {
    expect(validateYear('2005')).toEqual([])
  })

  it('accepts a recent year', () => {
    expect(validateYear('2024')).toEqual([])
  })

  it('accepts the current year', () => {
    expect(validateYear(String(new Date().getFullYear()))).toEqual([])
  })

  it('rejects a 2-digit year', () => {
    expect(validateYear('24')).not.toEqual([])
  })

  it('rejects a 5-digit year', () => {
    expect(validateYear('20244')).not.toEqual([])
  })

  it('rejects a non-numeric string', () => {
    expect(validateYear('abcd')).not.toEqual([])
  })

  it('rejects a year before GSoC started', () => {
    const errors = validateYear('2004')
    expect(errors[0]).toMatch(/2005/)
  })

  it('rejects a far-future year', () => {
    const far = String(new Date().getFullYear() + 5)
    expect(validateYear(far)).not.toEqual([])
  })
})

// ---------------------------------------------------------------------------
// validateReadme
// ---------------------------------------------------------------------------
describe('validateReadme', () => {
  const good = '# My Project\n\nThis is a valid README with enough content to pass.'

  it('accepts a valid README', () => {
    expect(validateReadme(good)).toEqual([])
  })

  it('accepts a multi-section README', () => {
    const content = '# Title\n\n## Section\n\nSome content here.\n\n## Another\n\nMore.'
    expect(validateReadme(content)).toEqual([])
  })

  it('rejects an empty string', () => {
    expect(validateReadme('')).not.toEqual([])
  })

  it('rejects whitespace-only content', () => {
    expect(validateReadme('   \n  \t  ')).not.toEqual([])
  })

  it('rejects content with null bytes (binary/corrupted)', () => {
    const errors = validateReadme('# Title\n\0corrupted')
    expect(errors[0]).toMatch(/null bytes/)
  })

  it('rejects content that is too short', () => {
    const errors = validateReadme('# Hi')
    expect(errors[0]).toMatch(/too short/)
  })

  it('rejects content with no markdown headings', () => {
    const errors = validateReadme('This is a README without any heading lines at all.')
    expect(errors[0]).toMatch(/headings/)
  })

  it('includes filePath in error messages', () => {
    const errors = validateReadme('', 'proposals/2026/org/README.md')
    expect(errors[0]).toMatch(/proposals\/2026\/org\/README\.md/)
  })
})

// ---------------------------------------------------------------------------
// validateOrgReadme
// ---------------------------------------------------------------------------
describe('validateOrgReadme', () => {
  const good = `# My Org

## How to Contribute Your Proposal

Create a \`proposal.json\` file in your project folder with the required fields.
Refer to the field reference table for details.
`

  it('accepts a valid org README with submission instructions', () => {
    expect(validateOrgReadme(good)).toEqual([])
  })

  it('rejects an org README missing a submission instructions section', () => {
    const bad = '# My Org\n\nSome content about the org without submission instructions at all.\n'
    const errors = validateOrgReadme(bad)
    expect(errors.some(e => /how to (submit|contribute)/i.test(e))).toBe(true)
  })

  it('rejects an org README that does not reference a metadata file', () => {
    const bad = '# My Org\n\n## How to Submit Your Proposal\n\nJust fork and open a PR.\n'
    const errors = validateOrgReadme(bad)
    expect(errors.some(e => /metadata file/i.test(e))).toBe(true)
  })

  it('accepts a README referencing proposal.yaml as the metadata file', () => {
    const withYaml = good.replace('proposal.json', 'proposal.yaml')
    expect(validateOrgReadme(withYaml)).toEqual([])
  })

  it('propagates base README errors (empty file)', () => {
    expect(validateOrgReadme('')).not.toEqual([])
  })
})

// ---------------------------------------------------------------------------
// parseMetadataContent
// ---------------------------------------------------------------------------
describe('parseMetadataContent', () => {
  it('parses valid JSON', () => {
    const result = parseMetadataContent('{"project_title":"Test","short_description":"desc"}', 'json')
    expect(result.project_title).toBe('Test')
  })

  it('throws on invalid JSON', () => {
    expect(() => parseMetadataContent('{broken json', 'json')).toThrow(/Invalid JSON/)
  })

  it('parses valid YAML', () => {
    const yaml = 'project_title: Test\nshort_description: A description'
    const result = parseMetadataContent(yaml, 'yaml')
    expect(result.project_title).toBe('Test')
  })

  it('parses YAML with array tech_stack', () => {
    const yaml = 'project_title: T\nshort_description: D\ntech_stack:\n  - Python\n  - Django'
    const result = parseMetadataContent(yaml, 'yaml')
    expect(result.tech_stack).toEqual(['Python', 'Django'])
  })

  it('throws on invalid YAML', () => {
    expect(() => parseMetadataContent('key: [unclosed', 'yaml')).toThrow(/Invalid YAML/)
  })

  it('throws when YAML is empty (parses to null)', () => {
    expect(() => parseMetadataContent('', 'yaml')).toThrow()
  })

  it('throws when YAML is a list, not a mapping', () => {
    expect(() => parseMetadataContent('- item1\n- item2', 'yaml')).toThrow(/list/)
  })

  it('throws for an unsupported format', () => {
    expect(() => parseMetadataContent('{}', 'toml')).toThrow(/Unsupported format/)
  })
})

// ---------------------------------------------------------------------------
// getFormatFromFilename
// ---------------------------------------------------------------------------
describe('getFormatFromFilename', () => {
  it('returns "json" for proposal.json', () => {
    expect(getFormatFromFilename('proposal.json')).toBe('json')
  })

  it('returns "json" for metadata.json', () => {
    expect(getFormatFromFilename('metadata.json')).toBe('json')
  })

  it('returns "yaml" for proposal.yaml', () => {
    expect(getFormatFromFilename('proposal.yaml')).toBe('yaml')
  })

  it('returns "yaml" for proposal.yml', () => {
    expect(getFormatFromFilename('proposal.yml')).toBe('yaml')
  })

  it('returns "yaml" for metadata.yaml', () => {
    expect(getFormatFromFilename('metadata.yaml')).toBe('yaml')
  })

  it('returns null for an unknown extension', () => {
    expect(getFormatFromFilename('proposal.toml')).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// Constants sanity checks
// ---------------------------------------------------------------------------
describe('constants', () => {
  it('DIFFICULTY_VALUES contains all 6 accepted values', () => {
    expect(DIFFICULTY_VALUES.size).toBe(6)
    expect(DIFFICULTY_VALUES.has('Easy')).toBe(true)
    expect(DIFFICULTY_VALUES.has('Hard')).toBe(true)
    expect(DIFFICULTY_VALUES.has('Beginner')).toBe(true)
    expect(DIFFICULTY_VALUES.has('Advanced')).toBe(true)
  })

  it('METADATA_FILE_PRIORITY lists JSON before YAML', () => {
    const jsonIdx = METADATA_FILE_PRIORITY.indexOf('proposal.json')
    const yamlIdx = METADATA_FILE_PRIORITY.indexOf('proposal.yaml')
    expect(jsonIdx).toBeLessThan(yamlIdx)
  })
})
