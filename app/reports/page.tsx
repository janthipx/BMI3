import Link from 'next/link'

export default function ReportsPage() {
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">รายงาน MIS</h1>
      <div className="flex gap-4">
        <Link href="/reports/daily" className="px-3 py-2 rounded border border-blue-600 text-blue-600">
          Daily Report
        </Link>
        <Link href="/reports/weekly" className="px-3 py-2 rounded border border-blue-600 text-blue-600">
          Weekly Report
        </Link>
        <Link href="/reports/monthly" className="px-3 py-2 rounded border border-blue-600 text-blue-600">
          Monthly Report
        </Link>
        <Link href="/reports/yearly" className="px-3 py-2 rounded border border-blue-600 text-blue-600">
          Yearly Report
        </Link>
      </div>
    </main>
  )
}

