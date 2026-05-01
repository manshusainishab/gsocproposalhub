# Contributing to GSoC Proposal Hub

Thank you for your interest in contributing! This document covers the guidelines for contributing to the GSoC Proposal Hub.

## Types of Contributions

### 1. Submitting a Proposal

The primary way to contribute is by adding your accepted GSoC proposal to the archive. Please read the [Upload Guide](upload.md) for detailed instructions.

### 2. Improving the Platform

We also welcome improvements to the website itself:

- Bug fixes
- UI/UX improvements
- Accessibility improvements
- Performance optimizations
- Documentation updates

## Code of Conduct

- Be respectful and constructive
- Help maintain a welcoming environment
- Focus on constructive feedback

## Getting Started

### For Proposal Submissions

1. Read the [Upload Guide](upload.md) thoroughly
2. Fork the repository
3. Follow the strict folder structure and naming conventions
4. Submit a Pull Request using the provided template
5. Wait for maintainer review

### For Code Contributions

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Start the dev server: `npm run dev`
5. Make your changes
6. Test thoroughly
7. Submit a Pull Request

## Development Setup

```bash
# Clone the repo
git clone https://github.com/YOUR-USERNAME/gsocproposalhub.git
cd gsocproposalhub

# Install dependencies
npm install

# Build the proposals index (runs automatically before dev)
node scripts/build-index.js

# Start development server
npm run dev
```

## Pull Request Process

1. Ensure your PR follows the template
2. Include a clear description of your changes
3. Wait for maintainer review
4. Address any requested changes
5. Once approved, your PR will be merged

## Review Criteria for Proposals

Maintainers will manually verify:

- ✅ Correct folder structure (`/proposals/{year}/{org-slug}/{project-slug}/`)
- ✅ Correct file names (`metadata.json` and `proposal.pdf`)
- ✅ Valid metadata schema (all required fields, correct types)
- ✅ `difficulty` matches enum values exactly
- ✅ `tech_stack` is an array
- ✅ No extra or invalid fields in metadata
- ✅ PDF file is present and valid

**PRs that do not strictly follow the rules will be rejected.**

## Questions?

Open an issue if you need help or have questions about contributing.
