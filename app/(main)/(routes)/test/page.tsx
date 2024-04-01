"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Test = () => {

    const { data: session } = useSession();
    const [userData, setUserData] = useState(null);
    const router = useRouter();

    useEffect(() => {

        const fetchData = async () => {
            try {

                const userfind = await fetch("/api/fetchuser", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: session?.user?.email,
                    }),
                });


                const user = await userfind.json();
                setUserData(user);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

    }, []);


    return (
        <div>
            Create a Server

        </div>
    )
}

export default Test;