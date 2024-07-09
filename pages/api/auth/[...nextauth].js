
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth"
const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "mailto:abc@vu.edu.pk",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;
        const { email, password } = credentials;

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BE_URL}/auth/signin`,
            {
              method: "POST",
              body: JSON.stringify({
                email,
                password,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!res.ok) {
            const errorResponse = await res.json();
            throw new Error(errorResponse.message || "Authentication Failed");
          }

          const user = await res.json();
          if (user) {
            // console.log('user => ', user)
            // console.log('user => ', user.data.access_token)
            return user;}
        } catch (error) {
          console.error(error);
          throw new Error(error.message);
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/",
    signOut:"/",
  },

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token;
      console.log(session)
      return session;
    },
  },
};

export default NextAuth(authOptions)
