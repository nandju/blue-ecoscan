import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import './globals.css'

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins" 
});

export const metadata: Metadata = {
  title: 'BLUE EcoScan - AI Waste Analysis',
  description: 'Automate waste analysis with AI for environmental research. Detect plastics, identify brands, and generate scientific reports.',
  generator: 'v0.app',
  manifest: '/manifest.json',
  icons: {
    icon: [
      {
        url: '/logo.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/logo.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/logo.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
