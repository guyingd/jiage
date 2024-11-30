import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { loginSchema } from './validations'

// 固定的登录凭据
const VALID_CREDENTIALS = {
  email: '2739218253@qq.com',
  password: 'admin123'
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) {
          console.log('No credentials provided')
          return null
        }

        try {
          // 验证输入
          const { email, password } = await loginSchema.parseAsync(credentials)
          console.log('Input validated:', { email })

          // 直接比较凭据
          if (email === VALID_CREDENTIALS.email && 
              password === VALID_CREDENTIALS.password) {
            console.log('Login successful')
            return {
              id: '1',
              name: '管理员',
              email: VALID_CREDENTIALS.email
            }
          }

          console.log('Invalid credentials')
          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  }
} 