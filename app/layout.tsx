import type { Metadata } from 'next'
import {
  Bricolage_Grotesque,
  Instrument_Serif,
  JetBrains_Mono,
} from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import VoiceAssistantProvider from '@/components/voice/VoiceAssistantProvider'
import VoiceConciergeDock from '@/components/voice/VoiceConciergeDock'
import { elevenLabsPublicConfig } from '@/lib/voice/public-config'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
})

const instrumentSerif = Instrument_Serif({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
})

const jetbrains = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'World Cup 26 | Hospitality Landing',
  description:
    'Landing concept for FIFA World Cup 2026 hospitality, migrated into the v0 hackathon workspace.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${instrumentSerif.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        <VoiceAssistantProvider>
          {children}
          {elevenLabsPublicConfig.enabled ? <VoiceConciergeDock /> : null}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </VoiceAssistantProvider>
      </body>
    </html>
  )
}
