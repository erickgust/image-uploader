import { ThemeToggle } from '@/components/ThemeToggle'
import { FileUploader } from '@/components/FileUploader'
import { Logo } from '@/components/Logo'
import Link from 'next/link'

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col'>
      <header className='border-b border-gray-200 px-18 py-4 dark:border-gray-600'>
        <div className='max-w-8xl mx-auto flex items-center justify-between'>
          <Link href='/' aria-label='Home'>
            <Logo />
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className='grid h-full flex-1 place-items-center'>
        <FileUploader />
      </main>
    </div>
  )
}
