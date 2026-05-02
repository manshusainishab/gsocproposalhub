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
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => updateFilter('sortBy', e.target.value)}
          className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 appearance-none cursor-pointer shadow-sm"
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
          <option value="alpha">Alphabetical</option>
        </select>
      </div>

      {/* Year */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Year
        </label>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip label="All" active={!filters.year} onClick={() => updateFilter('year', '')} />
          {filterOptions.years.map((y) => (
            <FilterChip
              key={y}
              label={y}
              active={filters.year === String(y)}
              onClick={() => updateFilter('year', String(y))}
            />
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Difficulty
        </label>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip label="All" active={!filters.difficulty} onClick={() => updateFilter('difficulty', '')} />
          {filterOptions.difficulties.map((d) => (
            <FilterChip
              key={d}
              label={d}
              active={filters.difficulty === d}
              onClick={() => updateFilter('difficulty', d)}
            />
          ))}
        </div>
      </div>

      {/* Organization */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Organization
        </label>
        <select
          value={filters.organization}
          onChange={(e) => updateFilter('organization', e.target.value)}
          className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 appearance-none cursor-pointer shadow-sm"
        >
          <option value="">All Organizations</option>
          {filterOptions.organizations.map((org) => (
            <option key={org} value={org}>{org}</option>
          ))}
        </select>
      </div>

      {/* Tech Stack */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Tech Stack
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
          {filterOptions.techStacks.map((tech) => (
            <FilterChip
              key={tech}
              label={tech}
              active={filters.techStack.includes(tech)}
              onClick={() => {
                const newStack = filters.techStack.includes(tech)
                  ? filters.techStack.filter((t) => t !== tech)
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
          className="w-full py-2.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all"
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
      className={`filter-chip ${active ? 'active' : ''}`}
    >
      {label}
    </button>
  )
}

export default FilterPanel
