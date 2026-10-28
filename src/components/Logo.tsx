import Image from 'next/image'

export function Logo() {
  return (
    <>
      <Image
        src='/imageupload-lockup-light.svg'
        alt='imageupload'
        width={190}
        height={30}
        priority
        className='dark:hidden'
      />
      <Image
        src='/imageupload-lockup-dark.svg'
        alt='imageupload'
        width={190}
        height={30}
        priority
        className='hidden dark:block'
      />
    </>
  )
}
