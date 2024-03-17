"use client";

import React from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Channel from "@/models/channel";
import ServerHeader from './server-header';
import ServerSearch from './server-search';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';

interface ServerSidebarProps{
    serverId: string;
}

const iconMap = {
    "TEXT": <Hash className="mr-2 h-4 w-4"/>,
    "AUDIO": <Mic className="mr-2 h-4 w-4"/>,
    "VIDEO": <Video className="mr-2 h-4 w-4"/>
}

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />,
    "ADMIN": <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />
}

const ServerSidebar = ({serverId}: ServerSidebarProps) => {
    
    const { data: session } = useSession();
    const router = useRouter();
    const [ser, setSer] = useState(null);
    const [userdata, setUserdata] = useState(null);
    const [role, setRole] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const [textChannels, setTextChannels] = useState([]);
    const [audioChannels, setAudioChannels] = useState([]);
    const [videoChannels, setVideoChannels] = useState([]);
    const [members, setMembers] = useState([])
    useEffect(() => {
        setIsMounted(true);
    }, [])
    
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

                if(!userfind){
                    router.push("/");
                }
                
                const user  = await userfind.json();
                setUserdata(user);
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
                // console.log(toJson.server);  
                const channels = toJson.server.channels;
                const response = await fetch("/api/servers/getmembersdata", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        members: toJson.server.members
                    })
                });
                const data = await response.json();
                const allMembers = await Object.values(data.members);

                setSer(toJson.server);

                const textChannels1 = channels?.filter((channel: { type: any; }) => channel.type === 'TEXT')
                setTextChannels(textChannels1);
                const audioChannels1 = channels?.filter((channel: { type: any; }) => channel.type === 'AUDIO')
                setAudioChannels(audioChannels1);
                const videoChannels1 = channels?.filter((channel: { type: any; }) => channel.type === 'VIDEO')
                setVideoChannels(videoChannels1);
                const members1 = allMembers?.filter((member: { type: any; }) => member.userId._id !== user._id);
                setMembers(members1);
                const role = allMembers?.find((member: { type: any; }) => member.userId._id === user._id)?.role;
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
            {<ServerHeader user={userdata} server={ser} role={role}/>}
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch
                        data = {[
                            {
                                label: "TEXT CHANNELS",
                                type: "channel",
                                data: textChannels?.map((channel) => ({
                                    id: channel._id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "VOICE CHANNELS",
                                type: "channel",
                                data: audioChannels?.map((channel) => ({
                                    id: channel._id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "VIDEO CHANNELS",
                                type: "channel",
                                data: videoChannels?.map((channel) => ({
                                    id: channel._id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "MEMBERS",
                                type: "member",
                                data: members?.map((member) => ({
                                    id: member._id,
                                    name: member.userId.displayname,
                                    icon: roleIconMap[member.role]
                                }))
                            }
                        ]}
                    />
                </div>
            </ScrollArea>               
        </div>
    )
}

export default ServerSidebar
