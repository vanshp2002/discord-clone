import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Member from "@/models/member";
import Server from "@/models/server";
import { ObjectId } from "mongodb"; // Import ObjectId

export async function POST(req) {
    try {
        await connectMongoDB();
        
        const { serverId } = await req.json();

        const server = await Server.findById(serverId);

        if (!server) {
            return NextResponse.json({ error: "Server not found" });
        }

        await Member.deleteMany({ serverId: server._id });

        await Server.findByIdAndDelete(server._id);

        return NextResponse.json({ message: "Server and associated members deleted successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.error(error);
    }
}
