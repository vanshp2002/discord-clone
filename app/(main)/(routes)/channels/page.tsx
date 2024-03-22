
"use client";

import InitialModal from '@/components/modals/initial-modal';
import React from 'react';
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ServerState from './../../../../context/servers/serverContext';

export default function Home() {

    const { data: session } = useSession();
    const [userData, setUserData] = useState(null);
    const router = useRouter();
    const [ser, setSer] = useState(false);

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

                const serverfound = await fetch("/api/servers/getserver", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        profileId: user._id,
                    })
                })

                const { server } = await serverfound.json();

                if (server) {
                    return router.push(`/servers/${server._id}`);   
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

    }, [session, router]);


    return (
        <>
            <ServerState>
                {ser && <InitialModal email={session?.user?.email} />}
            </ServerState>
        </>
    );
}