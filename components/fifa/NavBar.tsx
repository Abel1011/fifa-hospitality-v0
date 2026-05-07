export default function NavBar() {
  const categories = [
    { label: 'ONLINE', color: 'from-indigo-500/30 to-indigo-400/30' },
    { label: 'VENUE', color: 'from-cyan-500/30 to-cyan-400/30' },
    { label: 'VIP', color: 'from-purple-500/30 to-purple-400/30' },
    { label: 'PRIVATE SUITES', color: 'from-pink-500/30 to-pink-400/30' },
    { label: 'PACKAGES', color: 'from-amber-500/30 to-amber-400/30' },
    { label: 'HOSPITALITY', color: 'from-emerald-500/30 to-emerald-400/30' },
  ]

  return (
    <section className="backdrop-blur-md bg-white/5 py-8 px-4 border-b border-white/20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
          {categories.map((category) => (
            <button
              key={category.label}
              className={`glass-card px-6 py-3 text-sm font-bold text-gray-800 hover:bg-white/20 transition-all bg-gradient-to-br ${category.color}`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
