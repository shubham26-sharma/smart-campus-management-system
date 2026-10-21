'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { Role } from '@/types'

export default function LoginPage() {
  const router = useRouter()
  const { setRole } = useAuth()

  const [email, setEmail] = useState('arjun.kumar@smartcampus.edu')
  const [password, setPassword] = useState('SmartCampus@2026')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleRoleQuickFill = (roleName: Role, emailVal: string) => {
    setEmail(emailVal)
    setPassword('SmartCampus@2026')
    setRole(roleName)
    setErrorMsg('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid institution email address.')
      return
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your ERP access password.')
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      // Determine role from email
      if (email.includes('director')) {
        setRole('Management')
      } else if (email.includes('hod')) {
        setRole('HOD')
      } else if (email.includes('admin')) {
        setRole('Admin')
      } else if (email.includes('aarav') || email.includes('student') || email.includes('cse118')) {
        setRole('Student')
      } else {
        setRole('Faculty')
      }

      setIsLoading(false)
      router.push('/')
    }, 600)
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Logo */}
        <div className="flex justify-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[#152a55] text-white shadow-md">
            <GraduationCap className="size-7" />
          </div>
        </div>
        <h1 className="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900">
          Smart Campus
        </h1>
        <p className="mt-1 text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Academic ERP · Session 2026–2027
        </p>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          {errorMsg && (
            <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Institutional Email Identifier
              </label>
              <div className="relative">
                <Mail className="size-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@smartcampus.edu"
                  className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-slate-900 outline-none focus:border-[#1b4d9b]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-semibold text-[#1b4d9b] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="size-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-slate-200 pl-9 pr-10 py-2 text-slate-900 outline-none focus:border-[#1b4d9b]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-4 rounded border-slate-300 text-[#1b4d9b] focus:ring-[#1b4d9b]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600 font-medium">
                Remember this trusted device
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#1b4d9b] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#153e7e] transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Authenticating with Central Directory...' : 'Sign In to Workspace'}
            </button>
          </form>

          {/* Quick Demo Role Auto-Fill Pills */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-2.5 text-center">
              Quick Role Test Fill (Demo Workspace)
            </p>
            <div className="grid grid-cols-2 gap-2 text-center">
              <button
                type="button"
                onClick={() => handleRoleQuickFill('Management', 'director@smartcampus.edu')}
                className="rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-[11px] font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50/40 transition-colors"
              >
                Director / Management
              </button>
              <button
                type="button"
                onClick={() => handleRoleQuickFill('HOD', 'hod.cse@smartcampus.edu')}
                className="rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-[11px] font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50/40 transition-colors"
              >
                Dr. Kulkarni (HOD CSE)
              </button>
              <button
                type="button"
                onClick={() => handleRoleQuickFill('Faculty', 'arjun.kumar@smartcampus.edu')}
                className="rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-[11px] font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50/40 transition-colors"
              >
                Prof. Arjun (Faculty)
              </button>
              <button
                type="button"
                onClick={() => handleRoleQuickFill('Student', 'aarav.24cse118@smartcampus.edu')}
                className="rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-[11px] font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50/40 transition-colors"
              >
                Aarav (24CSE118)
              </button>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-[11px] text-slate-400">
          Institutional access managed by Central IT Cell · Smart Campus ERP v2.4
        </p>
      </div>
    </div>
  )
}
