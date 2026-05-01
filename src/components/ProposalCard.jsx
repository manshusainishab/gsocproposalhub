import { Link } from 'react-router-dom'
import DifficultyBadge from './DifficultyBadge'
import TechTag from './TechTag'

function ProposalCard({ proposal, index = 0 }) {
  const { project_title, organization, year, difficulty, tech_stack, short_description, yearSlug, orgSlug, projectSlug } = proposal

  return (
    <Link
      to={`/proposals/${yearSlug}/${orgSlug}/${projectSlug}`}
      className="glass-card block p-6 group"
      style={{ animationDelay: `${index * 0.05}s` }}
      id={`proposal-card-${yearSlug}-${orgSlug}-${projectSlug}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="flex-1 min-w-0 text-base font-semibold text-slate-100 group-hover:text-white transition-colors leading-snug line-clamp-2">
          {project_title}
        </h3>
        <span className="shrink-0 text-xs font-mono text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded">{year}</span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center">
          <span className="text-[10px] font-bold text-indigo-400">{organization?.charAt(0)}</span>
        </div>
        <span className="text-sm text-slate-400">{organization}</span>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-2">{short_description}</p>
      <div className="flex items-center justify-between gap-3">
        <DifficultyBadge difficulty={difficulty} />
        <div className="flex flex-wrap gap-1 justify-end">
          {(tech_stack || []).slice(0, 3).map(tech => (
            <TechTag key={tech} tech={tech} />
          ))}
          {(tech_stack || []).length > 3 && (
            <span className="text-xs text-slate-500 self-center">+{tech_stack.length - 3}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProposalCard
