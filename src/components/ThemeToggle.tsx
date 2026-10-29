'use client'

import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      className='border-line hover:border-ink flex size-8 cursor-pointer items-center justify-center border transition-[color,background-color,border-color,scale] duration-150 active:scale-[0.97]'
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <span className='sr-only dark:hidden'>Switch to dark theme</span>
      <span className='sr-only hidden dark:inline'>Switch to light theme</span>

      <svg width='15' height='15' viewBox='0 0 14 14' aria-hidden>
        <circle
          cx='7'
          cy='7'
          r='5.4'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.1'
        />
        <path d='M7 1.6 A5.4 5.4 0 0 0 7 12.4 Z' fill='currentColor' />
      </svg>
    </button>
  )
}
