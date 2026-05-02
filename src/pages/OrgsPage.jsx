import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import OrgCard from '../components/OrgCard'

const ORG_SOURCE = '/orgs-index.json'

// All years GSoC has run (that we care about)
const ALL_YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018]

function OrgsPage() {
  const [orgs, setOrgs] = useState([])
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)

  // Filter state
  const [search, setSearch] = useState('')
  const [techSearch, setTechSearch] = useState('')
  const [selectedYears, setSelectedYears] = useState([])
  const [selectedTechs, setSelectedTechs] = useState([])

  useEffect(() => {
    Promise.all([
      fetch(ORG_SOURCE).then((r) => r.json()).catch(() => []),
      fetch('/proposals-index.json').then((r) => r.json()).catch(() => []),
    ]).then(([orgData, props]) => {
      setOrgs(orgData)
      setProposals(props)
      setLoading(false)
    })
  }, [])

  // Build per-org metadata from proposals
  const orgMeta = useMemo(() => {
    const meta = {}
    proposals.forEach((p) => {
      if (!meta[p.organization]) {
        meta[p.organization] = { years: new Set(), techs: new Set() }
      }
      if (p.year) meta[p.organization].years.add(p.year)
      ;(p.tech_stack || []).forEach((t) => meta[p.organization].techs.add(t))
    })
    // Convert sets to sorted arrays
    Object.keys(meta).forEach((k) => {
      meta[k].years = [...meta[k].years].sort((a, b) => b - a)
      meta[k].techs = [...meta[k].techs].sort()
    })
    return meta
  }, [proposals])

  // All unique tech tags across all proposals, sorted by frequency
  const allTechs = useMemo(() => {
    const counts = {}
    proposals.forEach((p) =>
      (p.tech_stack || []).forEach((t) => { counts[t] = (counts[t] || 0) + 1 })
    )
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([t]) => t)
  }, [proposals])

  const filteredTechs = useMemo(
    () => allTechs.filter((t) => t.toLowerCase().includes(techSearch.toLowerCase())),
    [allTechs, techSearch]
  )

  // Year counts — how many orgs appeared in each year
  const yearCounts = useMemo(() => {
    const counts = {}
    orgs.forEach((org) => {
      ;(org.years || []).forEach((y) => { counts[y] = (counts[y] || 0) + 1 })
    })
    return counts
  }, [orgs])

  // Filtered org list
  const filteredOrgs = useMemo(() => {
    const q = search.toLowerCase().trim()
    return orgs.filter((org) => {
      if (q && !org.name.toLowerCase().includes(q) && !org.desc?.toLowerCase().includes(q)) {
        return false
      }
      if (selectedYears.length > 0) {
        const orgYears = org.years || orgMeta[org.name]?.years || []
        if (!selectedYears.some((y) => orgYears.includes(y))) return false
      }
      if (selectedTechs.length > 0) {
        const orgTechs = orgMeta[org.name]?.techs || []
        if (!selectedTechs.some((t) => orgTechs.includes(t))) return false
      }
      return true
    })
  }, [orgs, search, selectedYears, selectedTechs, orgMeta])

  const toggleYear = (y) =>
    setSelectedYears((prev) =>
      prev.includes(y) ? prev.filter((x) => x !== y) : [...prev, y]
    )

  const toggleTech = (t) =>
    setSelectedTechs((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    )

  const clearAll = () => {
    setSearch('')
    setSelectedYears([])
    setSelectedTechs([])
    setTechSearch('')
  }

  const hasFilters = search || selectedYears.length > 0 || selectedTechs.length > 0

  return (
    <div className="flex" style={{ minHeight: 'calc(100vh - 57px)' }}>
      {/* ══════════════════════════════════
          SIDEBAR
          ══════════════════════════════════ */}
      <aside className="sidebar hidden md:flex flex-col">
        {/* Brand + Clear */}
        <div className="sidebar-section">
          <div className="flex items-center justify-between pt-2 mb-1">
            <span className="font-bold text-sm text-gray-900">GSoC Organizations</span>
          </div>
          {hasFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Years */}
        <div className="sidebar-section">
          <div className="sidebar-title">Years</div>
          {ALL_YEARS.map((y) => (
            <div key={y} className="sidebar-item">
              <input
                type="checkbox"
                id={`year-${y}`}
                checked={selectedYears.includes(y)}
                onChange={() => toggleYear(y)}
              />
              <label htmlFor={`year-${y}`}>
                <span>{y}</span>
                {yearCounts[y] > 0 && (
                  <span className="count">({yearCounts[y]})</span>
                )}
              </label>
            </div>
          ))}
        </div>

        {/* Technologies */}
        {allTechs.length > 0 && (
          <div className="sidebar-section">
            <div className="sidebar-title">Technologies</div>
            <input
              type="text"
              placeholder="Search technologies..."
              value={techSearch}
              onChange={(e) => setTechSearch(e.target.value)}
              className="sidebar-search"
            />
            <div style={{ maxHeight: 220, overflowY: 'auto' }}>
              {filteredTechs.slice(0, 60).map((t) => (
                <div key={t} className="sidebar-item">
                  <input
                    type="checkbox"
                    id={`tech-${t}`}
                    checked={selectedTechs.includes(t)}
                    onChange={() => toggleTech(t)}
                  />
                  <label htmlFor={`tech-${t}`}>
                    <span>{t}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* ══════════════════════════════════
          MAIN CONTENT
          ══════════════════════════════════ */}
      <div className="flex-1 min-w-0 p-6">
        {/* Top search + count */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search organizations..."
              className="top-search"
              id="org-search-input"
            />
          </div>

          {!loading && (
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="result-badge">
                {filteredOrgs.length} result{filteredOrgs.length !== 1 ? 's' : ''}
              </span>
              <Link
                to="/how-to-add"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Add Proposal
              </Link>
            </div>
          )}

          {/* Mobile filter toggle */}
          <button
            className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
            onClick={() => {/* TODO: mobile drawer */}}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {(selectedYears.length + selectedTechs.length) > 0 && (
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                {selectedYears.length + selectedTechs.length}
              </span>
            )}
          </button>
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-5">
            {selectedYears.map((y) => (
              <FilterChip key={`y-${y}`} label={`Year: ${y}`} onRemove={() => toggleYear(y)} />
            ))}
            {selectedTechs.map((t) => (
              <FilterChip key={`t-${t}`} label={t} onRemove={() => toggleTech(t)} />
            ))}
            {search && (
              <FilterChip label={`"${search}"`} onRemove={() => setSearch('')} />
            )}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="org-card">
                <div className="org-card-logo">
                  <div className="skeleton w-16 h-16 rounded-xl" />
                </div>
                <div className="p-3 flex flex-col gap-2">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-full" />
                  <div className="skeleton h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredOrgs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-700 mb-1">No organizations found</h3>
            <p className="text-gray-400 text-sm mb-4">Try a different search or remove filters</p>
            <button
              onClick={clearAll}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredOrgs.map((org, i) => (
              <OrgCard
                key={org.name}
                org={org}
                index={i}
                years={orgMeta[org.name]?.years || []}
                techTags={orgMeta[org.name]?.techs || []}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-medium">
      {label}
      <button
        onClick={onRemove}
        className="w-3.5 h-3.5 rounded-full bg-indigo-200 hover:bg-indigo-300 flex items-center justify-center transition-colors"
      >
        <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  )
}

export default OrgsPage
