function DifficultyBadge({ difficulty, size = "sm" }) {
  const config = {
    Beginner: {
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      border: 'border-emerald-500/25',
      dot: 'bg-emerald-400',
    },
    Intermediate: {
      bg: 'bg-amber-500/15',
      text: 'text-amber-400',
      border: 'border-amber-500/25',
      dot: 'bg-amber-400',
    },
    Advanced: {
      bg: 'bg-rose-500/15',
      text: 'text-rose-400',
      border: 'border-rose-500/25',
      dot: 'bg-rose-400',
    },
  }

  const style = config[difficulty] || config.Beginner
  const sizeClass = size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1'

  return (
    <span className={`inline-flex items-center gap-1.5 ${sizeClass} rounded-full font-medium ${style.bg} ${style.text} border ${style.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
      {difficulty}
    </span>
  )
}

export default DifficultyBadge
