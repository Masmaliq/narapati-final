import {RedaksiEditor} from '@/components/admin/RedaksiEditor'
import {getRedaksiContent} from '@/lib/redaksiContent'

export const dynamic = 'force-dynamic'

export default async function RedaksiAdminPage() {
  const content = await getRedaksiContent()

  return (
    <section className="admin-page">
      <div className="container">
        <RedaksiEditor initialContent={content} />
      </div>
    </section>
  )
}
