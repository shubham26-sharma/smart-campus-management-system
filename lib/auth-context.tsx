'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Role, User } from '@/types'
import { mockUsers } from './mock-data'

interface AuthContextType {
  role: Role
  setRole: (role: Role) => void
  currentUser: User
  activeTab: string
  setActiveTab: (tab: string) => void
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
  assistantOpen: boolean
  setAssistantOpen: (open: boolean) => void
  notificationsOpen: boolean
  setNotificationsOpen: (open: boolean) => void
  unreadNotificationsCount: number
  setUnreadNotificationsCount: React.Dispatch<React.SetStateAction<number>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>('Management')
  const [activeTab, setActiveTab] = useState<string>('Overview')
  const [searchOpen, setSearchOpen] = useState(false)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(2)

  const currentUser = mockUsers[role]

  const setRole = (newRole: Role) => {
    setRoleState(newRole)
    if (newRole === 'HOD') {
      setActiveTab('Department overview')
    } else {
      setActiveTab('Overview')
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('smartcampus_active_role', newRole)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('smartcampus_active_role') as Role | null
      if (savedRole && ['Management', 'HOD', 'Admin', 'Faculty', 'Student'].includes(savedRole)) {
        setRoleState(savedRole)
      }
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        activeTab,
        setActiveTab,
        searchOpen,
        setSearchOpen,
        assistantOpen,
        setAssistantOpen,
        notificationsOpen,
        setNotificationsOpen,
        unreadNotificationsCount,
        setUnreadNotificationsCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
