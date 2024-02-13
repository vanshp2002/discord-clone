// "use client";

// import { useSession } from "next-auth/react";
// import { connectMongoDB } from "./mongodb";
// import { NextResponse } from "next/server";
// import User from "@/models/user";

// export const currentProfile = async () => {
//     const { data: session } = useSession();

//     if (!session?.user?.email) {
//         return null;
//     }
//     await connectMongoDB();
//     const user = await User.findOne({ email: session?.user?.email });
//     // console.log("currentProfile user:", user);
//     return NextResponse.json({user});
// };

import { getSession } from "next-auth/react";
// import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "./mongodb";
import User from "@/models/user";

// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextApiRequest } from "next";

export const currentProfile = async ({email}) => {
    // const session = getSession({req});
    // console.log("currentProfile session:", session);
  //  const session = await getSession({req});
  // console.log("session.user.id", session.user.id);
  const getCurrentProfile = async ({email}) => {
    // console.log("currentProfile session:", session.user);
    // if (!session.user.email) {
    //     console.log("no session");
    //   return null;
    // }
    await connectMongoDB();
    const user = await User.collection.findOne({ email: email });
    console.log("currentProfile user:", user);
    return user;
  };

  return getCurrentProfile({email});
};