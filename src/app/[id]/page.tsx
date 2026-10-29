import { supabase } from '@/lib/supabase'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { cache } from 'react'

type Props = { params: Promise<{ id: string }> }

const getImage = cache((id: string) =>
  supabase.from('images').select('url').eq('public_id', id).single(),
)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { data } = await getImage(id)

  return {
    robots: { index: false },
    ...(data && {
      openGraph: { images: [data.url] },
      twitter: { card: 'summary_large_image', images: [data.url] },
    }),
  }
}

export default async function FullImagePage({ params }: Props) {
  const { id } = await params

  const { data, error } = await getImage(id)

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
