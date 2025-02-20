import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return Response.json({ error: 'Invalid file upload' }, { status: 400 })
    }

    const MAX_SIZE = 2 * 1024 * 1024 // 2MB
    if (file.size > MAX_SIZE) {
      return Response.json({ error: 'File size too large' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ error: 'Invalid file type' }, { status: 400 })
    }

    const [, fileExt] = file.type.split('/')
    const fileName = `${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('images')
      .upload(`public/${fileName}`, file, {
        upsert: false,
      })

    if (error) {
      console.error('Supabase storage error:', error)
      return Response.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    const { data: url } = supabase.storage
      .from('images')
      .getPublicUrl(data.path)

    console.log(url)

    return Response.json({ url: url.publicUrl }, { status: 200 })
  } catch (error) {
    console.error('Upload error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
