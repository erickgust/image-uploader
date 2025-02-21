import { Container } from './Container'

export function LoadingState() {
  return (
    <Container className='w-full max-w-[30rem] px-8 py-8 sm:px-20'>
      <div className='flex h-full flex-col items-center justify-center gap-4'>
        <p className='text-center text-sm font-medium'>
          <strong>Uploading</strong>, please wait..
        </p>

        <div className='h-1.5 w-full max-w-80 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600'>
          <div className='animate-loading-bar h-1.5 w-14 rounded-full bg-[#3662E3]' />
        </div>
      </div>
    </Container>
  )
}
