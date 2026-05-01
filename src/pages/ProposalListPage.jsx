import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProposalSearch } from '../hooks/useProposalSearch'
import FilterPanel from '../components/FilterPanel'
import ProposalCard from '../components/ProposalCard'

function ProposalListPage() {
  const [searchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const {
    proposals,
    allProposals,
    loading,
    filters,
    filterOptions,
    updateFilter,
    clearFilters,
    activeFilterCount,
  } = useProposalSearch()

  // Apply URL params on mount
  useEffect(() => {
    const search = searchParams.get('search')
    const year = searchParams.get('year')
    const tech = searchParams.get('tech')
    if (search) updateFilter('search', search)
    if (year) updateFilter('year', year)
    if (tech) updateFilter('techStack', [tech])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="pt-20 pb-16 min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 pt-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">Browse Proposals</h1>
          <p className="text-slate-400 text-sm">
            {loading
              ? 'Loading proposals...'
              : `Showing ${proposals.length} of ${allProposals.length} proposals`}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                filters={filters}
                filterOptions={filterOptions}
                updateFilter={updateFilter}
                clearFilters={clearFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>
          </aside>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden fixed bottom-6 right-6 z-40">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/30"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Filter Panel */}
          {filtersOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl overflow-y-auto p-6 pt-20 animate-fade-in">
              <button
                onClick={() => setFiltersOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <FilterPanel
                filters={filters}
                filterOptions={filterOptions}
                updateFilter={(k, v) => { updateFilter(k, v); }}
                clearFilters={() => { clearFilters(); setFiltersOpen(false); }}
                activeFilterCount={activeFilterCount}
              />
              <button
                onClick={() => setFiltersOpen(false)}
                className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold text-sm"
              >
                Show {proposals.length} Results
              </button>
            </div>
          )}

          {/* Proposal Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="glass-card p-6 animate-pulse">
                    <div className="h-5 bg-slate-700/50 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-slate-700/30 rounded w-1/2 mb-4"></div>
                    <div className="h-12 bg-slate-700/20 rounded mb-4"></div>
                    <div className="h-6 bg-slate-700/20 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : proposals.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/60 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-300 mb-2">No proposals found</h3>
                <p className="text-slate-500 text-sm mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {proposals.map((proposal, i) => (
                  <ProposalCard
                    key={`${proposal.yearSlug}-${proposal.orgSlug}-${proposal.projectSlug}`}
                    proposal={proposal}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProposalListPage
