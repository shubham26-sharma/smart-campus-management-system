'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ShieldAlert } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#f6f8fb] flex flex-col items-center justify-center p-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-4 border border-rose-200">
        <ShieldAlert className="size-8" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        403 — Restricted Institutional Access
      </h1>
      <p className="mt-2 max-w-md text-xs text-slate-500 leading-relaxed">
        Your current role does not possess the requisite security clearance to view this module.
        Administrative authorization or elevated department privileges are required.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#1b4d9b] px-4 py-2 text-xs font-bold text-white hover:bg-[#153e7e] transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Return to Authorized Workspace
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Switch Account
        </Link>
      </div>
    </div>
  )
}
