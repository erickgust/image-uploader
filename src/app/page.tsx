import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import Link from 'next/link'
export default function Home() {
  return (
    <div>
      <header className='border-b border-gray-200 px-18 py-4 dark:border-gray-600'>
        <div className='max-w-8xl mx-auto flex items-center justify-between'>
          <Link href='/' aria-label='Home'>
            <Logo />
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className='row-start-2 flex flex-col items-center gap-8 sm:items-start'></main>
    </div>
  )
}
