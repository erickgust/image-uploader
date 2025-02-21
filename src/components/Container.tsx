import clsx from 'clsx'

type ContainerProps = {
  children: React.ReactNode
  className?: string
}

export function Container({ children, className }: ContainerProps) {
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
