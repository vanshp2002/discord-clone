import { NextResponse } from "next/server";
import {connectMongoDB} from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";


export const POST = async (request: any) => {
    const { email, password, username, displayname } = await request.json();
    await connectMongoDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return new NextResponse("Email is already in use", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ 
        email, 
        password: hashedPassword, 
        username, 
        displayname 
    });

    try {
        await newUser.save();
        return new NextResponse("User is registered", { status: 200 });
    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
}