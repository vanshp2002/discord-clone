"use client";
import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FriendAll from './friend-all';
import FriendBlocked from './friend-blocked';
import FriendOnline from './friend-online';
import FriendPending from './friend-pending';
import FriendAdd from './friend-add';
import { useListState } from '@/components/providers/list-provider';

interface FriendProps {
    friends: any,
    userId: string
}

const FriendList = ({
    friends,
    userId
}: FriendProps) => {

    const { list, setList } = useListState();
    console.log(friends);

    const recPending = friends?.filter((friend: { type: any }) => friend.status === 'PENDING' && friend.userTwoId._id === userId);
    const sentPending = friends?.filter((friend: { type: any }) => friend.status === 'PENDING' && friend.userOneId._id === userId);

    const allFriend = friends?.filter((friend: { type: any }) => friend.status === 'ACCEPTED' && (friend.userOneId._id === userId || friend.userTwoId._id === userId));


    return (
        <>
            {list === "online" && <FriendOnline />}
            {allFriend && list === "all" && <FriendAll allfriends={allFriend} userId={userId} />}
            {recPending && sentPending && list === "pending" && <FriendPending rec={recPending} sent={sentPending} />}
            {list === "blocked" && <FriendBlocked />}
            {list === "addfriend" && <FriendAdd />}
        </>
    )
}

export default FriendList