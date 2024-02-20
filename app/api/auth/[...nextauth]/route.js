import { connectMongoDB } from "@/lib/mongodb.js";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/user";

export const authOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",

            credentials: {},

            async authorize(credentials) {
                const { email, password } = credentials;
                
                try {
                    await connectMongoDB();
                    const user = await User.findOne({ email });

                    if (user) {
                        const isValid = await bcrypt.compare(password, user.password);
                        if (isValid) {
                            return user;
                        }                    
                    }
                    return null;
                }
                catch (error) {
                    console.log(error);
                }
            }
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
