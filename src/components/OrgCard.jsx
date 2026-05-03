import { Link } from 'react-router-dom'

/**
 * OrgCard — matches gsocorganizations.dev card style.
 * Large logo area on top, name, desc, year pills, tech tags.
 */
function OrgCard({ org, years = [], techTags = [], index = 0 }) {
  const { name, desc, img } = org

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return (
    <Link
      to={`/${slug}/proposals`}
      className="org-card group"
      style={{ animationDelay: `${Math.min(index * 0.03, 0.5)}s` }}
      id={`org-card-${slug}`}
    >
      {/* ── Logo Area ── */}
      <div className="org-card-logo">
        {img ? (
          <img
            src={img}
            alt={`${name} logo`}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.parentNode.innerHTML = `
                <div style="width:64px;height:64px;border-radius:12px;background:linear-gradient(135deg,#e0e7ff,#ddd6fe);display:flex;align-items:center;justify-content:center;">
                  <span style="font-size:1.6rem;font-weight:800;color:#6366f1">${name.charAt(0)}</span>
                </div>`
            }}
          />
        ) : (
          <div style={{
            width: 64, height: 64, borderRadius: 12,
            background: 'linear-gradient(135deg,#e0e7ff,#ddd6fe)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#6366f1' }}>
              {name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        {/* Name */}
        <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-700 transition-colors leading-snug line-clamp-2">
          {name}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 flex-1">
          {desc}
        </p>

        {/* Year pills */}
        {years.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-1">
            {years.slice(0, 4).map((y) => (
              <span key={y} className={`year-pill year-${y}`}>
                {y}
              </span>
            ))}
            {years.length > 4 && (
              <span className="text-[10px] text-gray-400 self-center">+{years.length - 4}</span>
            )}
          </div>
        )}

        {/* Tech tags */}
        {techTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {techTags.slice(0, 3).map((t) => (
              <span key={t} className="tech-tag">{t}</span>
            ))}
            {techTags.length > 3 && (
              <span className="text-[10px] text-gray-400 self-center">+{techTags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

export default OrgCard
