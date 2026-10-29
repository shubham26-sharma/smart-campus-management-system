import { mockDepartments } from '@/lib/mock-data'
import { Notice, Role } from '@/types'

function matchesDepartment(target: string, department: string) {
  const normalizedTarget = target.trim().toLowerCase()
  const normalizedDepartment = department.trim().toLowerCase()
  if (normalizedTarget === 'all departments' || normalizedTarget === normalizedDepartment) return true

  const departmentCode = mockDepartments.find(
    (item) => item.name.toLowerCase() === normalizedDepartment
  )?.code
  return Boolean(departmentCode && normalizedTarget.includes(departmentCode.toLowerCase()))
}

export function canViewNotice(notice: Notice, role: Role, department: string) {
  if (role === 'Admin' || role === 'Management') return true
  if (notice.department && !matchesDepartment(notice.department, department)) return false
  if (notice.audience === 'All') return true

  return (
    (role === 'Student' && notice.audience === 'Students') ||
    (role === 'Faculty' && notice.audience === 'Faculty') ||
    (role === 'HOD' && notice.audience === 'HOD')
  )
}
