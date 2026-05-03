# 📋 How to Submit a GSoC Proposal

Thank you for contributing to the GSoC Proposal Hub! This guide explains exactly how to add your accepted Google Summer of Code proposal to the archive.

## 🎯 Prerequisites

- You have an **accepted** GSoC proposal
- You have a GitHub account
- You have basic Git knowledge (fork, clone, commit, push, PR)

---

## 📁 Folder Structure (STRICT)

Your submission MUST follow this exact structure:

```
proposals/
  └── {year}/
      └── {organization-slug}/
          └── {project-slug}/
              ├── proposal.json   ← or proposal.yaml / metadata.json
              ├── proposal.pdf    ← optional if pdf_url is set
              └── README.md       ← optional
```

### Naming Rules

| Field | Rule | Example |
|-------|------|---------|
| `year` | 4-digit number, 2005 or later | `2024` |
| `organization-slug` | lowercase, hyphen-separated | `apache-software-foundation` |
| `project-slug` | lowercase, hyphen-separated | `kafka-stream-optimizer` |

- **No spaces** — use hyphens (`-`) instead
- **All lowercase** — no capital letters in folder names
- No underscores, no special characters other than hyphens
- The metadata file must be named exactly `proposal.json`, `proposal.yaml`, `metadata.json`, or `metadata.yaml`

---

## 📝 Metadata Schema (STRICT)

You can write your metadata as **JSON** (`proposal.json`) or **YAML** (`proposal.yaml`) — both are fully supported.

### JSON format (`proposal.json`)

```json
{
  "project_title": "Your Project Title",
  "contributor_name": "Your Name",
  "organization": "Organization Name",
  "short_description": "A 2-3 line description of your project.",
  "difficulty": "Medium",
  "tech_stack": ["Python", "Django", "PostgreSQL"],
  "gsoc_url": "https://summerofcode.withgoogle.com/programs/2024/projects/YOUR_ID",
  "pdf_url": "https://github.com/YOUR_USERNAME/YOUR_REPO/blob/main/proposal.pdf",
  "references": [
    { "title": "Implementation PR", "url": "https://github.com/org/repo/pull/1" }
  ]
}
```

### YAML format (`proposal.yaml`)

```yaml
project_title: Your Project Title
contributor_name: Your Name
organization: Organization Name
short_description: A 2-3 line description of your project.
difficulty: Medium
tech_stack:
  - Python
  - Django
  - PostgreSQL
gsoc_url: https://summerofcode.withgoogle.com/programs/2024/projects/YOUR_ID
pdf_url: https://github.com/YOUR_USERNAME/YOUR_REPO/blob/main/proposal.pdf
references:
  - title: Implementation PR
    url: https://github.com/org/repo/pull/1
```

### Field Details

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `project_title` | string | ✅ Yes | Your exact GSoC project title |
| `short_description` | string | ✅ Yes | 1-3 line project description |
| `contributor_name` | string | Optional | Your name or "Anonymous" |
| `organization` | string | Optional | Full organization name |
| `difficulty` | string | Optional | One of: `Easy`, `Medium`, `Hard`, `Beginner`, `Intermediate`, `Advanced` |
| `tech_stack` | array | Optional | Array of technology strings |
| `gsoc_url` | string | Optional | Link to your GSoC project page |
| `pdf_url` | string | Optional | GitHub link to your proposal PDF |
| `references` | array | Optional | Array of `{ title, url }` objects |

### Rules

- ⚠️ `project_title` and `short_description` are **required** and must be non-empty strings
- ⚠️ `difficulty` must match one of the accepted values exactly (case-sensitive)
- ⚠️ `tech_stack` and `references` must be **arrays**
- ✅ Use `pdf_url` to link to a PDF hosted on GitHub, or include `proposal.pdf` in your folder

### Optional: README.md

You may add a `README.md` to your project folder for extra context. If present it must:
- Have at least one markdown heading (`# Heading`)
- Contain at least 20 characters of content
- Not contain binary data or null bytes

---

## 🚀 Step-by-Step PR Process

### 1. Fork the Repository

Click the "Fork" button on the GitHub repository page.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR-USERNAME/gsocproposalhub.git
cd gsocproposalhub
```

### 3. Create a Branch

```bash
git checkout -b add/2024-apache-kafka-optimizer
```

Use the format: `add/{year}-{org-slug}-{project-slug}`

### 4. Create Your Folder

```bash
mkdir -p proposals/2024/apache-software-foundation/kafka-stream-optimizer
```

### 5. Add Your Files

Place your `metadata.json` and `proposal.pdf` in the folder:

```bash
proposals/2024/apache-software-foundation/kafka-stream-optimizer/
├── metadata.json
└── proposal.pdf
```

### 6. Validate Your Metadata

Before committing, double-check:
- [ ] All required fields are present
- [ ] `difficulty` matches exact enum values
- [ ] `tech_stack` is an array
- [ ] `year` is a number
- [ ] No extra fields added

### 7. Commit and Push

```bash
git add .
git commit -m "Add 2024 Apache Kafka Stream Optimizer proposal"
git push origin add/2024-apache-kafka-optimizer
```

### 8. Create a Pull Request

Go to the original repository and click "New Pull Request". Fill out the PR template completely.

---

## ✅ Example Valid Submission

### Folder:
```
proposals/2024/mozilla/firefox-accessibility-engine/
```

### metadata.json:
```json
{
  "name": "Anonymous",
  "year": 2024,
  "organization": "Mozilla",
  "project_title": "Firefox Accessibility Engine Overhaul",
  "difficulty": "Intermediate",
  "tech_stack": ["Rust", "JavaScript", "WebAPI", "ARIA"],
  "short_description": "Redesigning the Firefox accessibility engine to improve screen reader performance and ensure full WCAG 2.2 compliance across all web content types."
}
```

### proposal.pdf:
Your actual accepted GSoC proposal in PDF format.

---

## ❌ Common Mistakes

| Mistake | Fix |
|---------|-----|
| Folder name has spaces | Use hyphens: `my-project` |
| Folder name has capitals | Use lowercase: `mozilla` not `Mozilla` |
| `difficulty` is `"beginner"` | Use `"Beginner"` (capitalized) |
| `year` is `"2024"` (string) | Use `2024` (number) |
| `tech_stack` is a string | Use array: `["Python", "Django"]` |
| Extra fields in metadata | Remove them |
| Missing `proposal.pdf` | Always include the PDF |
| File named `Proposal.pdf` | Must be exactly `proposal.pdf` |

---

## 🤝 Need Help?

Open an issue on the repository if you have questions about the submission process.
