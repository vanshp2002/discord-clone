import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Member from "@/models/member";
import { ObjectId } from "mongodb"; // Import ObjectId


export async function POST(req: Request) {
    try{
        await connectMongoDB();
        const {serverId, userId} = await req.json();
        const objectId1 = new ObjectId(serverId);
        const objectId2= new ObjectId(userId);

        const member = await Member.findOne({serverId: objectId1, userId: objectId2}).populate('userId');

        if (!member) {
            // Member not found, return appropriate response
            return NextResponse.json({"error":"member not found!"});
        }

        // Return the populated member
        return NextResponse.json({ member });
    }
    catch(error){
        console.log(error);
    }
}