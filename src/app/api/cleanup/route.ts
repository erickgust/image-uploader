import { supabase } from '@/lib/supabase'
import { RETENTION_DAYS } from '@/lib/upload'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  if (
    !process.env.CRON_SECRET ||
    req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000)

  const { data: rows, error } = await supabase
    .from('images')
    .select('id, url')
    .lt('created_at', cutoff.toISOString())
    .limit(1000)

  if (error) {
    console.error('Cleanup select error:', error)
    return Response.json({ error: 'Cleanup failed' }, { status: 500 })
  }

  if (rows.length === 0) return Response.json({ deleted: 0 })

  const paths = rows.map((row) => row.url.split('/object/public/images/')[1])

  // files first: if this fails the rows stay and the next run retries
  const { error: storageError } = await supabase.storage
    .from('images')
    .remove(paths)

  if (storageError) {
    console.error('Cleanup storage error:', storageError)
    return Response.json({ error: 'Cleanup failed' }, { status: 500 })
  }

  const { error: deleteError } = await supabase
    .from('images')
    .delete()
    .in(
      'id',
      rows.map((row) => row.id),
    )

  if (deleteError) {
    console.error('Cleanup delete error:', deleteError)
    return Response.json({ error: 'Cleanup failed' }, { status: 500 })
  }

  return Response.json({ deleted: rows.length })
}
