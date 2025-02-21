import NextImage from 'next/image'
import { useState } from 'react'
import { Container } from './Container'

interface UploadedImageProps {
  imageUrl: string
  imageId: string
}

export function UploadedImage({ imageUrl, imageId }: UploadedImageProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleDownload = async () => {
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
