import Status from '@/models/status';
import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import {ObjectId} from 'mongodb';

export async function POST(req) {
    try{
        await connectMongoDB();
        const {statusId} = await req.json();
        const status = await Status.findOneAndDelete({_id: new ObjectId(statusId)});

        return NextResponse.json({status});
    } catch(err) {
        console.error(err);
    }

}
