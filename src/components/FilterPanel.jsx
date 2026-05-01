import SearchBar from './SearchBar'

function FilterPanel({ filters, filterOptions, updateFilter, clearFilters, activeFilterCount }) {
  return (
    <div className="space-y-6">
      <SearchBar
        value={filters.search}
        onChange={(val) => updateFilter('search', val)}
        placeholder="Search by title, tech, org..."
      />

      {/* Sort */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Sort By</label>
        <select
          value={filters.sortBy}
          onChange={(e) => updateFilter('sortBy', e.target.value)}
          className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700/50 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer"
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
          <option value="alpha">Alphabetical</option>
        </select>
      </div>

      {/* Year */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Year</label>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip label="All" active={!filters.year} onClick={() => updateFilter('year', '')} />
          {filterOptions.years.map(y => (
            <FilterChip key={y} label={y} active={filters.year === String(y)} onClick={() => updateFilter('year', String(y))} />
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Difficulty</label>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip label="All" active={!filters.difficulty} onClick={() => updateFilter('difficulty', '')} />
          {filterOptions.difficulties.map(d => (
            <FilterChip key={d} label={d} active={filters.difficulty === d} onClick={() => updateFilter('difficulty', d)} />
          ))}
        </div>
      </div>

      {/* Organization */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Organization</label>
        <select
          value={filters.organization}
          onChange={(e) => updateFilter('organization', e.target.value)}
          className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700/50 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer"
        >
          <option value="">All Organizations</option>
          {filterOptions.organizations.map(org => (
            <option key={org} value={org}>{org}</option>
          ))}
        </select>
      </div>

      {/* Tech Stack */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tech Stack</label>
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
          {filterOptions.techStacks.map(tech => (
            <FilterChip
              key={tech}
              label={tech}
              active={filters.techStack.includes(tech)}
              onClick={() => {
                const newStack = filters.techStack.includes(tech)
                  ? filters.techStack.filter(t => t !== tech)
                  : [...filters.techStack, tech]
                updateFilter('techStack', newStack)
              }}
            />
          ))}
        </div>
      </div>

      {/* Clear */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full py-2.5 text-sm font-medium text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 border border-slate-700/30 rounded-lg transition-all"
        >
          Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
        </button>
      )}
    </div>
  )
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        active
          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
          : 'bg-slate-800/40 text-slate-400 border border-slate-700/30 hover:text-slate-300 hover:border-slate-600/40'
      }`}
    >
      {label}
    </button>
  )
}

export default FilterPanel
