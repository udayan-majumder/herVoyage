import TipsCard from '../components/TipsCard.jsx'
import tips from '../data/safetyTips.json'

export default function SafetyTipsSection() {
  return (
    <section className="hv-container py-10 sm:py-14">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Safety tips
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-700">
          A universal checklist you can reuse for any trip. Keep it simple:
          prepare well, stay aware, and choose options that make you feel calm.
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <TipsCard title="Universal safety checklist" items={tips.universalChecklist} />
        <TipsCard title="Emergency tips" items={tips.emergencyTips} />
        <TipsCard title="Travel essentials" items={tips.travelEssentials} />
      </div>
    </section>
  )
}

