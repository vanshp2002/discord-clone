// find server will take a profileId and return the first server that has that profileId

import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Server from "@/models/server";
import { ObjectId } from 'mongodb';

export async function POST(req) {
    try{
        await connectMongoDB();
        const {profileId} = await req.json();
        const server = await Server.collection.findOne({
            profileId: profileId
        });
        // console.log(server);
        return NextResponse.json({server});
    }
    catch(error){
        console.log(error);
    }
}