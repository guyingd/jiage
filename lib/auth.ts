import { useAuth } from './auth-client'

export function getAuthStatus() {
  return useAuth.getState().user !== null
}

export function requireAuth() {
  if (!getAuthStatus()) {
    window.location.href = '/login'
  }
} 