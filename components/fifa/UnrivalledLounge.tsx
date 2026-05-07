export default function UnrivalledLounge() {
  const features = [
    { title: 'VIP Lounge Access', description: 'Exclusive lounges with premium seating and amenities' },
    { title: 'Gourmet Dining', description: 'World-class culinary experiences before and after matches' },
    { title: 'Premium Beverages', description: 'Curated selection of fine wines, spirits, and craft beverages' },
    { title: 'Concierge Service', description: '24/7 support for all your needs during the tournament' },
  ]

  return (
    <section className="py-20 px-4 border-y border-white/20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-black gradient-text mb-4 uppercase">UNRIVALLED LOUNGE ACCESS</h2>
        <p className="text-gray-700 mb-16 text-lg">Experience luxury hospitality like never before</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            {features.map((feature, idx) => (
              <div key={idx} className="glassmorphism p-6 hover:bg-white/25 transition-all">
                <h3 className="text-xl font-bold text-amber-600 mb-3">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="glassmorphism p-8">
              <div className="aspect-video bg-white/10 rounded-lg flex items-center justify-center mb-6 border border-white/20">
                <span className="text-6xl">🍾</span>
              </div>
              <h3 className="text-3xl font-bold gradient-text mb-6">Exclusive Member Benefits</h3>
              <ul className="space-y-3 mb-8">
                <li className="text-indigo-600 font-medium">✓ Priority booking on all packages</li>
                <li className="text-indigo-600 font-medium">✓ Exclusive member events and networking</li>
                <li className="text-indigo-600 font-medium">✓ Special discounts on upgrades</li>
                <li className="text-indigo-600 font-medium">✓ Dedicated account manager</li>
              </ul>
              <button className="w-full glassmorphism text-amber-600 font-bold py-3 hover:bg-white/30 transition-all">
                BECOME A MEMBER
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
