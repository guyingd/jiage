import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { AuthOptions } from "next-auth"

const ADMIN_EMAIL = "2739218253@qq.com"
const ADMIN_PASSWORD = bcrypt.hashSync("admin123", 10) // 在实际应用中应该存储在环境变量中

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        if (credentials.email !== ADMIN_EMAIL) {
          return null
        }

        const isValid = bcrypt.compareSync(credentials.password, ADMIN_PASSWORD)
        if (!isValid) {
          return null
        }

        return {
          id: "1",
          email: ADMIN_EMAIL,
          name: "管理员"
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = "admin"
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "your-default-secret"
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 