
import {connectMongoDB}  from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Customer from "@/models/customer";


export async function POST(req: Request) {
    try{
        const { name, email, password } = await req.json();
        
        await connectMongoDB();

        const newCustomer = new Customer({
            name, email, password
          });
      
          const result = await Customer.collection.insertOne(newCustomer);
          return NextResponse.json(result);

    }catch(error){
        console.log("error during server POST:", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}