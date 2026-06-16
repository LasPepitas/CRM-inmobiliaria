import { apiClient } from '@/lib/api-client'
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types'

export async function loginApi(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
  return response.data
}

export async function registerApi(userData: RegisterRequest): Promise<RegisterResponse> {
  const response = await apiClient.post<RegisterResponse>('/auth/register', userData)
  return response.data
}