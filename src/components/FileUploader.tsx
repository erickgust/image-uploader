'use client'

import clsx from 'clsx'
import { useState } from 'react'
import { useDragAndDrop } from '@/hooks/useDragAndDrop'
import { usePasteFile } from '@/hooks/usePasteFile'
import { Container } from './Container'
import { LoadingState } from './LoadingState'
import { UploadedImage } from './UploadedImage'

const hudCorners = [
  'top-[22px] left-[22px] border-t-[1.5px] border-l-[1.5px]',
  'top-[22px] right-[22px] border-t-[1.5px] border-r-[1.5px]',
  'bottom-[22px] left-[22px] border-b-[1.5px] border-l-[1.5px]',
  'bottom-[22px] right-[22px] border-b-[1.5px] border-r-[1.5px]',
]

function UploadIcon() {
  return (
    <svg width='25' height='25' viewBox='0 0 24 24' fill='none' aria-hidden>
      <path
        d='M12 19 V6 M6 12 L12 6 L18 12'
        stroke='currentColor'
        strokeWidth='1.6'
        strokeLinecap='square'
      />
    </svg>
  )
}

export function FileUploader() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageId, setImageId] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const isDone = Boolean(imageUrl && imageId && file)
  const isIdle = !isUploading && !isDone

  const { isDragging, dragHandlers } = useDragAndDrop({
    onDrop: (file) => handleFileUpload(file),
  })

  usePasteFile({
    onPaste: (file) => handleFileUpload(file),
    isDisabled: !isIdle,
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    setError(null)

    if (!files) return

    handleFileUpload(files[0])
    e.target.value = ''
  }

  const handleFileUpload = async (file: File) => {
    const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      setError('Choose an image under 2 MB')
      return
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setError('Choose a JPG, PNG or GIF image')
      return
    }

    setFile(file)
    setProgress(0)
    setIsUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      // XHR instead of fetch: fetch has no upload progress events
      const data = await new Promise<{ url: string; shortUrl: string }>(
        (resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhr.open('POST', '/api/upload')
          xhr.responseType = 'json'
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              setProgress(Math.round((e.loaded / e.total) * 100))
            }
          }
          xhr.onload = () =>
            xhr.status === 200
              ? resolve(xhr.response)
              : reject(new Error(xhr.response?.error))
          xhr.onerror = () => reject(new Error())
          xhr.send(formData)
        },
      )

      setImageUrl(data.url)
      setImageId(data.shortUrl)
    } catch (error) {
      console.error('Error uploading file', error)
      setError(
        (error as Error).message ||
          'Unable to upload. Check your connection and try again.',
      )
    } finally {
      setIsUploading(false)
    }
  }

  const reset = () => {
    setImageUrl(null)
    setImageId(null)
    setError(null)
  }

  return (
    <section
      className='bg-bg relative flex flex-1'
      {...(isIdle ? dragHandlers : {})}
    >
      <div className='pointer-events-none absolute inset-0 bg-[linear-gradient(var(--grid)_1px,transparent_1px),linear-gradient(90deg,var(--grid)_1px,transparent_1px)] bg-[size:42px_42px]' />

      {hudCorners.map((corner) => (
        <div
          key={corner}
          className={clsx('border-ink absolute size-4', corner)}
        />
      ))}

      <div className='text-muted font-mono text-xs tracking-[0.1em] uppercase max-sm:hidden'>
        <div className='absolute top-6 left-[50px]'>hoist://v2</div>
        <div className='absolute top-6 right-[50px]'>Limit 2.0MB</div>
        <div className='absolute bottom-6 left-[50px]'>Fmt JPG·PNG·GIF</div>
        <div className='absolute right-[50px] bottom-6 flex items-center gap-[7px]'>
          {isUploading ? 'Busy' : isDone ? 'Done' : 'Ready'}
          <span className='bg-ink animate-blink size-[7px]' />
        </div>
      </div>

      <p role='alert' className='sr-only'>
        {error}
      </p>
      <p role='status' className='sr-only'>
        {isUploading && `Uploading ${file?.name}`}
        {isDone && 'Upload complete'}
      </p>

      {isIdle && (
        <div className='relative flex flex-1 flex-col items-center justify-center p-12'>
          <Container className='w-full max-w-[540px]'>
            <input
              id='upload'
              type='file'
              accept='image/png, image/jpeg, image/gif'
              aria-label='Drop your image here or browse. JPG, PNG or GIF, up to 2 MB'
              autoFocus={file !== null}
              className='peer sr-only'
              onChange={onChange}
            />
            <label
              htmlFor='upload'
              className='group hover:bg-bg2 peer-focus-visible:outline-ink flex min-h-[46vh] cursor-pointer flex-col items-center justify-center gap-[22px] p-9 text-center transition-colors peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-4'
            >
              <div className='border-ink group-hover:bg-ink group-hover:text-bg flex size-[60px] items-center justify-center border-[1.5px] transition duration-150 motion-safe:group-hover:-translate-y-[3px]'>
                <UploadIcon />
              </div>
              <div className='flex flex-col gap-2.5'>
                <h1 className='font-display text-[27px] leading-[1.1] font-semibold tracking-[-0.02em]'>
                  Drop your image here
                </h1>
                <p className='text-muted font-mono text-xs tracking-[0.1em] uppercase'>
                  Drag &nbsp;·&nbsp; Paste &nbsp;·&nbsp;{' '}
                  <span className='text-ink border-ink border-b-[1.5px] pb-px'>
                    Browse
                  </span>
                </p>
              </div>
              <p className='text-muted font-mono text-xs tracking-[0.12em] uppercase'>
                JPG &nbsp;·&nbsp; PNG &nbsp;·&nbsp; GIF &nbsp;—&nbsp; max 2.0MB
              </p>
            </label>

            {isDragging && (
              <div className='bg-bg2 border-ink animate-popin absolute inset-0 flex flex-col items-center justify-center gap-[18px] border-[1.5px]'>
                <div className='bg-ink text-bg flex size-[60px] items-center justify-center'>
                  <UploadIcon />
                </div>
                <h2 className='font-display text-[23px] font-semibold tracking-[-0.02em]'>
                  Release to upload
                </h2>
              </div>
            )}
          </Container>

          <div className='mt-4 min-h-4'>
            {error && (
              <div className='animate-fadein flex items-center justify-center gap-2.5 font-mono text-sm tracking-[0.05em]'>
                <span className='border-ink inline-flex size-4 shrink-0 items-center justify-center border-[1.5px] font-bold'>
                  !
                </span>
                <span>ERR · {error}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {isUploading && file && (
        <LoadingState progress={progress} fileName={file.name} />
      )}

      {isDone && (
        <UploadedImage
          imageUrl={imageUrl!}
          imageId={imageId!}
          file={file!}
          onReset={reset}
        />
      )}
    </section>
  )
}
