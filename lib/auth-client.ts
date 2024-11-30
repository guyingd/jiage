import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: { name: string } | null
  signIn: (username: string, password: string) => Promise<boolean>
  signOut: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      signIn: async (username, password) => {
        // 简单的本地认证
        if (username === 'admin' && password === 'admin') {
          set({ user: { name: 'Admin' } })
          return true
        }
        return false
      },
      signOut: () => set({ user: null })
    }),
    {
      name: 'auth-storage'
    }
  )
) 