'use client'

import NextImage from 'next/image'
import { useEffect, useState } from 'react'
import { useDragAndDrop } from '@/hooks/useDragAndDrop'
import { Container } from './Container'
import { LoadingState } from './LoadingState'

export function FileUploader() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageId, setImageId] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isDragging, dragHandlers } = useDragAndDrop({
    onDrop: (file) => handleFileUpload(file),
  })

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
      setImageId(data.shortUrl)
    } catch (error) {
      console.error('Error uploading file', error)
      setError('Failed to upload file. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownload = async () => {
    if (!imageUrl) return

    const response = await fetch(imageUrl)
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = blobUrl
    link.download = 'image.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    if (imageId || isUploading) return

    const handlePaste = (e: ClipboardEvent) => {
      const files = e.clipboardData?.files

      if (files && files.length > 0) {
        const file = files[0]
        handleFileUpload(file)
      }
    }

    document.addEventListener('paste', handlePaste)

    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [imageId, isUploading])

  if (isUploading && !imageUrl) {
    return <LoadingState />
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
          <button
            onClick={() => {
              if (!imageId) return

              navigator.clipboard.writeText(imageId)
              setIsCopied(true)
            }}
            ref={(e) => {
              if (!e) return

              setTimeout(() => {
                setIsCopied(false)
              }, 2000)
            }}
            className='flex cursor-pointer items-center gap-1 rounded-lg bg-[#3662E3] px-3 py-1.5 text-[0.625rem] font-semibold text-white'
          >
            <NextImage src='/link.svg' width={12} height={12} alt='Share' />
            <span>{isCopied ? 'Copied!' : 'Share'}</span>
          </button>
          <button
            onClick={handleDownload}
            className='flex cursor-pointer items-center gap-1 rounded-lg bg-[#3662E3] px-3 py-1.5 text-[0.625rem] font-semibold text-white'
          >
            <NextImage
              src='/download.svg'
              width={12}
              height={12}
              alt='Download'
            />
            <span>Download</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <Container className='w-full max-w-[33.75rem] p-2'>
      <div
        className='group relative rounded-lg border-2 border-dashed border-gray-200 data-[dragging=true]:border-[#3662E3] dark:border-gray-600'
        {...dragHandlers}
        data-dragging={isDragging}
      >
        {isDragging && (
          <div className='absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#3662E3]/10'>
            <p className='text-sm font-medium'>Drop files here</p>
          </div>
        )}

        <div className='flex flex-col items-center justify-center py-28 group-data-[dragging=true]:opacity-0'>
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
      </div>
    </Container>
  )
}
