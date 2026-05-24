import {HomeEditor} from '@/components/admin/HomeEditor'
import {getHomeContent} from '@/lib/homeContent'

export const dynamic = 'force-dynamic'

export default async function HomeAdminPage() {
  const content = await getHomeContent()

  return (
    <section className="admin-page">
      <div className="container">
        <HomeEditor initialContent={content} />
      </div>
    </section>
  )
}
