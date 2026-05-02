import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #e8e8e8', background: '#fff', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Brand */}
        <div>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, textDecoration: 'none' }}>
            <img src="/favicon.svg" alt="GSoCHub Logo" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            <span style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>
              GSoC<span style={{ color: '#6366f1' }}>Hub</span>
            </span>
          </Link>
          <p style={{ fontSize: 13, color: '#888', maxWidth: 320, lineHeight: 1.6 }}>
            Accepted GSoC proposals, rendered client-side from GitHub PDF links.
            Learn from winners and contribute yours via PR.
          </p>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              Explore
            </div>
            {[
              { to: '/', label: 'Home' },
              { to: '/how-to-add', label: 'How to Add Proposal' },
            ].map(({ to, label }) => (
              <div key={to} style={{ marginBottom: 6 }}>
                <Link to={to} style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}
                  onMouseOver={(e) => e.target.style.color = '#6366f1'}
                  onMouseOut={(e) => e.target.style.color = '#666'}
                >
                  {label}
                </Link>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              Contribute
            </div>
            {[
              { href: 'https://github.com/manshusainishab/gsocproposalhub/pulls', label: 'Submit a Proposal' },
              { href: 'https://github.com/manshusainishab/gsocproposalhub/blob/main/docs/CONTRIBUTING.md', label: 'Contribution Guide' },
              { href: 'https://github.com/manshusainishab/gsocproposalhub', label: 'GitHub ↗' },
              { href: 'https://summerofcode.withgoogle.com', label: 'GSoC Official ↗' },
            ].map(({ href, label }) => (
              <div key={href} style={{ marginBottom: 6 }}>
                <a href={href} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}
                  onMouseOver={(e) => e.target.style.color = '#6366f1'}
                  onMouseOut={(e) => e.target.style.color = '#666'}
                >
                  {label}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        maxWidth: 1280, margin: '20px auto 0', paddingTop: 16,
        borderTop: '1px solid #f0f0f0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8,
      }}>
        <p style={{ fontSize: 12, color: '#bbb' }}>
          © {new Date().getFullYear()} GSoC Proposal Hub · MIT License
        </p>
        <p style={{ fontSize: 12, color: '#bbb' }}>
          Made with ❤️ by @manshusainishab
        </p>
      </div>
    </footer>
  )
}

export default Footer
