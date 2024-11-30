import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { loginSchema } from './validations'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "用户名", type: "text" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null

        try {
          // 验证输入
          const { username, password } = await loginSchema.parseAsync(credentials)

          // 在实际应用中，这里应该查询数据库
          const validUsername = 'admin'
          const validPassword = await bcrypt.hash('admin123', 10)

          if (username === validUsername && 
              await bcrypt.compare(password, validPassword)) {
            return {
              id: '1',
              name: username,
              email: '2739218253@qq.com'
            }
          }

          return null
        } catch {
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