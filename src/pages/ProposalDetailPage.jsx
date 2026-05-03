import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import DifficultyBadge from '../components/DifficultyBadge'
import PDFViewer from '../components/PDFViewer'

const ORG_SOURCE = '/2026-orgs.json'

function ProposalDetailPage() {
  const { year, orgSlug, project } = useParams()
  const [proposal, setProposal] = useState(null)
  const [allProposals, setAllProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [orgImageMap, setOrgImageMap] = useState({})

  useEffect(() => {
    fetch('/proposals-index.json')
      .then((r) => r.json())
      .then((data) => {
        setAllProposals(data)
        setProposal(
          data.find((p) => p.yearSlug === year && p.orgSlug === orgSlug && p.projectSlug === project) || null
        )
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [year, orgSlug, project])

  useEffect(() => {
    fetch(ORG_SOURCE).then((r) => r.json()).catch(() => []).then(
      (orgData) => {
        const map = {}
        orgData.forEach((o) => { map[o.name] = o.img })
        setOrgImageMap(map)
      }
    )
  }, [])

  const related = allProposals
    .filter((p) => {
      if (p.yearSlug === year && p.orgSlug === orgSlug && p.projectSlug === project) return false
      if (p.organization === proposal?.organization) return true
      return (p.tech_stack || []).some((t) => (proposal?.tech_stack || []).includes(t))
    })
    .slice(0, 3)

  if (loading) {
    return (
      <div style={{ padding: '80px 24px', maxWidth: 840, margin: '0 auto' }}>
        <div className="skeleton h-4 w-48 mb-4" style={{ borderRadius: 6 }} />
        <div className="skeleton h-8 w-3/4 mb-3" style={{ borderRadius: 6 }} />
        <div className="skeleton h-64 mb-4" style={{ borderRadius: 12 }} />
      </div>
    )
  }

  if (!proposal) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)', flexDirection: 'column', gap: 12, textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 12, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg style={{ width: 28, height: 28, color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
          </svg>
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>Proposal Not Found</h2>
        <p style={{ fontSize: 14, color: '#888' }}>The proposal you're looking for doesn't exist.</p>
        <Link to={`/${orgSlug}/proposals`} style={{ fontSize: 14, fontWeight: 600, color: '#6366f1', textDecoration: 'none' }}>
          ← Back to proposals
        </Link>
      </div>
    )
  }

  const orgImg = orgImageMap[proposal.organization]

  return (
    <div style={{ background: '#f5f5f5', minHeight: 'calc(100vh - 57px)', padding: '32px 16px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, fontSize: 13, color: '#999' }}>
          <Link to="/" style={{ color: '#999', textDecoration: 'none' }}>Organizations</Link>
          <span>›</span>
          <Link to={`/${orgSlug}/proposals`} style={{ color: '#999', textDecoration: 'none' }}>{proposal.organization}</Link>
          <span>›</span>
          <span style={{ color: '#555', fontWeight: 500 }} className="truncate">{proposal.project_title}</span>
        </nav>

        {/* Header card */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8e8e8', padding: 24, marginBottom: 16 }}>
          {/* Org row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            {orgImg ? (
              <div style={{ width: 40, height: 40, borderRadius: 10, overflow: 'hidden', border: '1px solid #f0f0f0', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <img src={orgImg} alt={proposal.organization} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }}
                  onError={(e) => { e.target.style.display = 'none' }} />
              </div>
            ) : (
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#e0e7ff,#ddd6fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontWeight: 800, color: '#6366f1', fontSize: 16 }}>{proposal.organization?.charAt(0)}</span>
              </div>
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{proposal.organization}</div>
              {proposal.name && proposal.name !== 'Anonymous' && (
                <div style={{ fontSize: 12, color: '#888' }}>by {proposal.name}</div>
              )}
            </div>
            <span className={`year-pill year-${proposal.year}`} style={{ marginLeft: 'auto' }}>{proposal.year}</span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111', lineHeight: 1.3, marginBottom: 12 }}>
            {proposal.project_title}
          </h1>

          {/* Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            <DifficultyBadge difficulty={proposal.difficulty} size="md" />
          </div>

          {/* Description */}
          <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, marginBottom: 16 }}>
            {proposal.short_description}
          </p>

          {/* Tech stack */}
          {(proposal.tech_stack || []).length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Tech Stack
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {proposal.tech_stack.map((t) => (
                  <span key={t} className="tech-tag">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PDF Viewer card */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8e8e8', padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>Proposal Document</h2>
            <span style={{ fontSize: 11, color: '#aaa' }}>Rendered from GitHub</span>
          </div>
          <PDFViewer url={proposal.pdfUrl} />
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 12 }}>Related Proposals</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
              {related.map((rp) => (
                <Link
                  key={`${rp.yearSlug}-${rp.orgSlug}-${rp.projectSlug}`}
                  to={`/${rp.orgSlug}/proposals/${rp.yearSlug}/${rp.projectSlug}`}
                  style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8e8e8', padding: 14, textDecoration: 'none', display: 'block', transition: 'box-shadow 0.15s' }}
                  onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)' }}
                  onMouseOut={(e) => { e.currentTarget.style.boxShadow = 'none' }}
                >
                  {orgImageMap[rp.organization] && (
                    <div style={{ width: 28, height: 28, borderRadius: 8, overflow: 'hidden', border: '1px solid #f0f0f0', background: '#fafafa', marginBottom: 8 }}>
                      <img src={orgImageMap[rp.organization]} alt={rp.organization}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 2 }}
                        onError={(e) => { e.target.style.display = 'none' }} />
                    </div>
                  )}
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111', lineHeight: 1.4, marginBottom: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {rp.project_title}
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#888' }}>{rp.organization}</span>
                    <span style={{ color: '#ddd' }}>·</span>
                    <span className={`year-pill year-${rp.year}`}>{rp.year}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProposalDetailPage
