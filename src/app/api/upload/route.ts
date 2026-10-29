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

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { error: 'Choose a JPG, PNG or GIF image' },
        { status: 400 },
      )
    }

    // file.type is client-provided, so check the real format from the magic bytes
    const header = new Uint8Array(await file.slice(0, 4).arrayBuffer())
    const signatures = [
      [0x89, 0x50, 0x4e, 0x47], // PNG
      [0xff, 0xd8, 0xff], // JPEG
      [0x47, 0x49, 0x46, 0x38], // GIF
    ]
    if (!signatures.some((sig) => sig.every((byte, i) => header[i] === byte))) {
      return Response.json(
        { error: 'Choose a JPG, PNG or GIF image' },
        { status: 400 },
      )
    }

    const [, fileExt] = file.type.split('/')
    const fileName = `${nanoid()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('images')
      .upload(`public/${fileName}`, file, {
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
