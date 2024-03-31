"use client";

import React from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ChatHeader from '@/components/chat/chat-header';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import { useSharedState } from '@/components/providers/reply-provider';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  }
}

const MemberIdPage = ({
  params
}: MemberIdPageProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [gchannel, setGchannel] = useState(null);
  const [gmember, setGmember] = useState(null);
  const [guser, setGuser] = useState(null);
  const [gconversation, setGconversation] = useState(null);
  const [otherMem, setOtherMem] = useState(null);
  const { replyMessage, setReplyMessage } = useSharedState("");
  const handleClose = () => {
    setReplyMessage("");
  }
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
        const currentmember = await fetch("/api/servers/getmemberdata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serverId: params.serverId,
            userId: user._id
          }),
        })

        const { member } = await currentmember.json();

        if (!member) {
          return router.push("/");
        }
        setGmember(member);

        const con = await fetch("/api/conversations/getorcreateconversation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            memberOneId: member._id,
            memberTwoId: params.memberId
          }),
        })

        const { conversation } = await con.json();

        if (!conversation) {
          return router.push(`/servers/${params.serverId}`);
        }
        await setGconversation(conversation);
        const { memberOneId, memberTwoId } = await conversation;

        const otherMember = await memberOneId._id === user._id ? memberTwoId : memberOneId;

        await setOtherMem(otherMember);

      }
      catch (error) {
        console.log(error);
      }
    }
    fetchData();

  }, []);
  return (
    //   <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
    //     {<ChatHeader imageUrl={otherMem?.userId?.imageUrl} name={otherMem?.userId?.displayname} type="conversation" serverId={params.serverId}/>}
    //     {gconversation && <ChatMessages
    //       member = {gmember}
    //       otherName={otherMem?.userId?.displayname}
    //       otherUsername={otherMem?.userId?.username}
    //       otherImage={otherMem?.userId?.imageUrl}
    //       name={otherMem?.userId?.displayname}
    //       chatId={gconversation._id}
    //       type="conversation"
    //       apiUrl="/api/direct-messages"
    //       paramKey="conversationId"
    //       paramValue={gconversation._id}
    //       socketUrl="/api/socket/direct-messages"
    //       socketQuery={{
    //         conversationId: gconversation._id,
    //         userId: guser._id
    //       }}
    //     />}
    //     {gconversation && <ChatInput
    //       name={otherMem?.userId?.displayname}
    //       type="conversation"
    //       apiUrl="/api/socket/direct-messages"
    //       query={{
    //         conversationId: gconversation._id,
    //         userId: guser._id,
    //         memberId: gmember._id
    //       }}
    //     />}
    //   </div>
    // )
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      {<ChatHeader imageUrl={otherMem?.imageUrl} name={otherMem?.displayname} type="conversation" serverId={params.serverId} />}
      {gconversation && <ChatMessages
        member={gmember}
        otherName={otherMem?.displayname}
        otherUsername={otherMem?.username}
        otherImage={otherMem?.imageUrl}
        name={otherMem?.displayname}
        chatId={gconversation._id}
        type="conversation"
        apiUrl="/api/direct-messages"
        paramKey="conversationId"
        paramValue={gconversation._id}
        socketUrl="/api/socket/direct-messages"
        socketQuery={{
          conversationId: gconversation._id,
          userId: guser._id
        }}
      />}
      {gconversation && <ChatInput
        name={otherMem?.displayname}
        type="conversation"
        apiUrl="/api/socket/direct-messages"
        query={{
          conversationId: gconversation._id,
          userId: guser._id
        }}
      />}
    </div>
  )
}

export default MemberIdPage