import { Link } from 'react-router-dom'
import DifficultyBadge from './DifficultyBadge'

function ProposalCard({ proposal, index = 0, orgImage }) {
  const {
    project_title, organization, year, difficulty,
    tech_stack, short_description,
    yearSlug, orgSlug, projectSlug,
  } = proposal

  return (
    <Link
      to={`/${orgSlug}/proposals/${yearSlug}/${projectSlug}`}
      className="proposal-card group p-4"
      style={{ animationDelay: `${Math.min(index * 0.04, 0.5)}s` }}
      id={`proposal-card-${yearSlug}-${orgSlug}-${projectSlug}`}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          {orgImage ? (
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center flex-shrink-0">
              <img
                src={orgImage}
                alt={organization}
                className="w-full h-full object-contain p-0.5"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
          ) : (
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#e0e7ff,#ddd6fe)' }}
            >
              <span className="text-xs font-bold text-indigo-600">{organization?.charAt(0)}</span>
            </div>
          )}
          <span className="text-xs text-gray-500 font-medium truncate">{organization}</span>
        </div>
        <span className={`year-pill year-${year} flex-shrink-0`}>{year}</span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-700 transition-colors leading-snug line-clamp-2 mb-2">
        {project_title}
      </h3>

      {/* Description */}
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3 flex-1">
        {short_description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-gray-100">
        <DifficultyBadge difficulty={difficulty} />
        <div className="flex flex-wrap gap-1 justify-end">
          {(tech_stack || []).slice(0, 3).map((t) => (
            <span key={t} className="tech-tag">{t}</span>
          ))}
          {(tech_stack || []).length > 3 && (
            <span className="text-[10px] text-gray-400 self-center">+{tech_stack.length - 3}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProposalCard
