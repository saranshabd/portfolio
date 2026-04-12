import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/react'

import { getMetadataBase } from '../lib/seo'

import './globals.css'

const jetBrainsMono = localFont({
  src: [
    {
      path: './fonts/JetBrainsMono-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/JetBrainsMono-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/JetBrainsMono-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-jetbrains-mono',
})

export const metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: 'Shabd',
    template: '%s',
  },
  description: "My corner on the internet",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.webmanifest',
  applicationName: 'Shabd',
  openGraph: {
    siteName: 'Shabd',
    type: 'website',
  },
  twitter: {
    card: 'summary',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jetBrainsMono.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
