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
              ├── metadata.json
              └── proposal.pdf
```

### Naming Rules

| Field | Rule | Example |
|-------|------|---------|
| `year` | 4-digit number | `2024` |
| `organization-slug` | lowercase, hyphen-separated | `apache-software-foundation` |
| `project-slug` | lowercase, hyphen-separated | `kafka-stream-optimizer` |

- **No spaces** — use hyphens (`-`) instead
- **All lowercase** — no capital letters in folder names
- Files MUST be named exactly `metadata.json` and `proposal.pdf`

---

## 📝 Metadata Schema (STRICT)

Your `metadata.json` MUST follow this exact structure:

```json
{
  "name": "Your Name (or 'Anonymous')",
  "year": 2024,
  "organization": "Organization Name",
  "project_title": "Your Project Title",
  "difficulty": "Beginner",
  "tech_stack": ["Python", "Django", "PostgreSQL"],
  "short_description": "A 2-3 line description of your project and what it accomplishes."
}
```

### Field Details

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Optional | Your name or "Anonymous" |
| `year` | number | ✅ Yes | GSoC year (e.g. `2024`) |
| `organization` | string | ✅ Yes | Full organization name |
| `project_title` | string | ✅ Yes | Your project title |
| `difficulty` | string | ✅ Yes | One of: `Beginner`, `Intermediate`, `Advanced` |
| `tech_stack` | array | ✅ Yes | Array of technology strings |
| `short_description` | string | ✅ Yes | 2-3 line project description |

### Rules

- ⚠️ `difficulty` must be **exactly** one of: `Beginner`, `Intermediate`, `Advanced`
- ⚠️ `tech_stack` must be an **array** of strings
- ⚠️ `year` must be a **number**, not a string
- ❌ Do NOT add any extra fields
- ❌ Do NOT leave out required fields

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
