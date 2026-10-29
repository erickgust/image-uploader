import clsx from 'clsx'
import NextImage from 'next/image'
import { useRef, useState } from 'react'
import { Container } from './Container'

interface UploadedImageProps {
  imageUrl: string
  shortUrl: string
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
  shortUrl,
  file,
  onReset,
}: UploadedImageProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [dimensions, setDimensions] = useState('—')
  const [error, setError] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const copiedTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = file.name
    link.click()
  }

  const handleCopy = async () => {
    setError(null)
    try {
      await navigator.clipboard.writeText(shortUrl)
      setIsCopied(true)
      clearTimeout(copiedTimer.current)
      copiedTimer.current = setTimeout(() => setIsCopied(false), 1800)
    } catch (error) {
      console.error('Error copying link', error)
      setError('Unable to copy. Select the link and copy it.')
    }
  }

  const meta = [
    ['Format', file.type.split('/')[1].toUpperCase()],
    ['Size', formatSize(file.size)],
    ['Dimensions', dimensions],
    ['Link', shortUrl.replace(/^https?:\/\//, '')],
  ]

  return (
    <div className='animate-fadein relative flex flex-1 flex-col items-center justify-center gap-6 px-4 py-14 sm:px-10'>
      <Container
        className={clsx(
          'max-w-[min(620px,82vw)] p-2',
          !isLoaded && 'opacity-0',
        )}
      >
        <div
          className={clsx(
            'flex items-center overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] [interpolate-size:allow-keywords] motion-reduce:transition-none',
            isLoaded ? 'h-auto' : 'h-0',
          )}
        >
          <NextImage
            src={imageUrl}
            alt='Uploaded image'
            loading='eager'
            width={0}
            height={0}
            sizes='620px'
            className='block h-auto max-h-[42vh] w-auto max-w-full object-contain'
            onLoad={(e) => {
              setDimensions(
                `${e.currentTarget.naturalWidth} × ${e.currentTarget.naturalHeight}`,
              )
              setIsLoaded(true)
            }}
            onError={() => setIsLoaded(true)}
          />
        </div>
      </Container>

      <div
        className={clsx(
          'border-line flex max-w-full flex-wrap border font-mono',
          isLoaded
            ? 'animate-[fade_250ms_var(--ease-out-quint)_200ms_backwards]'
            : 'opacity-0',
        )}
      >
        {meta.map(([label, value]) => (
          <div
            key={label}
            className='border-line min-w-0 border-r px-4 py-2.25 last:border-r-0'
          >
            <div className='text-muted mb-1 text-xs tracking-[0.14em] uppercase'>
              {label}
            </div>
            <div className='truncate text-xs'>{value}</div>
          </div>
        ))}
      </div>

      <div
        className={clsx(
          'flex flex-wrap justify-center gap-3 font-mono text-sm tracking-[0.08em]',
          isLoaded
            ? 'animate-[fade_250ms_var(--ease-out-quint)_250ms_backwards]'
            : 'pointer-events-none opacity-0',
        )}
      >
        <button
          autoFocus
          onClick={handleCopy}
          className='bg-ink text-bg border-ink cursor-pointer border-[1.5px] px-4.5 py-2.75 uppercase transition-[opacity,scale] duration-150 hover:opacity-80 active:scale-[0.97]'
        >
          [{' '}
          {/* both labels share one grid cell so the button keeps the wider width */}
          <span className='*:ease-out-quint inline-grid *:transition-[opacity,translate] *:[grid-area:1/1] motion-reduce:*:translate-y-0'>
            <span
              aria-hidden={isCopied}
              className={
                isCopied
                  ? '-translate-y-1.5 opacity-0 duration-150'
                  : 'duration-200'
              }
            >
              Copy link
            </span>
            <span
              aria-hidden={!isCopied}
              className={
                isCopied
                  ? 'duration-200'
                  : 'translate-y-1.5 opacity-0 duration-150'
              }
            >
              Link copied
            </span>
          </span>{' '}
          ]
        </button>
        <button
          onClick={handleDownload}
          className='border-ink hover:bg-ink hover:text-bg cursor-pointer border-[1.5px] px-4.5 py-2.75 uppercase transition-[color,background-color,border-color,scale] duration-150 active:scale-[0.97]'
        >
          [ Download ]
        </button>
        <button
          onClick={onReset}
          className='text-muted border-line hover:text-ink hover:border-ink cursor-pointer border-[1.5px] px-4.5 py-2.75 uppercase transition-[color,background-color,border-color,scale] duration-150 active:scale-[0.97]'
        >
          [ + New ]
        </button>
      </div>

      <p role='alert' className='sr-only'>
        {error}
      </p>
      <p role='status' className='sr-only'>
        {isCopied ? 'Link copied' : ''}
      </p>

      {error && (
        <div className='animate-fadein flex items-center gap-2.5 font-mono text-sm tracking-wider'>
          <span className='border-ink inline-flex size-4 items-center justify-center border-[1.5px] font-bold'>
            !
          </span>
          <span>ERR · {error}</span>
        </div>
      )}
    </div>
  )
}
