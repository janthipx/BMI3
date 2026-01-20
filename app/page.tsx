import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-3xl"></div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <div className="space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 text-sm font-medium mb-4">
            ✨ Premium Health Tracking
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-serif text-slate-900 tracking-tight">
            BMI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Elite</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-slate-600 leading-relaxed">
            Elevate your health journey with precision tracking. 
            Monitor your Body Mass Index, visualize trends, and achieve your wellness goals with elegance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link href="/register" className="btn-primary px-8 py-4 text-lg w-full sm:w-auto min-w-[200px] justify-center shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              Start Your Journey
            </Link>
            <Link href="/login" className="px-8 py-4 text-lg w-full sm:w-auto min-w-[200px] rounded-xl border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-700 font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-300 shadow-sm hover:shadow-md">
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
          <div className="glass-card p-6 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Instant Analysis</h3>
            <p className="text-slate-500 text-sm">Get immediate feedback on your BMI category with real-time calculations as you type.</p>
          </div>

          <div className="glass-card p-6 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Historical Tracking</h3>
            <p className="text-slate-500 text-sm">View your complete history and visualize your progress over time with detailed logs.</p>
          </div>

          <div className="glass-card p-6 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Secure & Private</h3>
            <p className="text-slate-500 text-sm">Your health data is personal. We ensure your information is stored securely and privately.</p>
          </div>
        </div>
      </div>
    </main>
  )
}

