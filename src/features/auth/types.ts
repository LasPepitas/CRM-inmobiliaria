export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: 'GENERAL_MANAGER' | 'COMMERCIAL_MANAGER' | 'INTERNAL_ADVISOR' | 'EXTERNAL_ADVISOR'
}

export interface LoginResponse {
  success: boolean
  data: {
    access_token: string
  }
}

export interface RegisterResponse {
  success: boolean
  data: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
    createdAt: string
    updatedAt: string
  }
}