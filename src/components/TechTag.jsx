function TechTag({ tech, onClick, active = false, size = "sm" }) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
  
  const baseClass = `inline-flex items-center ${sizeClass} rounded-md font-medium transition-all`
  const interactiveClass = onClick ? 'cursor-pointer' : ''
  const colorClass = active
    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
    : 'bg-slate-800/60 text-slate-400 border border-slate-700/40 hover:text-slate-300 hover:border-slate-600/50'

  return (
    <span
      className={`${baseClass} ${colorClass} ${interactiveClass}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {tech}
    </span>
  )
}

export default TechTag
