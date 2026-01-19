import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold">BMI WebApp</h1>
      <p>Calculate and track your BMI with detailed MIS reports</p>
      <div className="flex gap-4">
        <Link href="/login" className="px-4 py-2 rounded bg-blue-600 text-white">
          Login
        </Link>
        <Link href="/register" className="px-4 py-2 rounded border border-blue-600 text-blue-600">
          Register
        </Link>
      </div>
    </main>
  )
}

