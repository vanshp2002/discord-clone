import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { useSession } from "next-auth/react";
import User from "@/models/user";


const f = createUploadthing();

// const handleAuth = async () => {
//     const { data: session } = useSession();

//     let userExists = session?.user;

//     if (!userExists) throw new Error("Unauthorized");

//     const fetchuser = await fetch("/api/fetchuser", {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             email: session?.user?.email
//         })

//     })
//     const { user } = await fetchuser.json();
//     console.log(user._id);
//     return { userId: user._id };
// }

export const ourFileRouter = {
    serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .onUploadComplete(() => { }),
    messageFile: f(["image", "pdf"])
        .onUploadComplete(() => { }),
    statusFile: f(["image", "video/mp4", "video/mpeg"])
        .onUploadComplete(() => { }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;