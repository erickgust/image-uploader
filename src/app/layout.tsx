import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import clsx from 'clsx'
import './globals.css'
import { Metadata } from 'next'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'ImageUpload',
  description: 'Upload images and share them with others.',
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
          inter.variable,
          'bg-main-light dark:bg-main-dark antialiased',
        )}
      >
        <ThemeProvider attribute='class' enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
