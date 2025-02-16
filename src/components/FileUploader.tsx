'use client'

import Image from 'next/image'
import { useState } from 'react'

export function FileUploader() {
  const [file, setFile] = useState<File | null>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (!files) return

    const file = files[0]
    setFile(file)
  }

  return (
    <div className='w-full max-w-[33.75rem] rounded-lg bg-white p-2 shadow-xl shadow-gray-200 dark:bg-[#212936] dark:shadow-none'>
      <div className='flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-28 dark:border-gray-600'>
        <div className='mb-5'>
          <Image src='/exit.svg' priority width={32} height={32} alt='Upload' />
        </div>

        <div className='text-center text-[#121826] dark:text-gray-50/80'>
          <p className='mb-2 text-sm font-medium'>
            Drag & drop a file or{' '}
            <label htmlFor='upload' className='cursor-pointer text-[#3662E3]'>
              browse files
            </label>
            <input
              id='upload'
              type='file'
              accept='image/png, image/jpeg, image/gif'
              className='hidden'
              onChange={onChange}
            />
          </p>
          <p className='text-xs font-light'>
            JPG, PNG or GIF - Max file size 2MB
          </p>
        </div>
      </div>
    </div>
  )
}
