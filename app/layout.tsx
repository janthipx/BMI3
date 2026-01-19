import './globals.css'
import type { ReactNode } from 'react'

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="th">
      <body className="flex flex-col min-h-screen">
        <div className="flex-grow">
          {props.children}
        </div>
        <footer className="py-4 text-center text-gray-500 text-sm border-t bg-slate-50">
          67162110443-8
        </footer>
      </body>
    </html>
  )
}

