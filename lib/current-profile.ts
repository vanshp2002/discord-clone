"use client";

import { useSession } from "next-auth/react";
import { connectMongoDB } from "./mongodb";
import { NextResponse } from "next/server";
import User from "@/models/user";

export const currentProfile = async () => {
    const { data: session } = useSession();

    if (!session?.user?.email) {
        return null;
    }
    await connectMongoDB();
    const user = await User.findOne({ email: session?.user?.email });
    console.log("currentProfile user:", user);
    return NextResponse.json({user});
};
