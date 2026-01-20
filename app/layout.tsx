import './globals.css'
import type { ReactNode } from 'react'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'BMI Elite - Premium Health Tracking',
  description: 'Track your health with elegance',
}

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-indigo-100 selection:text-indigo-900">
        <Navbar />
        <div className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {props.children}
        </div>
        <footer className="py-6 text-center text-slate-500 text-sm border-t border-white/50 bg-white/60 backdrop-blur-md">
          <p className="font-serif italic text-slate-700">Designed for Excellence</p>
           <p className="mt-1 opacity-75 font-medium text-slate-700">Student ID: 67162110443-8</p>
        </footer>
      </body>
    </html>
  )
}

