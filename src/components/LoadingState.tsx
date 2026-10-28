interface LoadingStateProps {
  progress: number
  fileName: string
}

export function LoadingState({ progress, fileName }: LoadingStateProps) {
  return (
    <div className='animate-fadein absolute inset-0 flex flex-col items-center justify-center gap-7 font-mono'>
      <div className='bg-ink animate-scan absolute inset-x-0 h-0.5 opacity-35' />
      <span className='text-muted text-[11px] tracking-[0.2em]'>
        TRANSFERRING ///
      </span>
      <div className='text-[90px] leading-none font-medium tracking-[-0.02em]'>
        {String(progress).padStart(3, '0')}
        <span className='text-muted text-[34px]'>%</span>
      </div>
      <div className='bg-line relative h-0.5 w-[min(440px,70vw)] overflow-hidden'>
        <div
          className='bg-ink absolute inset-y-0 left-0 transition-[width] duration-100 ease-linear'
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className='text-muted text-[11px] tracking-[0.04em]'>
        {fileName}
      </span>
    </div>
  )
}
