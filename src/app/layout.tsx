import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import clsx from 'clsx'
import './globals.css'

const inter = Inter({
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
    <html lang='en' suppressHydrationWarning>
      <body
        className={clsx(
          inter.variable,
          'bg-background-light dark:bg-background-dark antialiased',
        )}
      >
        <ThemeProvider attribute='class' enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
