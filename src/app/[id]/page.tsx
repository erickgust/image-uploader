import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

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
    <div className='flex min-h-svh w-full p-8'>
      <div className='relative grow'>
        <Image fill className='object-contain' src={data.url} alt='' />
      </div>
    </div>
  )
}
