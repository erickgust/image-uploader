interface LoadingStateProps {
  progress: number
  fileName: string
}

export function LoadingState({ progress, fileName }: LoadingStateProps) {
  return (
    <div className='animate-fadein relative flex flex-1 flex-col items-center justify-center gap-7 overflow-hidden font-mono'>
      <div className='animate-scan pointer-events-none absolute inset-0'>
        <div className='bg-ink h-0.5 opacity-35' />
      </div>
      <span className='text-muted text-xs tracking-[0.2em] uppercase'>
        Uploading ///
      </span>
      <div className='text-[90px] leading-none font-medium tracking-[-0.02em]'>
        {String(progress).padStart(3, '0')}
        <span className='text-muted text-[34px]'>%</span>
      </div>
      <div
        role='progressbar'
        aria-label='Upload progress'
        aria-valuenow={progress}
        className='bg-line relative h-0.5 w-[min(440px,70vw)] overflow-hidden'
      >
        <div
          className='bg-ink absolute inset-0 origin-left transition-transform duration-100 ease-linear'
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>
      <span className='text-muted text-xs tracking-[0.04em]'>{fileName}</span>
    </div>
  )
}
