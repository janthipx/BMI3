import Link from 'next/link'

export default function ReportsPage() {
  const reports = [
    {
      title: 'Daily Report',
      href: '/reports/daily',
      description: 'Analyze your daily progress and fluctuations with precision.',
      color: 'bg-blue-50 text-blue-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Weekly Report',
      href: '/reports/weekly',
      description: 'View weekly trends and average stats to stay on track.',
      color: 'bg-indigo-50 text-indigo-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      )
    },
    {
      title: 'Monthly Report',
      href: '/reports/monthly',
      description: 'Track monthly achievements and visualize long-term patterns.',
      color: 'bg-purple-50 text-purple-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 012.25-2.25h13.5a2.25 2.25 0 012.25 2.25v11.251m-18 0a2.25 2.25 0 002.25 2.25h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5a2.25 2.25 0 012.25-2.25h13.5a2.25 2.25 0 012.25 2.25v7.5m-6.75-6h2.25m-2.25 2.25h2.25m-2.25 2.25h2.25" />
        </svg>
      )
    },
    {
      title: 'Yearly Report',
      href: '/reports/yearly',
      description: 'Review your annual health journey and set new milestones.',
      color: 'bg-emerald-50 text-emerald-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      )
    }
  ]

  return (
    <main className="max-w-6xl mx-auto py-12 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-slate-900 font-serif mb-3">Analytics Center</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">Gain insights into your health patterns with our comprehensive reporting tools.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <Link 
            key={report.href} 
            href={report.href}
            className="glass-card p-8 hover:shadow-xl transition-all duration-300 group flex items-start gap-6"
          >
            <div className={`p-4 rounded-xl ${report.color} group-hover:scale-110 transition-transform duration-300`}>
              {report.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {report.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {report.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}

