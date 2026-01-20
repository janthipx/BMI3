import { cookies } from 'next/headers'
import Link from 'next/link'
import { verifyAuthToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

async function getDashboardData() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')
  if (!token) return null

  const payload = verifyAuthToken(token.value)
  if (!payload) return null

  const latestRecord = await prisma.bmiRecord.findFirst({
    where: { userId: payload.sub },
    orderBy: { recordDate: 'desc' },
    select: {
      recordDate: true,
      weight: true,
      height: true,
      bmiValue: true,
      bmiCategory: true
    }
  })

  const stats = await prisma.bmiRecord.aggregate({
    where: { userId: payload.sub },
    _count: { _all: true },
    _avg: { bmiValue: true }
  })

  return {
    latest: latestRecord
      ? {
          record_date: latestRecord.recordDate.toISOString(),
          weight: latestRecord.weight,
          height: latestRecord.height,
          bmi_value: latestRecord.bmiValue,
          bmi_category: latestRecord.bmiCategory
        }
      : null,
    summary: {
      count: stats._count._all,
      avg_bmi: stats._avg.bmiValue || null
    }
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <main className="space-y-8">
      <header className="flex justify-between items-end pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 font-serif">Dashboard</h1>
          <p className="text-slate-500 mt-2">Welcome back, track your progress and stay healthy.</p>
        </div>
        <Link href="/bmi/new" className="btn-primary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Record BMI
        </Link>
      </header>

      {!data?.latest ? (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No Records Found</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">Start your journey by recording your first BMI measurement. Consistency is key to improvement.</p>
          <Link href="/bmi/new" className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline">
            Create First Record &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Latest BMI Card */}
          <div className="glass-card p-6 md:col-span-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500"></div>
            <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-1 relative z-10">Latest Measurement</h3>
            <p className="text-xs text-slate-400 mb-6 relative z-10">{new Date(data.latest.record_date).toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <div className="flex items-end gap-4 relative z-10">
              <div>
                <span className="text-6xl font-bold text-slate-900 font-serif">{data.latest.bmi_value}</span>
                <span className="text-slate-500 ml-2 text-lg">BMI</span>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-sm font-medium mb-2 ${
                data.latest.bmi_category === 'Normal weight' ? 'bg-green-100 text-green-700' :
                data.latest.bmi_category === 'Underweight' ? 'bg-blue-100 text-blue-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                {data.latest.bmi_category}
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-4 relative z-10">
               <div>
                 <p className="text-slate-400 text-xs uppercase">Weight</p>
                 <p className="text-xl font-semibold text-slate-700">{data.latest.weight} <span className="text-sm font-normal text-slate-400">kg</span></p>
               </div>
               <div>
                 <p className="text-slate-400 text-xs uppercase">Height</p>
                 <p className="text-xl font-semibold text-slate-700">{data.latest.height} <span className="text-sm font-normal text-slate-400">m</span></p>
               </div>
            </div>
          </div>

          {/* Summary Stats Card */}
          <div className="glass-card p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-4">Overview</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-3xl font-bold text-slate-900 font-serif">{data.summary.count}</p>
                  <p className="text-sm text-slate-500">Total Records</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900 font-serif">{data.summary.avg_bmi ? data.summary.avg_bmi.toFixed(1) : '-'}</p>
                  <p className="text-sm text-slate-500">Average BMI</p>
                </div>
              </div>
            </div>
            <Link href="/bmi/history" className="mt-6 text-sm text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1 group">
              View All History 
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/bmi/history" className="glass-card p-6 hover:shadow-2xl transition-all duration-300 group">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">History Log</h3>
          <p className="text-slate-500 text-sm">View your complete history of weight and BMI records over time.</p>
        </Link>

        <Link href="/reports" className="glass-card p-6 hover:shadow-2xl transition-all duration-300 group">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0l-.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Analytics Reports</h3>
          <p className="text-slate-500 text-sm">Visualize your progress with detailed charts and trends.</p>
        </Link>
      </div>
    </main>
  )
}

