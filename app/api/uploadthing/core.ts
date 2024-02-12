import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getSession } from "next-auth/react";
 
const f = createUploadthing();
 
// const handleAuth = () => {
//     try {
//         const session = getSession();

//         if (!session) {
//             throw new Error("Unauthorized");
//         }
//         return session;
//     } catch (error) {
//         console.error("Error during authentication:", error);
//         throw error; // Rethrow the error to propagate it further
//     }
// }
 
//TODO: add authorization

export const ourFileRouter = {
    serverImage: f({image: {maxFileSize:"4MB", maxFileCount:1}})
    .onUploadComplete(() => {}),
    messageFile: f(["image", "pdf"])
    .onUploadComplete(() => {})
  
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;