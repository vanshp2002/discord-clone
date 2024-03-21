"use client";
import React from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { channel } from 'diagnostics_channel';
import ChatHeader from '@/components/chat/chat-header';
import { ChatInput } from '@/components/chat/chat-input';

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
    const [guser, setGuser] = useState(null);
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
                if (!user) {
                    router.push("/login");
                }
                setGuser(user);
                const getchannel = await fetch("/api/channels/getchannelid", {
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
                console.log(gchannel);
                const getmember = await fetch("/api/members/getmemberlid", {
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

    }, [session, router]); 
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader name={gchannel?.name} serverId={gchannel?.serverId} type="channel"/>
      <div className="flex-1">
            Future Messages
      </div>
      {gchannel && (<ChatInput name={gchannel?.name}      type="channel" 
      apiUrl="/api/socket/messages"
      query={{
        channelId: gchannel?._id,
        serverId: gchannel?.serverId,
        userId: guser?._id
      }}
      />)}
    </div>
  )
}

export default ChannelIdPage