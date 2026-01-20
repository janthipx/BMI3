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
    <main className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 font-serif mb-2">History Log</h1>
          <p className="text-slate-500">Track your progress over time with detailed records.</p>
        </div>
        
        {records.length > 0 && (
           <div className="bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-600">
             Total Records: <span className="text-indigo-600 font-bold">{records.length}</span>
           </div>
        )}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Weight (kg)</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Height (m)</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">BMI</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Note</th>
              </tr>
            </thead>
            <tbody className="bg-white/30 divide-y divide-slate-100">
              {records.length === 0 ? (
                <tr>
                  <td className="px-6 py-12 text-center text-slate-500" colSpan={6}>
                    <div className="flex flex-col items-center justify-center">
                       <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                         </svg>
                       </div>
                       <p className="text-lg font-medium text-slate-900">No records found</p>
                       <p className="text-sm text-slate-500 mb-4">Start by creating your first BMI record.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                records.map((r: any) => (
                  <tr key={r.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-medium">
                      {new Date(r.record_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {r.weight}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {r.height}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-bold font-serif text-slate-800">{r.bmi_value}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        r.bmi_category === 'Normal weight' ? 'bg-green-100 text-green-800' :
                        r.bmi_category === 'Underweight' ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {r.bmi_category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                      {r.note || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

