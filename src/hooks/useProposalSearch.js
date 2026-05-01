import { useState, useEffect, useMemo } from 'react'

export function useProposalSearch() {
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    year: '',
    organization: '',
    difficulty: '',
    techStack: [],
    sortBy: 'latest',
  })

  useEffect(() => {
    fetch('/proposals-index.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load proposals')
        return res.json()
      })
      .then(data => {
        setProposals(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Derive unique filter options
  const filterOptions = useMemo(() => {
    const years = [...new Set(proposals.map(p => p.year))].sort((a, b) => b - a)
    const organizations = [...new Set(proposals.map(p => p.organization))].sort()
    const difficulties = ['Beginner', 'Intermediate', 'Advanced']
    const techStacks = [...new Set(proposals.flatMap(p => p.tech_stack || []))].sort()
    return { years, organizations, difficulties, techStacks }
  }, [proposals])

  // Filter and sort proposals
  const filteredProposals = useMemo(() => {
    let result = [...proposals]

    // Search filter
    if (filters.search) {
      const query = filters.search.toLowerCase()
      result = result.filter(p => {
        const titleMatch = p.project_title?.toLowerCase().includes(query)
        const descMatch = p.short_description?.toLowerCase().includes(query)
        const techMatch = (p.tech_stack || []).some(t => t.toLowerCase().includes(query))
        const orgMatch = p.organization?.toLowerCase().includes(query)
        return titleMatch || descMatch || techMatch || orgMatch
      })
    }

    // Year filter
    if (filters.year) {
      result = result.filter(p => p.year === Number(filters.year))
    }

    // Organization filter
    if (filters.organization) {
      result = result.filter(p => p.organization === filters.organization)
    }

    // Difficulty filter
    if (filters.difficulty) {
      result = result.filter(p => p.difficulty === filters.difficulty)
    }

    // Tech stack filter
    if (filters.techStack.length > 0) {
      result = result.filter(p =>
        filters.techStack.every(tech =>
          (p.tech_stack || []).includes(tech)
        )
      )
    }

    // Sorting
    switch (filters.sortBy) {
      case 'latest':
        result.sort((a, b) => b.year - a.year)
        break
      case 'oldest':
        result.sort((a, b) => a.year - b.year)
        break
      case 'alpha':
        result.sort((a, b) => a.project_title.localeCompare(b.project_title))
        break
      default:
        break
    }

    return result
  }, [proposals, filters])

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      year: '',
      organization: '',
      difficulty: '',
      techStack: [],
      sortBy: 'latest',
    })
  }

  const activeFilterCount = [
    filters.year,
    filters.organization,
    filters.difficulty,
    filters.techStack.length > 0,
  ].filter(Boolean).length

  return {
    proposals: filteredProposals,
    allProposals: proposals,
    loading,
    error,
    filters,
    filterOptions,
    updateFilter,
    clearFilters,
    activeFilterCount,
  }
}
