export default function SingleMatches() {
  const matches = [
    { id: 1, team1: 'ARGENTINA', team2: 'AUSTRALIA', date: 'DEC 3', status: 'Available' },
    { id: 2, team1: 'JAPAN', team2: 'CROATIA', date: 'DEC 5', status: 'Limited' },
    { id: 3, team1: 'BRAZIL', team2: 'SOUTH KOREA', date: 'DEC 5', status: 'Available' },
    { id: 4, team1: 'FRANCE', team2: 'POLAND', date: 'DEC 4', status: 'Available' },
  ]

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-black gradient-text mb-4 uppercase">SINGLE MATCHES</h2>
        <p className="text-gray-700 mb-16 text-lg">Pick your favorite matches from the tournament</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {matches.map((match) => (
            <div key={match.id} className="glassmorphism p-6 hover:bg-white/25 transition-all">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-indigo-600 font-bold">{match.date}</span>
                <span className={`text-xs font-bold px-3 py-1 rounded ${match.status === 'Available' ? 'glassmorphism text-green-600' : 'glassmorphism text-amber-600'}`}>
                  {match.status}
                </span>
              </div>
              <div className="text-center mb-4">
                <p className="text-gray-800 font-bold text-lg">{match.team1} vs {match.team2}</p>
              </div>
              <button className="w-full glassmorphism text-indigo-600 font-bold py-2 hover:bg-white/30 transition-all">
                VIEW DETAILS
              </button>
            </div>
          ))}
        </div>

        <div className="glassmorphism p-8">
          <h3 className="text-3xl font-bold gradient-text mb-8">Why Choose Single Matches?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6">
              <h4 className="text-indigo-600 font-bold mb-3">Flexibility</h4>
              <p className="text-gray-700 text-sm leading-relaxed">Select exactly which matches you want to attend</p>
            </div>
            <div className="glass-card p-6">
              <h4 className="text-cyan-600 font-bold mb-3">Premium Seating</h4>
              <p className="text-gray-700 text-sm leading-relaxed">Best available seats with unobstructed views</p>
            </div>
            <div className="glass-card p-6">
              <h4 className="text-purple-600 font-bold mb-3">VIP Treatment</h4>
              <p className="text-gray-700 text-sm leading-relaxed">Full hospitality and concierge services included</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
