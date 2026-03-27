const navItems = [
  { key: 'home', label: 'Home' },
  { key: 'explore', label: 'Explore' },
  { key: 'tips', label: 'Safety Tips' },
  { key: 'about', label: 'About' },
]

function NavButton({ isActive, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        isActive
          ? 'bg-white/80 text-slate-900 shadow-sm ring-1 ring-black/5'
          : 'text-slate-700 hover:bg-white/60 hover:text-slate-900'
      }`}
    >
      {children}
    </button>
  )
}

export default function Navbar({ activeSection, onNavigate }) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-[rgba(251,246,239,0.7)] backdrop-blur">
      <div className="hv-container">
        <div className="flex items-center justify-between py-4">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="group flex items-center gap-3"
          >
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/80 ring-1 ring-black/5 transition group-hover:shadow-sm">
              <span className="text-lg font-black tracking-tight">H</span>
            </div>
            <div className="text-left leading-tight">
              <div className="text-sm font-extrabold tracking-tight text-slate-900">
                HerVoyage Co.
              </div>
              <div className="text-xs text-slate-600">
                Safe journeys for solo female travelers
              </div>
            </div>
          </button>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <NavButton
                key={item.key}
                isActive={activeSection === item.key}
                onClick={() => onNavigate(item.key)}
              >
                {item.label}
              </NavButton>
            ))}
          </nav>

          <div className="md:hidden">
            <select
              className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm"
              value={activeSection}
              onChange={(e) => onNavigate(e.target.value)}
              aria-label="Navigate sections"
            >
              {navItems.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  )
}

