'use client'

import React, { useState } from 'react'
import {
  Bell,
  Check,
  Key,
  Lock,
  LogOut,
  Mail,
  Phone,
  Shield,
  User,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export function ProfileModule() {
  const { role, currentUser } = useAuth()

  const [name, setName] = useState(currentUser.name)
  const [phone, setPhone] = useState(currentUser.phone || '+91 98440 88994')
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Password Change State
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdMsg, setPwdMsg] = useState('')

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPwd || !newPwd) {
      setPwdMsg('Please fill out all password fields.')
      return
    }
    if (newPwd !== confirmPwd) {
      setPwdMsg('New password and confirmation do not match.')
      return
    }
    if (newPwd.length < 8) {
      setPwdMsg('Password must be at least 8 characters.')
      return
    }
    setPwdMsg('Password updated successfully.')
    setCurrentPwd('')
    setNewPwd('')
    setConfirmPwd('')
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-slate-900">Account Profile & Security Settings</h2>
        <p className="text-xs text-slate-500">
          Manage your personal details, credentials, and notification settings
        </p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
          <Check className="size-4 text-emerald-600" /> Profile information updated successfully.
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-[#1b4d9b] text-white text-lg font-bold shadow-xs">
              {currentUser.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{currentUser.name}</h3>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-[#1b4d9b] border border-blue-200/60">
                  {role} Access
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{currentUser.department}</p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">
              Account Status
            </span>
            <span className="font-bold text-emerald-700">Verified & Active</span>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSaveProfile} className="mt-5 space-y-4 text-xs">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none focus:border-[#1b4d9b]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none focus:border-[#1b4d9b]"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Institutional Email (Locked)
              </label>
              <input
                type="email"
                value={currentUser.email}
                readOnly
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-500 outline-none cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Assigned Role & Privileges (System Controlled)
              </label>
              <input
                type="text"
                value={`${role} Workspace`}
                readOnly
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-500 outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="rounded-lg bg-[#1b4d9b] px-4 py-2 font-bold text-white hover:bg-[#153e7e] transition-colors"
            >
              Update Profile Details
            </button>
          </div>
        </form>
      </div>

      {/* Password Change Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Key className="size-4 text-[#1b4d9b]" />
          <h3 className="text-sm font-bold text-slate-900">Change ERP Access Password</h3>
        </div>

        {pwdMsg && (
          <p
            className={`mt-3 text-xs font-semibold ${
              pwdMsg.includes('successfully') ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {pwdMsg}
          </p>
        )}

        <form onSubmit={handleChangePassword} className="mt-4 space-y-3 text-xs max-w-md">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none focus:border-[#1b4d9b]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">New Strong Password</label>
            <input
              type="password"
              placeholder="Min. 8 characters with numbers"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none focus:border-[#1b4d9b]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none focus:border-[#1b4d9b]"
            />
          </div>

          <button
            type="submit"
            className="mt-2 rounded-lg bg-slate-900 px-4 py-2 font-bold text-white hover:bg-slate-800 transition-colors"
          >
            Update Credentials
          </button>
        </form>
      </div>
    </div>
  )
}
