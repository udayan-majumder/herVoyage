export default function TipsCard({ title, items }) {
  return (
    <div className="hv-card p-5">
      <div className="text-base font-extrabold tracking-tight text-slate-900">
        {title}
      </div>
      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-700">
        {(items || []).map((tip) => (
          <li key={tip} className="flex gap-3">
            <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-slate-900/70" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

