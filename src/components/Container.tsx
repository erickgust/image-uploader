import clsx from 'clsx'

type ContainerProps = {
  children: React.ReactNode
  className?: string
}

const corners = [
  '-top-[7px] -left-[7px] border-t-[1.5px] border-l-[1.5px]',
  '-top-[7px] -right-[7px] border-t-[1.5px] border-r-[1.5px]',
  '-bottom-[7px] -left-[7px] border-b-[1.5px] border-l-[1.5px]',
  '-bottom-[7px] -right-[7px] border-b-[1.5px] border-r-[1.5px]',
]

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={clsx('border-ink bg-bg relative border-[1.5px]', className)}
    >
      {children}
      {corners.map((corner) => (
        <div
          key={corner}
          className={clsx(
            'border-ink bg-bg pointer-events-none absolute size-[13px]',
            corner,
          )}
        />
      ))}
    </div>
  )
}
