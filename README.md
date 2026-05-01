<div align="center">

# 🎓 GSoC Proposal Hub

**A structured, searchable archive of accepted Google Summer of Code proposals**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](docs/upload.md)

[Browse Proposals](#) · [Submit Yours](docs/upload.md) · [Contributing](docs/CONTRIBUTING.md)

</div>

---

## 🚀 What is This?

GSoC Proposal Hub is an open-source platform that preserves accepted Google Summer of Code proposals in a structured, searchable format. It helps future GSoC applicants learn from winning proposals.

**Key Features:**
- 🔍 Search across proposals by title, tech stack, and organization
- 🏷️ Filter by year, difficulty, organization, and technology
- 📄 Embedded PDF viewer for reading proposals directly in the browser
- 📥 Download proposals for offline reading
- 🗂️ Strictly organized folder structure for long-term maintainability

## 📁 Repository Structure

```
/proposals
  /{year}                    (e.g. 2024)
    /{organization-slug}     (e.g. apache-software-foundation)
      /{project-slug}        (e.g. kafka-stream-optimizer)
        metadata.json
        proposal.pdf

/docs
  upload.md                  Contributor guide
  CONTRIBUTING.md            Contributing guidelines

/src                         React frontend source
/scripts                     Build utilities
```

## 🛠️ Tech Stack

- **Frontend**: React 19 + Tailwind CSS v4
- **Build**: Vite
- **PDF Viewing**: react-pdf
- **Routing**: React Router v7
- **Data**: Static JSON index generated from repository files

## 🏃 Quick Start

```bash
# Clone the repo
git clone https://github.com/YOUR-USERNAME/gsocproposalhub.git
cd gsocproposalhub

# Install dependencies
npm install

# Start dev server (auto-builds proposal index)
npm run dev
```

The app will be available at `http://localhost:5173`.

## 📤 Submit a Proposal

We welcome accepted GSoC proposals from all years and organizations! Submissions are made via Pull Requests.

**Quick steps:**
1. Fork this repository
2. Create folder: `proposals/{year}/{org-slug}/{project-slug}/`
3. Add `metadata.json` and `proposal.pdf`
4. Submit a Pull Request

📖 **[Read the full submission guide →](docs/upload.md)**

## 📋 Metadata Schema

Every proposal must include a `metadata.json` with this structure:

```json
{
  "name": "string (optional)",
  "year": 2024,
  "organization": "Organization Name",
  "project_title": "Project Title",
  "difficulty": "Beginner | Intermediate | Advanced",
  "tech_stack": ["Tech1", "Tech2"],
  "short_description": "2-3 line description"
}
```

## 🤝 Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines on contributing to this project.

## 📄 License

This project is licensed under the MIT License.
