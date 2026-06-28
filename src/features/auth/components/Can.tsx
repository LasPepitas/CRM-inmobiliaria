import React from 'react'
import { useAuth } from '../hooks/useAuth'
import type { Permission } from '../types'

interface CanProps {
  perform: Permission
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function Can({ perform, children, fallback = null }: CanProps) {
  const { hasPermission } = useAuth()

  if (!hasPermission(perform)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
