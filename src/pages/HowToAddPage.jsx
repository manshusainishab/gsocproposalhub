function HowToAddPage() {
  return (
    <div style={{ background: '#f5f5f5', minHeight: 'calc(100vh - 57px)', padding: '40px 16px 80px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderRadius: 100,
            background: '#e0e7ff', color: '#4f46e5',
            fontSize: 12, fontWeight: 700, marginBottom: 14,
          }}>
            📺 Step-by-Step Tutorial
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#111', marginBottom: 10, lineHeight: 1.2 }}>
            How to Add Your Proposal
          </h1>
          <p style={{ fontSize: 15, color: '#666', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Got accepted to GSoC 2026? Share your winning proposal with the community
            through a simple GitHub Pull Request.
          </p>
        </div>

        {/* YouTube Embed */}
        <div style={{
          background: '#fff', borderRadius: 16, border: '1px solid #e8e8e8',
          overflow: 'hidden', marginBottom: 36, boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}>
          <div style={{ position: 'relative', paddingTop: '56.25%' /* 16:9 */ }}>
            <iframe
              id="tutorial-youtube-embed"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="How to Add Your GSoC Proposal to GSoCHub"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%',
              }}
            />
          </div>
          <div style={{ padding: '14px 20px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
            <p style={{ fontSize: 12, color: '#aaa', margin: 0 }}>
              Watch the full tutorial to understand how to format your proposal.json and submit a PR.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
          {[
            {
              step: '1',
              title: 'Fork the repository',
              desc: 'Go to the GSoCHub GitHub repository and click Fork to create your own copy.',
              code: null,
              link: { label: 'Fork on GitHub →', href: 'https://github.com/manshusainishab/gsocproposalhub' },
            },
            {
              step: '2',
              title: 'Create your project folder',
              desc: 'Navigate to proposals/2026/<your-org-slug>/ and create a new folder named after your project (lowercase, hyphens only).',
              code: 'proposals/2026/django-software-foundation/my-awesome-project/',
            },
            {
              step: '3',
              title: 'Create proposal.json',
              desc: 'Inside your project folder, create a proposal.json file with the following fields:',
              code: JSON.stringify({
                project_title: "Your Exact GSoC Project Title",
                contributor_name: "Your Name",
                organization: "Organization Name",
                short_description: "1-2 sentence description of what your project does.",
                difficulty: "Medium",
                tech_stack: ["Python", "TensorFlow", "React"],
                gsoc_url: "https://summerofcode.withgoogle.com/programs/2026/projects/YOUR_ID",
                pdf_url: "https://github.com/you/repo/blob/main/proposal.pdf",
                references: [
                  { title: "Implementation PR", url: "https://github.com/org/repo/pull/1" },
                  { title: "GSoC archive entry", url: "https://..." }
                ]
              }, null, 2),
            },
            {
              step: '4',
              title: 'Upload your proposal PDF',
              desc: 'Upload your proposal PDF to your own GitHub repository and paste the link as pdf_url. We automatically convert GitHub blob URLs to raw URLs for client-side rendering — just paste the normal GitHub link.',
              code: '// Paste this in pdf_url:\nhttps://github.com/yourname/myrepo/blob/main/proposal.pdf',
            },
            {
              step: '5',
              title: 'Open a Pull Request',
              desc: 'Commit your changes, push to your fork, and open a Pull Request to the main repository. We review and merge usually within 48 hours!',
              code: null,
            },
          ].map(({ step, title, desc, code, link }) => (
            <div key={step} style={{
              background: '#fff', borderRadius: 12, border: '1px solid #e8e8e8', overflow: 'hidden',
            }}>
              <div style={{ display: 'flex', gap: 14, padding: '18px 20px 16px' }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, background: '#6366f1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: 13, flexShrink: 0, marginTop: 1,
                }}>
                  {step}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: '0 0 6px' }}>{title}</h3>
                  <p style={{ fontSize: 13, color: '#666', margin: 0, lineHeight: 1.6 }}>{desc}</p>
                  {link && (
                    <a href={link.href} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-block', marginTop: 10, fontSize: 13, fontWeight: 600, color: '#6366f1', textDecoration: 'none' }}>
                      {link.label}
                    </a>
                  )}
                </div>
              </div>
              {code && (
                <pre style={{
                  background: '#1e1e2e', color: '#cdd6f4', fontSize: 12,
                  padding: '16px 20px', margin: 0, overflowX: 'auto',
                  borderTop: '1px solid #2a2a3a', lineHeight: 1.6,
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                }}>
                  {code}
                </pre>
              )}
            </div>
          ))}
        </div>

        {/* Field Reference Table */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8e8e8', overflow: 'hidden', marginBottom: 36 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0 }}>proposal.json Field Reference</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: '1px solid #e8e8e8' }}>
                  {['Field', 'Required', 'Description'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: '#444', fontSize: 12 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['project_title', '✅ Required', 'Exact title from your GSoC dashboard'],
                  ['contributor_name', '✅ Required', 'Your full name'],
                  ['organization', '✅ Required', 'Exact organization name (as in orgs JSON)'],
                  ['short_description', '✅ Required', '1-2 sentence project summary'],
                  ['pdf_url', '✅ Required', 'GitHub link to your proposal PDF'],
                  ['gsoc_url', '➕ Recommended', 'Link to your GSoC project page (programs/2026/projects/...)'],
                  ['difficulty', '➕ Optional', 'Easy / Medium / Hard'],
                  ['tech_stack', '➕ Optional', 'Array of technologies used'],
                  ['references', '➕ Optional', 'Array of { title, url } — PRs, blog posts, reports'],
                ].map(([field, req, desc], i) => (
                  <tr key={field} style={{ borderBottom: '1px solid #f5f5f5', background: i % 2 === 1 ? '#fafafa' : '#fff' }}>
                    <td style={{ padding: '10px 16px' }}>
                      <code style={{ fontSize: 12, background: '#f1f1f1', padding: '2px 6px', borderRadius: 4, color: '#6366f1' }}>
                        {field}
                      </code>
                    </td>
                    <td style={{ padding: '10px 16px', color: req.startsWith('✅') ? '#16a34a' : '#888', fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap' }}>
                      {req}
                    </td>
                    <td style={{ padding: '10px 16px', color: '#666' }}>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
          borderRadius: 16, padding: '32px 28px', textAlign: 'center',
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
            Ready to share your proposal?
          </h2>
          <p style={{ fontSize: 13, color: '#c7d2fe', marginBottom: 20, lineHeight: 1.6 }}>
            Help thousands of future GSoC applicants by contributing yours.
          </p>
          <a
            href="https://github.com/manshusainishab/gsocproposalhub"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 24px', borderRadius: 10,
              background: '#fff', color: '#6366f1',
              fontWeight: 700, fontSize: 14, textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}
          >
            <svg style={{ width: 18, height: 18 }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Open a Pull Request
          </a>
        </div>

      </div>
    </div>
  )
}

export default HowToAddPage
