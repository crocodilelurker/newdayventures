import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import { User, IUser } from "@/lib/models/User";
import { Admin } from "@/lib/models/Admin";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                await dbConnect();

                
                const user = await User.findOne({ email: credentials.email }).select("+password");

                if (user) {
                    if (!user.password) {
                        throw new Error("Please log in with the provider you used to sign up");
                    }

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isPasswordValid) {
                        throw new Error("Invalid password");
                    }

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role || "user",
                    };
                }

                
                const admin = await Admin.findOne({ email: credentials.email }).select("+password");

                if (!admin) {
                    throw new Error("No user or admin found with this email");
                }

                if (!admin.password) {
                    throw new Error("Admin password not set");
                }

                const isAdminPasswordValid = await bcrypt.compare(credentials.password, admin.password);

                if (!isAdminPasswordValid) {
                    throw new Error("Invalid password");
                }

                return {
                    id: admin._id.toString(),
                    name: "Admin",
                    email: admin.email,
                    role: admin.role || "admin",
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
