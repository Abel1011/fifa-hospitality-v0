export default function PrivateSuites() {
  return (
    <section className="py-20 px-4 border-y border-white/20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-black gradient-text mb-4 uppercase">PRIVATE SUITES</h2>
        <p className="text-gray-700 mb-16 text-lg">Exclusive VIP suites for an unforgettable experience</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="glassmorphism p-6 hover:bg-white/25 transition-all">
              <h3 className="text-2xl font-bold text-purple-600 mb-4">PLATINUM SUITE</h3>
              <p className="text-gray-700 mb-4">Our most exclusive offering. Up to 20 guests with the best seats in the stadium.</p>
              <ul className="space-y-2">
                <li className="text-indigo-600 font-medium">✓ Premium seating for up to 20 people</li>
                <li className="text-indigo-600 font-medium">✓ Private reception area</li>
                <li className="text-indigo-600 font-medium">✓ Gourmet catering & premium beverages</li>
                <li className="text-indigo-600 font-medium">✓ Personal concierge service</li>
              </ul>
            </div>

            <div className="glassmorphism p-6 hover:bg-white/25 transition-all">
              <h3 className="text-2xl font-bold text-cyan-600 mb-4">GOLD SUITE</h3>
              <p className="text-gray-700 mb-4">Premium comfort with excellent sightlines for up to 12 guests.</p>
              <ul className="space-y-2">
                <li className="text-indigo-600 font-medium">✓ Premium seating for up to 12 people</li>
                <li className="text-indigo-600 font-medium">✓ Lounge access with refreshments</li>
                <li className="text-indigo-600 font-medium">✓ Catering service available</li>
                <li className="text-indigo-600 font-medium">✓ Dedicated attendant</li>
              </ul>
            </div>
          </div>

          <div className="glassmorphism p-8">
            <div className="aspect-video bg-white/10 rounded-lg flex items-center justify-center mb-6 border border-white/20">
              <span className="text-6xl">🏟️</span>
            </div>
            <h3 className="text-3xl font-bold gradient-text mb-6">Suite Amenities</h3>
            <div className="space-y-4 mb-8">
              <p className="text-gray-700 leading-relaxed">Every suite includes premium seating, climate control, and access to exclusive lounges with gourmet dining options and premium beverage selection.</p>
              <p className="text-gray-700 leading-relaxed">Perfect for corporate entertaining, family gatherings, or rewarding your best clients.</p>
            </div>
            <button className="w-full glassmorphism text-purple-600 font-bold py-3 hover:bg-white/30 transition-all">
              RESERVE SUITE
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
