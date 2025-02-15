import { Inter } from 'next/font/google'
import './globals.css'

const overusedGR = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${overusedGR.variable} antialiased`}>{children}</body>
    </html>
  )
}
