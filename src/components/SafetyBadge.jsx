const levelToLabel = (level) => {
  if (level >= 5) return 'Excellent'
  if (level === 4) return 'Strong'
  if (level === 3) return 'Moderate'
  if (level === 2) return 'Caution'
  return 'High Caution'
}

const levelToClasses = (level) => {
  if (level >= 5) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (level === 4) return 'bg-teal-50 text-teal-700 border-teal-200'
  if (level === 3) return 'bg-amber-50 text-amber-800 border-amber-200'
  if (level === 2) return 'bg-orange-50 text-orange-800 border-orange-200'
  return 'bg-rose-50 text-rose-800 border-rose-200'
}

export default function SafetyBadge({ level = 3, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${levelToClasses(
        level,
      )} ${className}`}
      title={`Safety rating: ${level}/5`}
    >
      <span className="inline-block h-2 w-2 rounded-full bg-current opacity-70" />
      Safety: {level}/5 • {levelToLabel(level)}
    </span>
  )
}

