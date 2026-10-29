import { supabase } from '@/lib/supabase'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  robots: { index: false },
}

export default async function FullImagePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('public_id', id)
    .single()

  if (error) {
    return (
      <div className='flex min-h-svh flex-col items-center justify-center gap-3 p-8 text-center'>
        <p>Image not found. Check the link, or upload a new image.</p>
        <Link href='/' className='underline'>
          Upload an image
        </Link>
      </div>
    )
  }

  return (
    <main className='flex min-h-svh w-full p-8'>
      <div className='relative grow'>
        <Image
          fill
          className='object-contain'
          src={data.url}
          alt='Shared image'
          loading='eager'
        />
      </div>
    </main>
  )
}
