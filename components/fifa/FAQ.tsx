'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'How is hospitality different from a general ticket?',
      answer: 'Our hospitality packages include premium seating, gourmet dining, beverages, and VIP services that standard tickets don\'t offer. You\'ll have access to exclusive lounges and dedicated concierge support.',
    },
    {
      question: 'What is included in the pricing?',
      answer: 'All packages include stadium admission, premium seating, catering, beverages, lounge access, and parking. Some packages also include transportation and accommodation.',
    },
    {
      question: 'Can I book multiple matches?',
      answer: 'Yes! We offer flexible booking options from single matches to full tournament packages. Our series packages provide significant savings for multiple matches.',
    },
    {
      question: 'What about group bookings?',
      answer: 'We specialize in group experiences and offer customized packages for corporations and teams. Contact our sales team for group rates and dedicated support.',
    },
    {
      question: 'Is there a refund policy?',
      answer: 'Yes, we offer flexible cancellation terms depending on your package. Please review the terms at booking or contact our support team for details.',
    },
    {
      question: 'How do I guarantee the best seats?',
      answer: 'Early booking ensures access to premium seating locations. Our VIP packages come with guaranteed best-available seats at participating venues.',
    },
  ]

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl font-black gradient-text mb-16 uppercase text-center">FREQUENTLY ASKED QUESTIONS</h2>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glassmorphism overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/20 transition-all"
              >
                <h3 className="text-gray-800 font-bold text-lg text-left">{faq.question}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-indigo-600 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`}
                />
              </button>
              {openIndex === idx && (
                <div className="px-6 py-4 border-t border-white/20 bg-white/5">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 glassmorphism p-8 text-center bg-gradient-to-r from-indigo-400/20 to-cyan-400/20">
          <h3 className="text-3xl font-bold gradient-text mb-4">Still have questions?</h3>
          <p className="text-gray-700 mb-8 text-lg">Contact our team for personalized assistance with your World Cup experience.</p>
          <button className="px-8 py-3 glassmorphism text-indigo-600 font-bold hover:bg-white/30 transition-all">
            CONTACT SUPPORT
          </button>
        </div>
      </div>
    </section>
  )
}
