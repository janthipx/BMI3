import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

async function fetchHistory() {
  const cookieStore = await cookies()
  const res = await fetch(`${process.env.APP_BASE_URL || 'http://localhost:3000'}/api/bmi-records`, {
    headers: {
      cookie: cookieStore.toString()
    },
    cache: 'no-store'
  })
  if (!res.ok) return []
  return res.json()
}

export default async function BmiHistoryPage() {
  const records = await fetchHistory()

  return (
    <main className="p-4">
      <h1 className="text-2xl font-semibold mb-4">ประวัติ BMI</h1>
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-slate-100">
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Weight (kg)</th>
            <th className="border px-2 py-1">Height (m)</th>
            <th className="border px-2 py-1">BMI</th>
            <th className="border px-2 py-1">Category</th>
            <th className="border px-2 py-1">Note</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td className="border px-2 py-2 text-center" colSpan={6}>
                ยังไม่มีข้อมูล
              </td>
            </tr>
          ) : (
            records.map((r: any) => (
              <tr key={r.id}>
                <td className="border px-2 py-1">{r.record_date}</td>
                <td className="border px-2 py-1">{r.weight}</td>
                <td className="border px-2 py-1">{r.height}</td>
                <td className="border px-2 py-1">{r.bmi_value}</td>
                <td className="border px-2 py-1">{r.bmi_category}</td>
                <td className="border px-2 py-1">{r.note}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  )
}

