import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      // GitHub accounts with a private email return `email: null` in the
      // profile, which makes PrismaAdapter fail to create/sign in the user
      // (User.email is required). Fetch the primary verified email instead.
      allowDangerousEmailAccountLinking: true,
      async profile(profile, tokens) {
        let email = profile.email as string | null
        if (!email && tokens.access_token) {
          try {
            const res = await fetch("https://api.github.com/user/emails", {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
                Accept: "application/vnd.github+json",
                "User-Agent": "job-list",
              },
            })
            if (res.ok) {
              const emails = (await res.json()) as {
                email: string
                primary: boolean
                verified: boolean
              }[]
              const best =
                emails.find((e) => e.primary && e.verified) ??
                emails.find((e) => e.verified) ??
                emails[0]
              email = best?.email ?? null
            }
          } catch (error) {
            console.warn("Could not fetch GitHub user emails", error)
          }
        }
        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          email,
          image: profile.avatar_url,
        }
      },
    }),
    Google,
  ],
})
