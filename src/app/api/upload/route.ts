import { supabase } from '@/lib/supabase'
import { nanoid } from 'nanoid'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return Response.json(
        { error: 'Choose an image to upload' },
        { status: 400 },
      )
    }

    const MAX_SIZE = 2 * 1024 * 1024 // 2MB
    if (file.size > MAX_SIZE) {
      return Response.json(
        { error: 'Choose an image under 2 MB' },
        { status: 400 },
      )
    }

    // file.type is client-provided, so take the real format from the magic bytes
    const header = new Uint8Array(await file.slice(0, 4).arrayBuffer())
    const signatures = [
      { type: 'image/png', ext: 'png', bytes: [0x89, 0x50, 0x4e, 0x47] },
      { type: 'image/jpeg', ext: 'jpeg', bytes: [0xff, 0xd8, 0xff] },
      { type: 'image/gif', ext: 'gif', bytes: [0x47, 0x49, 0x46, 0x38] },
    ]
    const format = signatures.find((sig) =>
      sig.bytes.every((byte, i) => header[i] === byte),
    )
    if (!format) {
      return Response.json(
        { error: 'Choose a JPG, PNG or GIF image' },
        { status: 400 },
      )
    }

    const fileName = `${nanoid()}.${format.ext}`

    const { data, error } = await supabase.storage
      .from('images')
      .upload(`public/${fileName}`, file, {
        contentType: format.type,
        upsert: false,
      })

    if (error) {
      console.error('Supabase storage error:', error)
      return Response.json(
        { error: 'Unable to upload. Try again.' },
        { status: 500 },
      )
    }

    const { data: url } = supabase.storage
      .from('images')
      .getPublicUrl(data.path)

    const id = nanoid(8)

    const { error: insertError } = await supabase.from('images').insert({
      public_id: id,
      url: url.publicUrl,
    })

    if (insertError) {
      console.error('Supabase insert error:', insertError)
      await supabase.storage.from('images').remove([data.path])
      return Response.json(
        { error: 'Unable to upload. Try again.' },
        { status: 500 },
      )
    }

    const shortURL = new URL(id, req.nextUrl.origin)

    return Response.json(
      { url: url.publicUrl, shortUrl: shortURL.toString() },
      { status: 200 },
    )
  } catch (error) {
    console.error('Upload error:', error)
    return Response.json(
      { error: 'Unable to upload. Try again.' },
      { status: 500 },
    )
  }
}
