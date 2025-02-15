import { ThemeToggle } from '@/components/ThemeToggle'
import Image from 'next/image'

export default function Home() {
  return (
    <div>
      <header className='flex items-center justify-between border-b border-gray-200 px-18 py-4'>
        <Image src='/logo.svg' alt='ImageUpload Logo' width={120} height={26} />

        <ThemeToggle />
      </header>
      <main className='row-start-2 flex flex-col items-center gap-8 sm:items-start'></main>
    </div>
  )
}
