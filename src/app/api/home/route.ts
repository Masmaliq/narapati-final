import {revalidatePath} from 'next/cache'
import {NextResponse} from 'next/server'
import {getHomeContent, saveHomeContent} from '@/lib/homeContent'

export async function GET() {
  const content = await getHomeContent()
  return NextResponse.json(content)
}

export async function PUT(request: Request) {
  try {
    const payload = await request.json()
    const content = await saveHomeContent(payload)

    revalidatePath('/')
    revalidatePath('/admin/home')

    return NextResponse.json({ok: true, content})
  } catch {
    return NextResponse.json({ok: false, message: 'Konten Home gagal disimpan.'}, {status: 400})
  }
}
