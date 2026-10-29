import Link from 'next/link'

export default function ImageNotFound() {
  return (
    <div className='flex min-h-svh flex-col items-center justify-center gap-3 p-8 text-center'>
      <p>Image not found. Check the link, or upload a new image.</p>
      <Link href='/' className='underline'>
        Upload an image
      </Link>
    </div>
  )
}
