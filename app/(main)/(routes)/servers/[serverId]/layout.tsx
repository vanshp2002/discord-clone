"use client";

import React from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ServerSidebar from '@/components/server/server-sidebar';

const ServerIdLayout = ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { serverId: string };
}) => {


    const { data: session } = useSession();
    const router = useRouter();
    const [server, setServer] = useState(null);
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

                if (!userfind) {
                    router.push("/login");
                }
                const user = await userfind.json();
                const servers = await fetch("/api/servers/getserverid", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        serverId: params.serverId,
                        profileId: user._id
                    })
                });
                if (!servers) {
                    router.push("/");
                }
                const toJson = await servers.json();
                setServer(toJson.server);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

    }, [session, router]);

    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                <ServerSidebar serverId = {params.serverId.toString()}/>
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    )
}

export default ServerIdLayout