'use client'

import clsx from 'clsx'
import NextImage from 'next/image'
import { useState } from 'react'

function Container({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={clsx(
        'rounded-lg bg-white text-[#121826] shadow-xl shadow-gray-200 dark:bg-[#212936] dark:text-gray-50/80 dark:shadow-none',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function FileUploader() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    setError(null)

    if (!files) return

    handleFileUpload(files[0])
  }

  const handleFileUpload = async (file: File) => {
    const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 2MB limit')
      return
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPG, PNG and GIF are allowed')
      return
    }

    setIsUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      setImageUrl(data.url)
    } catch (error) {
      console.error('Error uploading file', error)
      setError('Failed to upload file. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  if (isUploading && !imageUrl) {
    return (
      <Container className='px-20 py-8'>
        <div className='flex h-full flex-col items-center justify-center gap-4'>
          <p className='text-center text-sm font-medium'>
            <strong>Uploading</strong>, please wait..
          </p>

          <div className='h-1.5 w-80 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600'>
            <div className='animate-loading-bar h-1.5 w-14 rounded-full bg-[#3662E3]' />
          </div>
        </div>
      </Container>
    )
  }

  if (imageUrl) {
    return (
      <div className='flex w-full max-w-[33.75rem] flex-col items-center gap-6'>
        <Container className='w-full p-2'>
          <div className='relative aspect-video w-full'>
            <NextImage
              fill
              src={imageUrl}
              alt='Uploaded image'
              className='rounded-lg object-contain'
            />
          </div>
        </Container>

        <div className='flex gap-3'>
          <button className='flex cursor-pointer items-center gap-1 rounded-lg bg-[#3662E3] px-3 py-1.5 text-[0.625rem] font-semibold text-white'>
            <NextImage src='/link.svg' width={12} height={12} alt='Share' />
            <span>Share</span>
          </button>
          <a
            href={imageUrl}
            className='flex cursor-pointer items-center gap-1 rounded-lg bg-[#3662E3] px-3 py-1.5 text-[0.625rem] font-semibold text-white'
            download
          >
            <NextImage
              src='/download.svg'
              width={12}
              height={12}
              alt='Download'
            />
            <span>Download</span>
          </a>
        </div>
      </div>
    )
  }

  return (
    <Container className='w-full max-w-[33.75rem] p-2'>
      <div className='flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-28 dark:border-gray-600'>
        <div className='mb-5'>
          <NextImage
            src='/exit.svg'
            priority
            width={32}
            height={32}
            alt='Upload'
            unoptimized
          />
        </div>

        <div className='text-center'>
          {error && (
            <p className='mb-2 text-sm font-medium text-red-500'>{error}</p>
          )}
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
    </Container>
  )
}
