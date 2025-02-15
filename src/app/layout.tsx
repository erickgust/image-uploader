import localFont from 'next/font/local'
import './globals.css'

const overusedGR = localFont({
  src: './fonts/OverusedGroteskRoman-VF.ttf',
  display: 'swap',
  variable: '--font-overused-gr',
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
