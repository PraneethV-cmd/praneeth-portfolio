import type { Metadata, Viewport } from 'next'
import { Geist_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { Header } from './header'
import { Footer } from './footer'
import { Grain } from '@/components/ui/grain'
import { ThemeProvider } from 'next-themes'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://praneethv.vercel.app/'),
  alternates: {
    canonical: '/'
  },
  title: {
    default: 'Praneeth V',
    template: '%s | Praneeth'
  },
  description:  'personal website',
};

// Geist Mono is kept only for the mono surfaces (buttons + project boxes).
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// Bagnard — a niche OFL serif by Sebastien Sanfilippo, inspired by the graffiti
// of a Napoleonic-war prisoner. Self-hosted from public/fonts (single weight).
const bagnard = localFont({
  src: [
    {
      path: '../public/fonts/Bagnard.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-bagnard',
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistMono.variable} ${bagnard.variable} bg-white tracking-tight antialiased dark:bg-zinc-950`}
      >
        <ThemeProvider
          enableSystem={true}
          attribute="class"
          storageKey="theme"
          defaultTheme="system"
        >
          <Grain />
          <div className="relative z-10 flex min-h-screen w-full flex-col font-[family-name:var(--font-bagnard)]">
            <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-4 pt-20">
              <Header />
              {children}
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
