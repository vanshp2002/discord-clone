"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { InitialModal } from "@/components/modals/initial-modal";

const SetupPage = () => {

    const { data: session } = useSession();
    const [userData, setUserData] = useState(null);
    const router = useRouter();

    useEffect(() => {

        const fetchData = async () => {
            try {

              const userfind = await fetch("/api/fetchUserProfile", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: session?.user?.email,
                }),
              });


            const { user } = await userfind.json();
            setUserData(user);
      
              const serverfind = await fetch("/api/findServer", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  profileId: user._id, 
                }),
              });
      
              const { server } = await serverfind.json();

            // if (server) {
            //     router.push(`/channels/${server._id}`);
            // }
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          };
      
          fetchData();

    }, [session, router]);


    return (
        <div>
          {/* <h1>{session?.user?.email}</h1> */}
          
            <InitialModal email={session?.user?.email} />
        </div>
    )
}

export default SetupPage;
