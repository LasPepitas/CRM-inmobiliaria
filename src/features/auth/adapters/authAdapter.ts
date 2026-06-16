import type { RegisterResponse } from '../types'

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  role: string
  createdAt: Date
  updatedAt: Date
}

export function adaptUser(apiData: RegisterResponse['data']): AuthUser {
  return {
    id: apiData.id,
    email: apiData.email,
    firstName: apiData.firstName,
    lastName: apiData.lastName,
    fullName: `${apiData.firstName} ${apiData.lastName}`,
    role: apiData.role,
    createdAt: new Date(apiData.createdAt),
    updatedAt: new Date(apiData.updatedAt),
  }
}