function TechTag({ tech, size = 'sm' }) {
  return (
    <span className={`tech-tag ${size === 'md' ? 'px-3 py-1 text-xs' : ''}`}>
      {tech}
    </span>
  )
}

export default TechTag
