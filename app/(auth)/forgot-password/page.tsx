'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, GraduationCap, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[#152a55] text-white shadow-md">
            <GraduationCap className="size-7" />
          </div>
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          Reset Your Access Password
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Enter your registered campus email to receive security instructions
        </p>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          {isSubmitted ? (
            <div className="text-center space-y-4">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="size-6" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Recovery Instructions Dispatched</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                If an institutional account exists for <span className="font-semibold text-slate-800">{email}</span>, a secure password reset link has been dispatched.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b4d9b] hover:underline"
                >
                  <ArrowLeft className="size-3.5" /> Return to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Institutional Email Address
                </label>
                <div className="relative">
                  <Mail className="size-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@smartcampus.edu"
                    className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-slate-900 outline-none focus:border-[#1b4d9b]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#1b4d9b] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#153e7e] transition-colors"
              >
                Send Password Reset Link
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800"
                >
                  <ArrowLeft className="size-3" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
