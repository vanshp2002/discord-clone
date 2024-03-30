
import {connectMongoDB}  from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Post from "@/models/post";
import Customer from "@/models/customer";
import { ObjectId } from "mongodb"; // Import ObjectId


export async function POST(req: Request) {
    try{
        const { title, description, author } = await req.json();
        
        await connectMongoDB();
        const objectId = new ObjectId(author);
        const newPost = new Post({
            title,
            description,
            author: objectId
          });   
      
          const postResult = await newPost.save();
          const customerUpdateResult = await Customer.findOneAndUpdate(
            { _id: objectId }, // Find the customer by their ObjectId
            { $push: { posts: postResult._id } }, // Push the new post's _id to the posts array
            { new: true } // Return the modified customer document
        );


        return NextResponse.json(postResult);

    }catch(error){
        console.log("error during server POST:", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}