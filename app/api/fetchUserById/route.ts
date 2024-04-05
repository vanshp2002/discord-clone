import { connectMongoDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try{
        await connectMongoDB();
        const { userId } = await req.json();
        const user = await User.findById(new ObjectId(userId));

        return NextResponse.json({user});
    } catch (error) {
        console.log(error);
    }
}