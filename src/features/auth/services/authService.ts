import { apiClient } from '@/lib/api-client'
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, AuthUser } from '../types'

export async function loginApi(credentials: LoginRequest): Promise<LoginResponse> {
  return apiClient.post<LoginResponse>('/auth/login', credentials)
}

export async function registerApi(userData: RegisterRequest): Promise<RegisterResponse> {
  return apiClient.post<RegisterResponse>('/auth/register', userData)
}

export async function getProfileApi(): Promise<AuthUser> {
  return apiClient.get<AuthUser>('/users/me')
}