"use client";

import React from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Channel from "@/models/channel";
import ServerHeader from './server-header';

interface ServerSidebarProps{
    serverId: string;
}

const ServerSidebar = ({serverId}: ServerSidebarProps) => {
    
    const { data: session } = useSession();
    const router = useRouter();
    const [ser, setSer] = useState(null);
    const [role, setRole] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
    }, [])
    
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
                console.log(user);
                const servers = await fetch("/api/servers/getserverchannelsmembers", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        serverId: serverId,
                    })
                });
                if (!servers) {
                    router.push("/");
                }
                const toJson = await servers.json();
                const channels = toJson.server.channels;
                const allMembers = toJson.server.members;
                setSer(toJson.server);
                const textChannels = channels?.filter((channel: { type: any; }) => channel.type === 'TEXT');
                const audioChannels = channels?.filter((channel: { type: any; }) => channel.type === 'AUDIO');
                const videoChannels = channels?.filter((channel: { type: any; }) => channel.type === 'VIDEO');
                
                const members = allMembers?.filter((member: { userId: any; }) => member.userId._id !== user._id.toString());

                const role = allMembers?.find((member: { userId: any; }) => member.userId._id === user._id.toString())?.role;
                
                // console.log(ser);

                setRole(role);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

    }, [session, router]);
    
        if (!isMounted) {
            return null;
        }
    
    return (
        <div className="flex flex-col h-full tetx-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            {ser && role && <ServerHeader server={ser} role={role}/>}               
        </div>
    )
}

export default ServerSidebar