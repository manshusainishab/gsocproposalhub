import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import ProposalCard from '../components/ProposalCard'
import SearchBar from '../components/SearchBar'
import TechTag from '../components/TechTag'

function HomePage() {
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [heroSearch, setHeroSearch] = useState('')

  useEffect(() => {
    fetch('/proposals-index.json')
      .then(res => res.json())
      .then(data => {
        setProposals(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const stats = useMemo(() => ({
    totalProposals: proposals.length,
    totalOrgs: new Set(proposals.map(p => p.organization)).size,
    totalYears: new Set(proposals.map(p => p.year)).size,
  }), [proposals])

  const featuredProposals = useMemo(() => proposals.slice(0, 6), [proposals])

  const popularTech = useMemo(() => {
    const counts = {}
    proposals.forEach(p => (p.tech_stack || []).forEach(t => { counts[t] = (counts[t] || 0) + 1 }))
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([t]) => t)
  }, [proposals])

  const years = useMemo(() =>
    [...new Set(proposals.map(p => p.year))].sort((a, b) => b - a),
    [proposals]
  )

  return (
    <div>
      <Hero
        totalProposals={stats.totalProposals}
        totalOrgs={stats.totalOrgs}
        totalYears={stats.totalYears}
      />

      {/* Quick Search Section */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Find Your Inspiration</h2>
            <p className="text-slate-400 text-sm">Search across all proposals by title, technology, or organization</p>
          </div>
          <SearchBar
            value={heroSearch}
            onChange={setHeroSearch}
            placeholder="Try 'machine learning', 'React', 'Mozilla'..."
            className="max-w-xl mx-auto"
          />
          {heroSearch && (
            <div className="mt-4 text-center">
              <Link
                to={`/proposals?search=${encodeURIComponent(heroSearch)}`}
                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                View all results for "{heroSearch}" →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Browse by Year */}
      <section className="py-16 bg-slate-950 border-t border-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-slate-100 mb-6">Browse by Year</h2>
          <div className="flex flex-wrap gap-3">
            {years.map(year => (
              <Link
                key={year}
                to={`/proposals?year=${year}`}
                className="px-6 py-3 rounded-xl bg-slate-900/60 border border-slate-800/50 text-slate-300 hover:text-white hover:border-indigo-500/30 hover:bg-slate-800/60 transition-all font-semibold text-lg"
              >
                {year}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tech Tags */}
      <section className="py-16 bg-slate-950 border-t border-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-slate-100 mb-6">Popular Technologies</h2>
          <div className="flex flex-wrap gap-2">
            {popularTech.map(tech => (
              <Link key={tech} to={`/proposals?tech=${encodeURIComponent(tech)}`}>
                <TechTag tech={tech} size="md" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Proposals */}
      <section className="py-16 bg-slate-950 border-t border-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-100">Featured Proposals</h2>
              <p className="text-sm text-slate-400 mt-1">Latest accepted proposals from top organizations</p>
            </div>
            <Link
              to="/proposals"
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass-card p-6 animate-pulse">
                  <div className="h-5 bg-slate-700/50 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-slate-700/30 rounded w-1/2 mb-4"></div>
                  <div className="h-12 bg-slate-700/20 rounded mb-4"></div>
                  <div className="h-6 bg-slate-700/20 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredProposals.map((proposal, i) => (
                <ProposalCard key={`${proposal.yearSlug}-${proposal.orgSlug}-${proposal.projectSlug}`} proposal={proposal} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-950 border-t border-slate-800/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-4">
            Got an Accepted Proposal?
          </h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Help future GSoC applicants by sharing your accepted proposal. Submit via Pull Request and join our growing archive.
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Submit via GitHub
          </a>
        </div>
      </section>
    </div>
  )
}

export default HomePage
