import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Member from "@/models/member";
import { ObjectId } from "mongodb"; // Import ObjectId


export async function POST(req: Request) {
    try{
        await connectMongoDB();
        const {memberId} = await req.json();
        const objectId = new ObjectId(memberId);

        const member = await Member.findById(objectId).populate('userId');

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