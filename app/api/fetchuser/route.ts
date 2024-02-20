import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";

export const POST = async (request: any, response: any)=>{
    const { email } = await request.json();
    try {
        await connectMongoDB();
        const user = await User.findOne({ email });
        return NextResponse.json(user);

    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
}