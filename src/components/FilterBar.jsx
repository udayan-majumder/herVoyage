const safetyOptions = [
  { value: 'all', label: 'Any safety level' },
  { value: '5', label: '5 (Excellent)' },
  { value: '4', label: '4 (Strong)' },
  { value: '3', label: '3 (Moderate)' },
]

const budgetOptions = [
  { value: 'all', label: 'Any budget' },
  { value: '$', label: '$ (Budget)' },
  { value: '$$', label: '$$ (Mid)' },
  { value: '$$$', label: '$$$ (Splurge)' },
]

function Select({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-black/20 focus:ring-4 focus:ring-black/5"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default function FilterBar({
  filters,
  regions,
  vibes,
  onChange,
  onReset,
}) {
  const regionOptions = [
    { value: 'all', label: 'Any region' },
    ...regions.map((r) => ({ value: r, label: r })),
  ]

  const vibeOptions = [
    { value: 'all', label: 'Any travel vibe' },
    ...vibes.map((v) => ({ value: v, label: v })),
  ]

  return (
    <div className="hv-card p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            label="Safety"
            value={filters.safety}
            onChange={(value) => onChange({ ...filters, safety: value })}
            options={safetyOptions}
          />
          <Select
            label="Region"
            value={filters.region}
            onChange={(value) => onChange({ ...filters, region: value })}
            options={regionOptions}
          />
          <Select
            label="Budget"
            value={filters.budget}
            onChange={(value) => onChange({ ...filters, budget: value })}
            options={budgetOptions}
          />
          <Select
            label="Travel vibe"
            value={filters.vibe}
            onChange={(value) => onChange({ ...filters, vibe: value })}
            options={vibeOptions}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

