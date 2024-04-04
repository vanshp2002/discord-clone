"use client";
import React from 'react'
import { useParams } from 'next/navigation';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FriendHeader from '@/components/friend/friend-header';
import FriendList from '@/components/friend/friend-list';
import { useListState } from '@/components/providers/list-provider';
import { Separator } from '@radix-ui/react-dropdown-menu';


interface UserIdPageProps {

}

const UserPage = ({

}: UserIdPageProps) => {

  const { list, setList } = useListState();
  const [friends, setFriends] = useState();
  const params = useParams();

  useEffect(() => {
    const fetchdata = async () => {
      console.log(params?.userId);
      const response = await fetch("/api/friend/allfriends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: params?.userId
        })
      });
      const toJson = await response.json();
      console.log(toJson);
      setFriends(toJson.friends);
    }
    fetchdata();
  }, [list]);

  return (
    <>
      <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <FriendHeader />
      <div className="flex h-full">
      <div className="h-full" style={{width: "65%"}}>
        {<FriendList friends={friends} userId={params?.userId} />}
      </div>
      <Separator className="h-full bg-zinc-300 dark:bg-zinc-700 rounded-md w-[1px] mx-auto" />
      <div className="h-full p-5" style={{width: "35%"}}>
      <div className="font-bold dark:text-white text-xl mb-4 p-5">Active Now</div>
            <div className="text-base font-bold dark:text-white text-center">
                It's quiet for now...
            </div>
            <div className="dark:text-zinc-400 text-center py-2 px-6" style={{fontSize: "14px"}}>
                When a friend starts an activity—like playing a game or hanging out on voice—we’ll show it here!
            </div>
      </div>
      </div>
    </div>
    </>
  )
}

export default UserPage;