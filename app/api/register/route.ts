import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

const logos = ["https://utfs.io/f/58436a22-f736-4bbf-8fd3-f3f41004613e-ahjm7s.png",
    "https://utfs.io/f/521a17cb-8c9e-4745-94b4-cfa06fd3131b-u1o2eu.png",
    "https://utfs.io/f/3e0380b5-e3e4-4af4-8ef6-dc1d2197f53b-ahjm4c.png",
    "https://utfs.io/f/ccd55b1c-b63c-42c6-aa14-89c65c493b5f-ahjmb8.png",
    "https://utfs.io/f/7fc4eaaf-0fd5-4743-9305-094945428065-ahjm62.png",
    "https://utfs.io/f/dc0a14ac-471a-4e5c-a125-7e6077658c9e-ahjm8n.png",
    "https://utfs.io/f/924fb641-1a9d-4085-9d7f-4e94adea8b68-u1o2fp.png",
    "https://utfs.io/f/0cfeba60-d20d-4b1b-9eb7-22742785ccd3-ahjm9i.png",
    "https://utfs.io/f/6b76cffa-6d73-466e-8b38-af60187ee4a1-ahjmad.png",
    "https://utfs.io/f/2f7ac526-53b1-4d06-8ebd-14b67a843b42-u1o2gk.png"]

const bannerColors = ["#E64379", "#2D767F", "#BD43E6", "#1A2639", "#435EE6", "#43B0E6", "#5D5D5A", "#43E651", "#FF832A", "#E64343"]

export const POST = async (request: any) => {
    const { email, password, username, displayname } = await request.json();
    await connectMongoDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return new NextResponse("Email is already in use", { status: 400 });
    }

    const randomNumber = Math.floor(Math.random() * 10);

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
        email,
        password: hashedPassword,
        username,
        displayname,
        imageUrl: logos[randomNumber],
        bannerColor: bannerColors[randomNumber]
    });

    try {
        await newUser.save();
        return new NextResponse("User is registered", { status: 200 });
    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
}