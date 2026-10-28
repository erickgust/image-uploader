import Image from 'next/image'

export function Logo() {
  return (
    <>
      <Image
        src='/hoist-lockup-light.svg'
        alt='hoist'
        width={89}
        height={30}
        priority
        className='dark:hidden'
      />
      <Image
        src='/hoist-lockup-dark.svg'
        alt='hoist'
        width={89}
        height={30}
        priority
        className='hidden dark:block'
      />
    </>
  )
}
