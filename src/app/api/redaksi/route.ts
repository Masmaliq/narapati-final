import {NextResponse} from 'next/server'
import {revalidatePath} from 'next/cache'
import {getRedaksiContent, saveRedaksiContent} from '@/lib/redaksiContent'

export async function GET() {
  const content = await getRedaksiContent()
  return NextResponse.json(content)
}

export async function PUT(request: Request) {
  try {
    const payload = await request.json()
    const content = await saveRedaksiContent(payload)

    revalidatePath('/redaksi')
    revalidatePath('/admin/redaksi')

    return NextResponse.json({ok: true, content})
  } catch (error) {
    console.error('Failed to save Redaksi content', error)
    return NextResponse.json({ok: false, message: 'Konten Redaksi gagal disimpan.'}, {status: 400})
  }
}
