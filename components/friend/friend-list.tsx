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
    const rec = friends?.filter((friend: {type: any}) => friend.status==='PENDING' && friend.userTwoId === userId);

    return (
        <>
            {list === "online" && <FriendOnline />}
            {list === "all" && <FriendAll />}
            {list === "pending" && <FriendPending rec={rec} />}
            {list === "blocked" && <FriendBlocked />}
            {list === "addfriend" && <FriendAdd />}
        </>
    )
}

export default FriendList