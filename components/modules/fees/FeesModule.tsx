'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { apiClient } from '@/lib/api-client'
import { DataSourceIndicator } from '@/components/ui/data-source-indicator'
import { mockStudents } from '@/lib/mock-data'
import { FeeRecord, Student } from '@/types'

type PaymentFilter = 'All' | FeeRecord['paymentStatus']
type DepartmentFilter = 'All' | string

export function FeesModule() {
  const { currentUser, role } = useAuth()
  const isCampusFinanceRole = role === 'Admin' || role === 'Management'
  const student = mockStudents.find((item) => item.rollNumber === currentUser.rollNumber)
  const [campusStudents, setCampusStudents] = useState<Student[]>([])
  const [feeRecord, setFeeRecord] = useState<FeeRecord | null>(null)
  const [isMock, setIsMock] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('All')
  const [departmentFilter, setDepartmentFilter] = useState<DepartmentFilter>('All')

  useEffect(() => {
    let active = true
    if (role === 'Student') {
      if (!student) {
        setError('Your student record could not be matched to a fee statement.')
        setIsLoading(false)
        return () => {
          active = false
        }
      }

      apiClient.getFeeRecord(student.id)
        .then((response) => {
          if (!active) return
          if (response.data.studentId !== student.id) {
            setError('The fee statement response did not match your student record.')
            return
          }
          setFeeRecord(response.data)
          setIsMock(response.isMock === true)
        })
        .catch(() => {
          if (active) setError('Your fee statement could not be loaded.')
        })
        .finally(() => {
          if (active) setIsLoading(false)
        })
    } else if (isCampusFinanceRole) {
      apiClient.getStudents()
        .then((response) => {
          if (!active) return
          setCampusStudents(response.data)
          setIsMock(response.isMock === true)
        })
        .catch(() => {
          if (active) setError('Campus fee status records could not be loaded.')
        })
        .finally(() => {
          if (active) setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }

    return () => {
      active = false
    }
  }, [isCampusFinanceRole, role, student])

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase()
    return campusStudents.filter((item) => {
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.rollNumber.toLowerCase().includes(query) ||
        item.department.toLowerCase().includes(query)
      const matchesStatus = paymentFilter === 'All' || item.feeStatus === paymentFilter
      const matchesDepartment = departmentFilter === 'All' || item.department === departmentFilter
      return matchesSearch && matchesStatus && matchesDepartment
    })
  }, [campusStudents, departmentFilter, paymentFilter, search])

  if (!isCampusFinanceRole && role !== 'Student') {
    return (
      <p className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800" role="alert">
        Fee records are not available to this role.
      </p>
    )
  }

  if (isLoading) return <p className="text-xs text-slate-500">Loading fee records…</p>
  if (error) return <p className="text-xs text-rose-700" role="alert">{error}</p>

  if (role === 'Student') {
    if (!feeRecord) {
      return <p className="text-xs text-slate-500">No fee statement is available.</p>
    }

    return (
      <div className="space-y-5">
        <header>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">My fee statement</h2>
            {isMock && <DataSourceIndicator />}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {feeRecord.semester} · Academic year {feeRecord.academicYear}
          </p>
        </header>
        <div className="grid gap-3 sm:grid-cols-3">
          <FeeMetric label="Total assessed" amount={feeRecord.totalFee} />
          <FeeMetric label="Paid" amount={feeRecord.paidAmount} />
          <FeeMetric label="Outstanding" amount={feeRecord.pendingAmount} />
        </div>
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-bold text-slate-900">Payment details</h3>
          <dl className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
            <FeeDetail label="Payment status" value={feeRecord.paymentStatus} />
            <FeeDetail label="Due date" value={feeRecord.dueDate} />
            <FeeDetail label="Receipt number" value={feeRecord.receiptNumber ?? 'Not available'} />
            <FeeDetail label="Last payment" value={feeRecord.lastPaymentDate ?? 'Not available'} />
          </dl>
        </section>
      </div>
    )
  }

  const counts = campusStudents.reduce(
    (result, item) => ({ ...result, [item.feeStatus]: result[item.feeStatus] + 1 }),
    { Paid: 0, Partial: 0, Overdue: 0 }
  )

  return (
    <div className="space-y-5">
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-bold text-slate-900">Campus fee status</h2>
          {isMock && <DataSourceIndicator />}
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Campus-wide student directory status; itemized fee ledgers are not available from the current API.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-4">
        <FeeCount label="Students listed" value={campusStudents.length} />
        <FeeCount label="Paid status" value={counts.Paid} />
        <FeeCount label="Partial status" value={counts.Partial} />
        <FeeCount label="Overdue status" value={counts.Overdue} />
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-bold text-slate-900">Student fee status records</h3>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative">
              <span className="sr-only">Search students</span>
              <Search className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, roll, department"
                className="min-h-9 w-full rounded-lg border border-slate-200 pl-8 pr-3 text-xs outline-none focus:border-[#1b4d9b] sm:w-64"
              />
            </label>
            <label>
              <span className="sr-only">Filter by payment status</span>
              <select
                value={paymentFilter}
                onChange={(event) => setPaymentFilter(event.target.value as PaymentFilter)}
                className="min-h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700"
              >
                <option value="All">All statuses</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Overdue">Overdue</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Filter by department</span>
              <select
                value={departmentFilter}
                onChange={(event) => setDepartmentFilter(event.target.value)}
                className="min-h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700"
              >
                <option value="All">All departments</option>
                {[...new Set(campusStudents.map((item) => item.department))].sort().map((department) => (
                  <option key={department} value={department}>{department}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Roll number</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Semester</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-semibold text-slate-800">{item.name}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{item.rollNumber}</td>
                  <td className="px-4 py-3 text-slate-600">{item.department}</td>
                  <td className="px-4 py-3 text-slate-600">{item.semester}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusClass(item.feeStatus)}`}>
                      {item.feeStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-xs text-slate-500">
                    No students match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function FeeMetric({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-[#152a55]">₹{amount.toLocaleString('en-IN')}</p>
    </div>
  )
}

function FeeDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase text-slate-400">{label}</dt>
      <dd className="mt-1 font-medium text-slate-700">{value}</dd>
    </div>
  )
}

function FeeCount({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#152a55]">{value}</p>
    </div>
  )
}

function statusClass(status: Student['feeStatus']) {
  if (status === 'Paid') return 'bg-emerald-50 text-emerald-700'
  if (status === 'Partial') return 'bg-amber-50 text-amber-800'
  return 'bg-rose-50 text-rose-700'
}
