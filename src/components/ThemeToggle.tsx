'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      className='cursor-pointer rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-600 dark:bg-gray-700'
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <span className='sr-only'>Toggle Theme</span>

      {theme === 'dark' ? (
        <Image src='/sun_fill.svg' alt='Light Mode' width={24} height={24} />
      ) : (
        <Image src='/moon_fill.svg' alt='Dark Mode' width={24} height={24} />
      )}
    </button>
  )
}
