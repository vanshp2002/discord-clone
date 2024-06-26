import {connectMongoDB} from "@/lib/mongodb";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/user";

export const authOptions: AuthOptions = {
    providers:[
        CredentialsProvider({
            name: "Credentials",
            credentials : {},

            async authorize(credentials){
                const {email, password} = credentials;
                try{
                    await connectMongoDB();
                    const user = await User.findOne({email});

                    if (!user) {
                        return null;
                    }

                    const isValid = await bcrypt.compare(password, user.password);

                    if(!isValid){
                        return null;
                    }  

                    return user;
                }
                catch(error){
                    console.log(error);
                }
            }
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages:{
        signIn: "/login",
    },
};