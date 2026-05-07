export default function AdditionalOfferings() {
  const offerings = [
    {
      title: 'PLATFORM ACCESS',
      description: 'Real-time match analytics, exclusive behind-the-scenes content, and interactive fan engagement.',
      icon: '📱',
    },
    {
      title: 'ACCOMMODATION',
      description: 'Luxury hotel packages at partner properties near stadium venues with special rates.',
      icon: '🏨',
    },
  ]

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-black gradient-text mb-16 uppercase">ADDITIONAL OFFERINGS</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {offerings.map((offering, idx) => (
            <div key={idx} className="glassmorphism overflow-hidden hover:bg-white/25 transition-all group">
              <div className="bg-gradient-to-r from-indigo-400/30 to-cyan-400/30 p-8 text-center group-hover:from-indigo-400/40 group-hover:to-cyan-400/40 transition-all">
                <span className="text-7xl group-hover:scale-110 transition-transform inline-block">{offering.icon}</span>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold gradient-text mb-4">{offering.title}</h3>
                <p className="text-gray-700 leading-relaxed">{offering.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="glassmorphism p-8">
          <h3 className="text-3xl font-bold gradient-text mb-8">Premium Services Available</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-6">
              <h4 className="text-indigo-600 font-bold mb-3 text-lg">Transportation</h4>
              <p className="text-gray-700 text-sm leading-relaxed">Premium ground transportation from airport to venue and accommodations</p>
            </div>
            <div className="glass-card p-6">
              <h4 className="text-cyan-600 font-bold mb-3 text-lg">Dining Experiences</h4>
              <p className="text-gray-700 text-sm leading-relaxed">Exclusive restaurant partnerships and gourmet catering services</p>
            </div>
            <div className="glass-card p-6">
              <h4 className="text-purple-600 font-bold mb-3 text-lg">Guided Tours</h4>
              <p className="text-gray-700 text-sm leading-relaxed">Explore stadiums and local attractions with expert guides</p>
            </div>
            <div className="glass-card p-6">
              <h4 className="text-pink-600 font-bold mb-3 text-lg">Merchandise</h4>
              <p className="text-gray-700 text-sm leading-relaxed">Exclusive World Cup memorabilia and official products</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
