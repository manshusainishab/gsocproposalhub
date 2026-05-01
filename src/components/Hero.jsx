import { Link } from 'react-router-dom'

function Hero({ totalProposals, totalOrgs, totalYears }) {
  return (
    <section className="hero-gradient grid-pattern relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-500/8 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Open Source Archive
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in-up">
            Learn from{' '}
            <span className="gradient-text">Winning GSoC</span>
            <br />Proposals
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Browse a curated archive of accepted Google Summer of Code proposals.
            Search, filter, and learn from the best to craft your own winning submission.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link
              to="/proposals"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all"
            >
              Browse Proposals
            </Link>
            <a
              href="https://github.com/manshusainishab/gsocproposalhub/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 font-semibold text-sm hover:bg-slate-800 hover:border-slate-600 hover:text-white transition-all"
            >
              Submit Yours →
            </a>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 sm:gap-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <StatItem value={totalProposals} label="Proposals" />
            <div className="w-px h-10 bg-slate-800"></div>
            <StatItem value={totalOrgs} label="Organizations" />
            <div className="w-px h-10 bg-slate-800"></div>
            <StatItem value={totalYears} label="Years" />
          </div>
        </div>
      </div>
    </section>
  )
}

function StatItem({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-2xl sm:text-3xl font-bold gradient-text">{value}</div>
      <div className="text-xs sm:text-sm text-slate-500 mt-1">{label}</div>
    </div>
  )
}

export default Hero
