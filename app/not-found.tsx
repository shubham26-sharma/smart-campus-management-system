'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f6f8fb] flex flex-col items-center justify-center p-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-[#1b4d9b] mb-4 border border-blue-200">
        <FileQuestion className="size-8" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        404 — Academic Record Not Located
      </h1>
      <p className="mt-2 max-w-md text-xs text-slate-500 leading-relaxed">
        The requested campus module, page, or document identifier could not be resolved on the server.
      </p>
      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#1b4d9b] px-4 py-2 text-xs font-bold text-white hover:bg-[#153e7e] transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Back to Smart Campus
        </Link>
      </div>
    </div>
  )
}
