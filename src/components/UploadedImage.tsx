import NextImage from 'next/image'
import { useState } from 'react'
import { Container } from './Container'

interface UploadedImageProps {
  imageUrl: string
  imageId: string
  file: File
  onReset: () => void
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function UploadedImage({
  imageUrl,
  imageId,
  file,
  onReset,
}: UploadedImageProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [dimensions, setDimensions] = useState('—')
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    setError(null)
    try {
      const response = await fetch(imageUrl)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = blobUrl
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading file', error)
      setError('Unable to download. Try again.')
    }
  }

  const handleCopy = async () => {
    setError(null)
    try {
      await navigator.clipboard.writeText(imageId)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 1800)
    } catch (error) {
      console.error('Error copying link', error)
      setError('Unable to copy. Select the link and copy it.')
    }
  }

  const meta = [
    ['FORMAT', file.type.split('/')[1].toUpperCase()],
    ['SIZE', formatSize(file.size)],
    ['DIMENSIONS', dimensions],
    ['LINK', imageId.replace(/^https?:\/\//, '')],
  ]

  return (
    <div className='animate-fadein relative flex flex-1 flex-col items-center justify-center gap-6 px-4 py-14 sm:px-10'>
      <Container className='max-w-[min(620px,82vw)] p-2'>
        <NextImage
          src={imageUrl}
          alt='Uploaded image'
          width={0}
          height={0}
          sizes='620px'
          className='block h-auto max-h-[42vh] w-auto max-w-full object-contain'
          onLoad={(e) =>
            setDimensions(
              `${e.currentTarget.naturalWidth} × ${e.currentTarget.naturalHeight}`,
            )
          }
        />
      </Container>

      <div className='border-line flex max-w-full flex-wrap border font-mono'>
        {meta.map(([label, value]) => (
          <div
            key={label}
            className='border-line min-w-0 border-r px-4 py-[9px] last:border-r-0'
          >
            <div className='text-muted mb-1 text-[9px] tracking-[0.14em]'>
              {label}
            </div>
            <div className='truncate text-xs'>{value}</div>
          </div>
        ))}
      </div>

      <div className='flex flex-wrap justify-center gap-3 font-mono text-[11.5px] tracking-[0.08em]'>
        <button
          onClick={handleCopy}
          className='bg-ink text-bg border-ink cursor-pointer border-[1.5px] px-[18px] py-[11px] transition-opacity hover:opacity-80'
        >
          [ {isCopied ? 'LINK COPIED' : 'COPY LINK'} ]
        </button>
        <button
          onClick={handleDownload}
          className='border-ink hover:bg-ink hover:text-bg cursor-pointer border-[1.5px] px-[18px] py-[11px] transition-colors'
        >
          [ DOWNLOAD ]
        </button>
        <button
          onClick={onReset}
          className='text-muted border-line hover:text-ink hover:border-ink cursor-pointer border-[1.5px] px-[18px] py-[11px] transition-colors'
        >
          [ + NEW ]
        </button>
      </div>

      {error && (
        <div className='animate-fadein flex items-center gap-2.5 font-mono text-[11.5px] tracking-[0.05em]'>
          <span className='border-ink inline-flex size-4 items-center justify-center border-[1.5px] font-bold'>
            !
          </span>
          <span>ERR · {error}</span>
        </div>
      )}
    </div>
  )
}
