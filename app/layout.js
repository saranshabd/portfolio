import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/react'

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
  title: 'Shabd Saran | Terminal Portfolio',
  description: "Shabd Saran's corner on the internet, rebuilt as a terminal.",
  icons: {
    icon: '/favicon.ico',
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
