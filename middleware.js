export {default} from "next-auth/middleware";

export const config = { matcher : ["/channels","/temp"] };

// add public routes for /api/uploadthing