import { supabase } from '@/lib/supabase'
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { cache } from 'react'

type Props = { params: Promise<{ id: string }> }

const getImage = cache(async (id: string) => {
  const { data, error } = await supabase
    .from('images')
    .select('url')
    .eq('public_id', id)
    .maybeSingle()

  if (error) throw error
  return data
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const image = await getImage(id)

  return {
    robots: { index: false },
    ...(image && {
      openGraph: { images: [image.url] },
      twitter: { card: 'summary_large_image', images: [image.url] },
    }),
  }
}

export default async function FullImagePage({ params }: Props) {
  const { id } = await params
  const image = await getImage(id)

  if (!image) notFound()

  return (
    <main className='flex min-h-svh w-full p-8'>
      <div className='relative grow'>
        <Image
          fill
          className='object-contain'
          src={image.url}
          alt='Shared image'
          loading='eager'
        />
      </div>
    </main>
  )
}
