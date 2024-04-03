"use client";
import React from 'react'
import { useParams } from 'next/navigation';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FriendList from '@/components/friend/friend-list';
import FriendHeader from '@/components/friend/friend-header';
import { useListState } from '@/components/providers/list-provider';


interface FriendPageProps {

}

const FriendPage = ({

}: FriendPageProps) => {

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
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      {/* <FriendHeader />
      {list && friends && <FriendList friends={friends} userId={params?.userId} />} */}
      <FriendHeader />
      {list && friends && <FriendList friends={friends} userId={params?.userId} />}
    </div>
  )
}

export default FriendPage;