export function Logo() {
  return (
    <div className='flex items-center gap-[11px]'>
      <div className='border-ink flex size-[30px] items-center justify-center border-[1.5px]'>
        <svg width='14' height='14' viewBox='0 0 14 14' fill='none'>
          <path
            d='M7 11 V3.4 M3.6 6.8 L7 3.2 L10.4 6.8'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='square'
          />
        </svg>
      </div>
      <span className='font-display text-base font-semibold tracking-[-0.02em]'>
        ImageUpload
      </span>
    </div>
  )
}
