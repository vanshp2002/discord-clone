"use client";

import React from 'react'
import { useSession } from "next-auth/react";
import { useRouter, redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatHeader } from '@/components/chat/chat-header';


interface ChannelIdPageProps {
  params:{
    serverId: string;
    channelId: string; 
  }
}

const ChannelIdPage = ({params}: ChannelIdPageProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [gchannel, setGchannel] = useState(null);
  const [gmember, setGmember] = useState(null);

  useEffect(() => {

    const fetchData = async () => {

      try{

        const userfind = await fetch(`/api/fetchUserProfile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: session?.user?.email }),
          });

          const user = await userfind.json();

          const channelfind = await fetch(`/api/channels/fetchChannel`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              },
              body: JSON.stringify({ channelId: params.channelId }),
            });

            const channel = await channelfind.json();

            const memberfind = await fetch(`/api/channels/fetchMember`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ serverId: params.serverId, userId: user._id }),
              });

              const member = await memberfind.json();

              if(!channel || !member){
                redirect("/");
              }

              setGchannel(channel);
              setGmember(member);

      }
      catch(err){
        console.log(err);
      }

    }

    fetchData();

  }, []);

    return (
      <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      { gchannel && (<ChatHeader 
        serverId={gchannel?.serverId}
        name={gchannel?.name}
        type="channel"
        email={session?.user?.email}
      />) }
    </div>
    )
}

export default ChannelIdPage;
