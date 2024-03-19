"use client";
import React from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { channel } from 'diagnostics_channel';

interface ChannelIdPageProps{
  params:{
    serverId: string;
    channelId: string;
  }
}

const ChannelIdPage = ({params}:ChannelIdPageProps) => {
  const { data: session } = useSession();
    const router = useRouter();
    const [gchannel, setGchannel] = useState(null);
    const [gmember, setGmember] = useState(null);
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
                const getchannel = await fetch("/api/servers/getchannelid", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        channelId: params.channelId
                    })
                });
                
                const {channel} = await getchannel.json();
                setGchannel(channel);
                const getmember = await fetch("/api/servers/getchannelid", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                      serverId: params.serverId,
                      userID: user._id
                  })
              });
              
              const {member} = await getmember.json();
              setGmember(member);

              if(!channel||!member){
                return router.push("/");
              }
              
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

    }, []); 
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader />
    </div>
  )
}

export default ChannelIdPage