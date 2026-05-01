import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import DifficultyBadge from '../components/DifficultyBadge'
import TechTag from '../components/TechTag'
import PDFViewer from '../components/PDFViewer'

function ProposalDetailPage() {
  const { year, org, project } = useParams()
  const [proposal, setProposal] = useState(null)
  const [allProposals, setAllProposals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/proposals-index.json')
      .then(res => res.json())
      .then(data => {
        setAllProposals(data)
        const found = data.find(
          p => p.yearSlug === year && p.orgSlug === org && p.projectSlug === project
        )
        setProposal(found || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [year, org, project])

  // Related proposals: same org or shared tech
  const related = allProposals
    .filter(p => {
      if (p.yearSlug === year && p.orgSlug === org && p.projectSlug === project) return false
      if (p.organization === proposal?.organization) return true
      const sharedTech = (p.tech_stack || []).filter(t => (proposal?.tech_stack || []).includes(t))
      return sharedTech.length > 0
    })
    .slice(0, 3)

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-slate-700/30 rounded w-48"></div>
            <div className="h-8 bg-slate-700/50 rounded w-3/4"></div>
            <div className="h-6 bg-slate-700/30 rounded w-1/2"></div>
            <div className="h-96 bg-slate-800/40 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/60 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-200 mb-2">Proposal Not Found</h2>
          <p className="text-slate-500 text-sm mb-4">The proposal you're looking for doesn't exist.</p>
          <Link to="/proposals" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
            ← Back to all proposals
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/proposals" className="hover:text-slate-300 transition-colors">Proposals</Link>
          <span>/</span>
          <span className="text-slate-400">{proposal.project_title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <DifficultyBadge difficulty={proposal.difficulty} size="md" />
            <span className="text-sm font-mono text-slate-500">{proposal.year}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-100 mb-4 leading-tight">
            {proposal.project_title}
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center">
              <span className="text-sm font-bold text-indigo-400">
                {proposal.organization?.charAt(0)}
              </span>
            </div>
            <div>
              <span className="text-slate-200 font-medium">{proposal.organization}</span>
              {proposal.name && proposal.name !== 'Anonymous' && (
                <span className="text-slate-500 text-sm ml-2">by {proposal.name}</span>
              )}
            </div>
          </div>
        </div>

        {/* Metadata Card */}
        <div className="glass-card p-6 mb-8" style={{ transform: 'none' }}>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">About This Proposal</h2>
          <p className="text-slate-300 leading-relaxed mb-6">{proposal.short_description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Year</span>
              <p className="text-slate-200 font-semibold mt-1">{proposal.year}</p>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Difficulty</span>
              <div className="mt-1">
                <DifficultyBadge difficulty={proposal.difficulty} />
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Organization</span>
              <p className="text-slate-200 font-semibold mt-1">{proposal.organization}</p>
            </div>
          </div>

          <div className="mt-6">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Tech Stack</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {(proposal.tech_stack || []).map(tech => (
                <TechTag key={tech} tech={tech} size="md" />
              ))}
            </div>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-100">Proposal Document</h2>
          </div>
          <PDFViewer url={proposal.pdfUrl} />
        </div>

        {/* Related Proposals */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-lg font-semibold text-slate-100 mb-6">Related Proposals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map(rp => (
                <Link
                  key={`${rp.yearSlug}-${rp.orgSlug}-${rp.projectSlug}`}
                  to={`/proposals/${rp.yearSlug}/${rp.orgSlug}/${rp.projectSlug}`}
                  className="glass-card p-4 group"
                >
                  <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors line-clamp-2 mb-2">
                    {rp.project_title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{rp.organization}</span>
                    <span className="text-slate-700">·</span>
                    <span className="text-xs text-slate-500">{rp.year}</span>
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
