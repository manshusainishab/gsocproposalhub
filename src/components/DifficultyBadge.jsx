function DifficultyBadge({ difficulty, size = 'sm' }) {
  const map = {
    Easy: { cls: 'badge-easy', label: 'Easy' },
    Medium: { cls: 'badge-medium', label: 'Medium' },
    Hard: { cls: 'badge-hard', label: 'Hard' },
    Beginner: { cls: 'badge-easy', label: 'Beginner' },
    Intermediate: { cls: 'badge-medium', label: 'Intermediate' },
    Advanced: { cls: 'badge-hard', label: 'Advanced' },
  }

  const d = map[difficulty] || {
    cls: 'bg-gray-100 text-gray-500 border border-gray-200',
    label: difficulty || 'Unknown',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold tracking-wide text-xs ${d.cls} ${
        size === 'md' ? 'px-3 py-1' : 'px-2.5 py-0.5'
      }`}
    >
      {d.label}
    </span>
  )
}

export default DifficultyBadge
