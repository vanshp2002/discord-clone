import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try{
        const {email, displayname, username, password} = await req.json();
        const hashedPassword = await bcrypt.hash(password, 12);

        await connectMongoDB();
        await User.create({email, displayname, username, password: hashedPassword});

        
        return NextResponse.json({ "message": "success"},{ status: 200 });
    }
    catch(error){
        return NextResponse.json({ "message": "error"},{ status: 500 });
    }
}