import type { RegisterResponse, AuthUser } from '../types'

export function adaptUser(apiData: RegisterResponse): AuthUser {
  return {
    id: apiData.id,
    email: apiData.email,
    firstName: apiData.firstName,
    lastName: apiData.lastName,
    fullName: `${apiData.firstName} ${apiData.lastName}`,
    role: apiData.role,
    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt,
  }
}