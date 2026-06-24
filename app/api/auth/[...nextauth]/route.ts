import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { comparePassword } from "@/lib/auth/bcrypt";
import { loginLimiter } from "@/lib/auth/rateLimiter";
import { logSecurityEventWithIp } from "@/lib/auth/auditLog";

// Helper to resolve client IP in NextAuth authorize function
const getIpFromReq = (req: any): string => {
  if (!req) return "127.0.0.1";
  const xForwardedFor = req.headers?.["x-forwarded-for"];
  if (xForwardedFor) {
    if (Array.isArray(xForwardedFor)) {
      return xForwardedFor[0]?.trim() || "127.0.0.1";
    }
    return xForwardedFor.split(",")[0]?.trim() || "127.0.0.1";
  }
  return "127.0.0.1";
};

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const ip = getIpFromReq(req);

        // 1. IP Rate Limiting Check
        try {
          await loginLimiter.consume(ip);
        } catch (err) {
          throw new Error("Too many login attempts. Please try again in 15 minutes.");
        }

        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username/Email and password are required");
        }

        await connectToDatabase();
        const loginIdentifier = credentials.username.trim().toLowerCase();

        // Find the administrator
        const user = await User.findOne({
          $or: [{ username: loginIdentifier }, { email: loginIdentifier }],
        });

        if (!user || !user.password) {
          await logSecurityEventWithIp(loginIdentifier, ip, "Login Failed");
          throw new Error("Invalid username or password");
        }

        // 2. Check Account Lockout status
        if (user.lockUntil && user.lockUntil > new Date()) {
          const timeLeftMinutes = Math.ceil((user.lockUntil.getTime() - Date.now()) / (60 * 1000));
          throw new Error(
            `Account is temporarily locked due to too many failed attempts. Please try again in ${timeLeftMinutes} minutes.`
          );
        }

        // Compare password
        const isMatch = await comparePassword(credentials.password, user.password);
        if (!isMatch) {
          // Increment login attempts and lockout if limit is reached
          user.loginAttempts = (user.loginAttempts || 0) + 1;
          if (user.loginAttempts >= 5) {
            user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 mins lockout
            await logSecurityEventWithIp(user.email, ip, "Account Locked");
          }
          await user.save();

          await logSecurityEventWithIp(user.email, ip, "Login Failed");
          throw new Error("Invalid username or password");
        }

        // Reset attempts on successful login
        if (user.loginAttempts > 0 || user.lockUntil) {
          user.loginAttempts = 0;
          user.lockUntil = null;
          await user.save();
        }

        // Return user context (is2FAVerified starts as false, requires2FA is true if 2FA enabled)
        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
          role: user.role,
          requires2FA: user.twoFactorEnabled,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Runs on initial login/token creation
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.requires2FA = user.requires2FA;
        token.is2FAVerified = false; // Initially false, requires separate OTP verify
      }

      // Handle session update triggers (e.g. after successful 2FA entry or settings change)
      if (trigger === "update" && session) {
        if (session.is2FAVerified !== undefined) {
          token.is2FAVerified = session.is2FAVerified;
        }
        if (session.requires2FA !== undefined) {
          token.requires2FA = session.requires2FA;
        }
        if (session.username) token.name = session.username;
        if (session.email) token.email = session.email;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.requires2FA = token.requires2FA;
        session.user.is2FAVerified = token.is2FAVerified;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "furute-nextauth-secret-key-256",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
