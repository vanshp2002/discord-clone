import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { ObjectId } from "mongodb";
import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types";

// export default async function handler(req: NextRequest, res: NextResponse) {
export async function POST(req, res: NextApiResponseServerIo) {

    await connectMongoDB();

    const { userId, note, chatId } = await req.json();

    console.log(userId, note);

    if (!userId || !note) {
        return new NextResponse("Invalid input data", { status: 400 });
    }

    const user = await User.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { note },
        { new: true }
    );

    const updateKey = `chat:${chatId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, user);

    // return res.status(200).json({ user });

    return NextResponse.json({ user });
}