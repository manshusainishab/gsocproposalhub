import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import ProposalCard from '../components/ProposalCard'

const ORG_SOURCE = '/2026-orgs.json'

function OrgProposalsPage() {
  const { orgSlug } = useParams()
  const [proposals, setProposals] = useState([])
  const [orgs, setOrgs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/proposals-index.json').then(r => r.json()).catch(() => []),
      fetch(ORG_SOURCE).then(r => r.json()).catch(() => []),
    ]).then(([props, orgData]) => {
      setProposals(props)
      setOrgs(orgData)
      setLoading(false)
    })
  }, [])

  // Find org info from JSON files
  const orgInfo = useMemo(
    () => orgs.find(o =>
      o.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === orgSlug
    ),
    [orgs, orgSlug]
  )

  // All proposals for this org
  const orgProposals = useMemo(
    () => proposals.filter(p => p.orgSlug === orgSlug),
    [proposals, orgSlug]
  )

  // Available years for this org
  const years = useMemo(
    () => [...new Set(orgProposals.map(p => p.year))].sort((a, b) => b - a),
    [orgProposals]
  )

  // Default to most recent year
  useEffect(() => {
    if (years.length > 0 && selectedYear === null) {
      setSelectedYear(years[0])
    }
  }, [years, selectedYear])

  // Filtered proposals
  const displayedProposals = useMemo(() => {
    let list = selectedYear
      ? orgProposals.filter(p => p.year === selectedYear)
      : orgProposals
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.project_title?.toLowerCase().includes(q) ||
        p.short_description?.toLowerCase().includes(q) ||
        (p.tech_stack || []).some(t => t.toLowerCase().includes(q))
      )
    }
    return list
  }, [orgProposals, selectedYear, search])

  if (loading) {
    return (
      <div style={{ padding: '60px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div className="skeleton h-8 w-64 mb-4" style={{ borderRadius: 8 }} />
        <div className="skeleton h-4 w-96 mb-8" style={{ borderRadius: 6 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="proposal-card p-4">
              <div className="skeleton h-4 w-3/4 mb-2" />
              <div className="skeleton h-3 w-1/2 mb-3" />
              <div className="skeleton h-10" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: 'calc(100vh - 57px)' }}>
      {/* ── Org Header ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 0' }}>
          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, fontSize: 13, color: '#999' }}>
            <Link to="/" style={{ color: '#999', textDecoration: 'none' }}>Organizations</Link>
            <span>›</span>
            <span style={{ color: '#555', fontWeight: 500 }}>{orgInfo?.name || orgSlug}</span>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            {/* Org Logo */}
            {orgInfo?.img && (
              <div style={{
                width: 56, height: 56, borderRadius: 12,
                background: '#fff', border: '1px solid #e8e8e8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, padding: 6,
              }}>
                <img
                  src={orgInfo.img}
                  alt={orgInfo.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={e => { e.target.style.display = 'none' }}
                />
              </div>
            )}
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: 0, lineHeight: 1.2 }}>
                {orgInfo?.name || orgSlug}
              </h1>
              {orgInfo?.desc && (
                <p style={{ fontSize: 13, color: '#888', margin: '4px 0 0', lineHeight: 1.5 }}>
                  {orgInfo.desc}
                </p>
              )}
            </div>
          </div>

          {/* Year Tabs */}
          {years.length > 0 && (
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #f0f0f0' }}>
              {years.map(y => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  style={{
                    padding: '10px 20px',
                    fontSize: 14,
                    fontWeight: selectedYear === y ? 700 : 500,
                    color: selectedYear === y ? '#6366f1' : '#666',
                    background: 'none',
                    border: 'none',
                    borderBottom: selectedYear === y ? '2px solid #6366f1' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    marginBottom: -1,
                  }}
                >
                  {y}
                  <span style={{
                    marginLeft: 6, fontSize: 11, fontWeight: 700,
                    padding: '1px 6px', borderRadius: 100,
                    background: selectedYear === y ? '#e0e7ff' : '#f0f0f0',
                    color: selectedYear === y ? '#6366f1' : '#888',
                  }}>
                    {orgProposals.filter(p => p.year === y).length}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px' }}>
        {orgProposals.length === 0 ? (
          /* No proposals yet — contributor prompt */
          <div style={{
            background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12,
            padding: '48px 32px', textAlign: 'center',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 12, background: '#f3f4f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <svg style={{ width: 28, height: 28, color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 8 }}>
              No proposals yet for {orgInfo?.name || orgSlug}
            </h3>
            <p style={{ fontSize: 13, color: '#888', maxWidth: 380, margin: '0 auto 20px', lineHeight: 1.6 }}>
              Got accepted to GSoC 2026 with this org? Be the first to share your proposal!
            </p>
            <Link
              to="/how-to-add"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 8,
                background: '#6366f1', color: '#fff',
                fontWeight: 600, fontSize: 13, textDecoration: 'none',
              }}
            >
              How to Add Your Proposal →
            </Link>
          </div>
        ) : (
          <>
            {/* Search + count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
                <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#aaa', pointerEvents: 'none' }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text" value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search proposals..."
                  className="top-search"
                  id="org-proposals-search"
                />
              </div>
              <span className="result-badge">
                {displayedProposals.length} proposal{displayedProposals.length !== 1 ? 's' : ''}
              </span>
            </div>

            {displayedProposals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
                No proposals match your search.{' '}
                <button onClick={() => setSearch('')} style={{ color: '#6366f1', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                  Clear
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
                {displayedProposals.map((p, i) => (
                  <ProposalCard
                    key={`${p.yearSlug}-${p.orgSlug}-${p.projectSlug}`}
                    proposal={p}
                    index={i}
                    orgImage={orgInfo?.img}
                    orgSlug={orgSlug}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default OrgProposalsPage
