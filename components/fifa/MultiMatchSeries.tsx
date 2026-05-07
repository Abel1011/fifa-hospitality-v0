export default function MultiMatchSeries() {
  return (
    <section className="py-20 px-4 border-y border-white/20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-black gradient-text mb-4 uppercase">MULTI-MATCH SERIES</h2>
        <p className="text-gray-700 mb-16 text-lg">Follow the tournament with our comprehensive packages</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="space-y-6">
              <div className="glassmorphism p-6 hover:bg-white/25 transition-all">
                <h3 className="text-2xl font-bold text-indigo-600 mb-3">Group Stage Package</h3>
                <p className="text-gray-700">Attend all group stage matches at your selected venue. Experience the intensity of early tournament play.</p>
              </div>
              <div className="glassmorphism p-6 hover:bg-white/25 transition-all">
                <h3 className="text-2xl font-bold text-cyan-600 mb-3">Round of 16 Package</h3>
                <p className="text-gray-700">Watch the knockout phase begin with premium seats for matches featuring the world's best teams.</p>
              </div>
              <div className="glassmorphism p-6 hover:bg-white/25 transition-all">
                <h3 className="text-2xl font-bold text-purple-600 mb-3">Finals Package</h3>
                <p className="text-gray-700">The ultimate experience. From Quarter-Finals to the Championship match, witness history.</p>
              </div>
            </div>
          </div>

          <div className="glassmorphism p-8">
            <div className="aspect-video bg-white/10 rounded-lg flex items-center justify-center mb-6 border border-white/20">
              <span className="text-6xl">⚽</span>
            </div>
            <p className="text-gray-700 mb-8 leading-relaxed">Premium hospitality included with all multi-match packages. Enjoy gourmet dining, premium beverages, and VIP treatment throughout your World Cup journey.</p>
            <button className="w-full glassmorphism text-indigo-600 font-bold py-3 hover:bg-white/30 transition-all">
              BOOK SERIES NOW
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
