export default function AboutSection() {
  return (
    <section className="hv-container py-10 sm:py-14">
      <div className="hv-card p-8">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          About HerVoyage Co.
        </h2>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <div className="text-sm font-extrabold text-slate-900">Mission</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Help solo female travelers feel confident choosing destinations,
              planning simple days, and staying safe—without information
              overload.
            </p>
          </div>

          <div>
            <div className="text-sm font-extrabold text-slate-900">
              What you’ll find here
            </div>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
              <li>City overviews with a clear safety rating</li>
              <li>Beginner-friendly 3-day itineraries</li>
              <li>Practical safety checklists and essentials</li>
              <li>Clean design that’s easy for non-technical users</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-black/10 bg-white/70 p-5 text-sm text-slate-700">
          This is a simple single-page app using static JSON data (no accounts,
          no maps, no paid APIs).
        </div>
      </div>
    </section>
  )
}

