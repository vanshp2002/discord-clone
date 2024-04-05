"use client";
import React, { useEffect, useState } from 'react';
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
    const recvPending = friends?.filter((friend: {type: any}) => friend.status==='PENDING' && friend.userTwoId._id === userId);
    const sentPending = friends?.filter((friend: {type: any}) => friend.status==='PENDING' && friend.userOneId._id === userId);
    const allFriends = friends?.filter((friend: {status: any}) => friend.status === 'ACCEPTED' && (friend.userOneId._id === userId || friend.userTwoId._id === userId));
    const blockedFriends = friends?.filter((friend: {status: any}) => friend.status === 'BLOCKED' && friend.blockedBy === userId);

    return (
        <>
            {list === "online" && <FriendOnline />}
            {list === "all" && allFriends && <FriendAll allfriends={allFriends} userId={userId} />}
            {list === "pending" && recvPending && sentPending && <FriendPending rec={recvPending} sent={sentPending} />}
            {list === "blocked" && blockedFriends && <FriendBlocked blockedFriends={blockedFriends} userId={userId} />}
            {list === "addfriend" && <FriendAdd />}
        </>
    )
}

export default FriendList