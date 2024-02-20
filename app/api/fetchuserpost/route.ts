import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Customer from "@/models/customer"; // Import Customer model

export async function POST(req: Request) {
    try {
        const { userId } = await req.json(); // Assuming userId is passed in the request body

        await connectMongoDB();
        console.log(1); 
        
        const userWithPosts = await Customer.findById(userId).populate('posts');
        
        console.log(userWithPosts.posts); 
        if (!userWithPosts) {
            return new NextResponse("User not found", { status: 404 });
        }

        return NextResponse.json(userWithPosts);
    } catch(error) {
        console.log("error during server GET:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
