"use client";
import React from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
interface ServerIdPageProps {
  params:{
    serverId: string;
  }
}

const serverPage = ({
  params
}: ServerIdPageProps) => {
  const { data: session } = useSession();
    const router = useRouter();
    const [genchannel, setGenchannel] = useState(null);
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
                if (!userfind) {
                    router.push("/login");
                }
                const generalchannel = await fetch("/api/servers/getgenchannel", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        serverId: params.serverId,
                    })
                });
                if (!generalchannel) {
                    router.push("/"); 
                }
                const {channel} = await generalchannel.json();
                return router.push(`/servers/${params.serverId}/channels/${channel?._id}`)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

    }, []);
  return (
    <div>ServerIdPage</div>
  )
}

export default serverPage