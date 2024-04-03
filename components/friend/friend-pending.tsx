"use client";
import { useParams } from 'next/navigation';
import React from 'react'


interface FriendPendingProps {
    rec: any
}


const FriendPending = ({
    rec
}: FriendPendingProps) => {

    const params = useParams();
    return (

        <div className="flex items-center justify-between py-2">
            {rec.map((friend) => (
                <p key={friend._id}>{friend.userOneId}</p>
            ))}
        </div>        
    )
}

export default FriendPending