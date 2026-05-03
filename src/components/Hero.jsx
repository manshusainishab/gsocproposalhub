import { Link } from 'react-router-dom'

function Hero({ totalProposals, totalOrgs, totalYears }) {
  return (
    <section className="hero-gradient grid-pattern relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Soft floating blobs */}
      <div className="absolute top-16 left-8 w-80 h-80 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-medium mb-6 animate-fade-in shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Open Source Proposal Archive
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-slate-900 animate-fade-in-up tracking-tight">
            Learn from{' '}
            <span className="gradient-text">Winning GSoC</span>
            <br />Proposals
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 animate-fade-in-up leading-relaxed"
            style={{ animationDelay: '0.1s' }}
          >
            Browse a curated archive of accepted Google Summer of Code proposals.
            Search, filter, and learn from the best to craft your own winning submission.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            <Link
              to="/proposals"
              className="px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 hover:scale-[1.02] transition-all"
            >
              Browse Proposals
            </Link>
            <a
              href="https://github.com/manshusainishab/gsocproposalhub/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-semibold text-sm hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-all shadow-sm"
            >
              Submit Yours →
            </a>
          </div>

          {/* Stats pills */}
          <div
            className="flex flex-wrap items-center justify-center gap-3 animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            <StatPill value={totalProposals} label="Proposals" color="indigo" />
            <StatPill value={totalOrgs} label="Organizations" color="violet" />
            <StatPill value={totalYears} label="Years" color="emerald" />
          </div>
        </div>
      </div>
    </section>
  )
}

function StatPill({ value, label, color }) {
  const colors = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-400' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-400' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  }
  const c = colors[color] || colors.indigo
  return (
    <div className={`stat-pill ${c.bg}`}>
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      <span className={`text-2xl font-bold ${c.text}`}>{value ?? '—'}</span>
      <span className="text-slate-500 text-sm">{label}</span>
    </div>
  )
}

export default Hero
