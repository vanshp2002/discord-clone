"use client";

import React, { use } from "react"
import { useSession } from "next-auth/react";
import { useRouter, redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { getOrCreateFriendConversation } from "@/lib/friendConversation";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { useServerState } from "@/components/providers/server-provider";
import { useParams } from "next/navigation";
import UserCardSidebar from "@/components/user-card-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MemberIdPageProps {

}

const MemberIdPage = ({
}: MemberIdPageProps) => {
    const { data: session } = useSession();
    const params = useParams();
    const router = useRouter();
    const [currentMember, setCurrentMember] = useState(null);
    const [otherMember, setOtherMember] = useState(null);
    const [gconversation, setGconversation] = useState(null);
    const { serverUpdated, setServerUpdated } = useServerState();
    const [ mutualFriends, setMutualFriends ] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try{
          const userfind = await fetch(`/api/fetchUserById`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              },
              body: JSON.stringify({ userId: params?.userId }),
            });

            const {user: user1} = await userfind.json();
            setCurrentMember(user1);

            const otherUser = await fetch(`/api/fetchUserById`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: params?.friendId,
                }),
            });

            const {user: user2} = await otherUser.json();
            setOtherMember(user2);

            const conversation = await getOrCreateFriendConversation(currentMember?._id, otherMember?._id);

            if(!conversation){
              redirect(`/user/${params?.userId}/friends`);
            }

            setGconversation(conversation);

            const mutualFriends = await fetch(`/api/friend/mutualfriends`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  userOneId: currentMember?._id,
                  userTwoId: otherMember?._id,
              }),
            });

            const {mutualfriends} = await mutualFriends.json();
            setMutualFriends(mutualfriends);
          }
          catch(error){
            console.error(error);
          }
        };

        fetchData();
      }, [session, router, serverUpdated]);

    return (
      <div className="bg-white dark:bg-[#313338] flex flex-col h-[100%]" style={{ overflow: "hidden" }}>
      {otherMember && (<ChatHeader 
        imageUrl={otherMember.imageUrl}
        name={otherMember.displayname}
        type="conversation"
        email={session?.user?.email}
      />)}

      <div className="flex h-full">

            <div className="flex flex-col h-full w-[74%]" style={{ overflow: "hidden" , maxHeight: "calc(100vh - 50px)" }}>

                <ScrollArea className="flex-grow">

                { otherMember && currentMember && (<ChatMessages
                    member={currentMember}
                    otherMember={otherMember}
                    name={otherMember?.displayname}
                    chatId={gconversation?._id}
                    apiUrl="/api/direct-messages"
                    socketUrl="/api/socket/direct-messages"
                    socketQuery={{
                        conversationId: gconversation?._id,
                        userId: currentMember?._id,
                        otherUserId: otherMember?._id,
                    }}
                    paramKey="conversationId"
                        paramValue={gconversation?._id}
                        type="conversation"
                        />
                    )}
                
                </ScrollArea>

                {gconversation && (<ChatInput 
                    apiUrl="/api/socket/direct-messages"
                    query={{
                        conversationId: gconversation?._id,
                        userId: currentMember?._id,
                        otherUserId: otherMember?._id,
                    }}
                    name={otherMember?.displayname}
                    type="conversation"
                    chatId= {gconversation?._id}
                    />)}

                </div>

            <div className="w-[26%]">
                {otherMember && <UserCardSidebar user={otherMember} mutualFriends={mutualFriends} />}
            </div>
        
            </div>
        </div>
    );
  }
  
  export default MemberIdPage;