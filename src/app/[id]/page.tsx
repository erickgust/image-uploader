import { supabase } from '@/lib/supabase'
import Image from 'next/image'

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
    return <div>Error: {error.message}</div>
  }

  return (
    <div className='flex min-h-svh w-full p-8'>
      <div className='relative grow'>
        <Image fill className='object-contain' src={data.url} alt='' />
      </div>
    </div>
  )
}
