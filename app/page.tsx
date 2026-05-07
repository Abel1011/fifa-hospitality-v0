import Header from '@/components/fifa/Header'
import Hero from '@/components/fifa/Hero'
import HostNations from '@/components/fifa/HostNations'
import MatchOfferings from '@/components/fifa/MatchOfferings'
import PremiumOfferings from '@/components/fifa/PremiumOfferings'
import LoungeAccess from '@/components/fifa/LoungeAccess'
import WhyChoose from '@/components/fifa/WhyChoose'
import Footer from '@/components/fifa/Footer'

export default function Home() {
  return (
    <main id="top" className="min-h-screen bg-background">
      <Header />
      <Hero />
      <HostNations />
      <MatchOfferings />
      <PremiumOfferings />
      <LoungeAccess />
      <WhyChoose />
      <Footer />
    </main>
  )
}
