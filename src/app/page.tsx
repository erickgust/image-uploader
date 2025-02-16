import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import Image from 'next/image'
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
        <div className='w-full max-w-[33.75rem] rounded-lg bg-white p-2 shadow-xl shadow-gray-200 dark:bg-[#212936] dark:shadow-none'>
          <div className='flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-28 dark:border-gray-600'>
            <div className='mb-5'>
              <Image
                src='/exit.svg'
                priority
                width={32}
                height={32}
                alt='Upload'
              />
            </div>

            <div className='text-center text-[#121826] dark:text-gray-50/80'>
              <p className='mb-2 text-sm font-medium'>
                Drag & drop a file or{' '}
                <label
                  htmlFor='upload'
                  className='cursor-pointer text-[#3662E3]'
                >
                  browse files
                </label>
                <input
                  id='upload'
                  type='file'
                  accept='image/*'
                  className='hidden'
                />
              </p>
              <p className='text-xs font-light'>
                JPG, PNG or GIF - Max file size 2MB
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
