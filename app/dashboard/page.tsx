import { cookies } from 'next/headers'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function fetchDashboard() {
  const cookieStore = await cookies()
  const res = await fetch(`${process.env.APP_BASE_URL || 'http://localhost:3000'}/api/dashboard`, {
    headers: {
      cookie: cookieStore.toString()
    },
    cache: 'no-store'
  })
  if (!res.ok) return null
  return res.json()
}

export default async function DashboardPage() {
  const data = await fetchDashboard()

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      {!data?.latest ? (
        <p>You haven't saved any BMI data yet. Please save your first record.</p>
      ) : (
        <div className="space-y-1">
          <p>Latest Record Date: {data.latest.record_date}</p>
          <p>Latest BMI Value: {data.latest.bmi_value}</p>
          <p>Latest BMI Category: {data.latest.bmi_category}</p>
        </div>
      )}
      <div className="flex gap-4">
        <Link href="/bmi/new" className="px-3 py-2 rounded bg-blue-600 text-white">
          Save BMI Record
        </Link>
        <Link href="/bmi/history" className="px-3 py-2 rounded border border-blue-600 text-blue-600">
          BMI History
        </Link>
        <Link href="/reports" className="px-3 py-2 rounded border border-green-600 text-green-600">
          MIS Reports
        </Link>
      </div>
    </main>
  )
}

