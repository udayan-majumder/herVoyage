export default function ItineraryCard({ day, title, items }) {
  return (
    <div className="hv-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Day {day}
          </div>
          <div className="mt-1 text-base font-extrabold tracking-tight text-slate-900">
            {title}
          </div>
        </div>
      </div>

      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
        {(items || []).map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  )
}

