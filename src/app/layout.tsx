import { DM_Sans, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import clsx from 'clsx'
import './globals.css'
import { Metadata, Viewport } from 'next'

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'ImageUpload',
  description: 'Upload images and share them with others.',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0b' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={clsx(
          dmSans.variable,
          spaceGrotesk.variable,
          jetbrainsMono.variable,
          'bg-bg text-ink font-sans antialiased',
        )}
      >
        <ThemeProvider attribute='class' enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
