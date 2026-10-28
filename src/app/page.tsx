import { ThemeToggle } from '@/components/ThemeToggle'
import { FileUploader } from '@/components/FileUploader'
import { Logo } from '@/components/Logo'
import Link from 'next/link'

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col'>
      <header className='border-line relative z-30 flex items-center justify-between border-b px-[26px] py-[18px]'>
        <Link href='/' aria-label='Home'>
          <Logo />
        </Link>
        <ThemeToggle />
      </header>
      <main className='relative flex min-h-0 flex-1'>
        <FileUploader />
      </main>
    </div>
  )
}
