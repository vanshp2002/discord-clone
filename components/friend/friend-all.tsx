"use client";
import React from 'react'


interface FriendAllProps {
    allFriend: any; 
}


const FriendAll = ({
    allFriend
}: FriendAllProps) => {

    return (
        <div className="bg-cover bg-center w-720 h-480" style={{ backgroundImage: "url('friend_all.png')" , zIndex: 1}}>
            {allFriend.map((friend) => (
                <p key={friend._id}>{friend.userOneId.username}</p>
            ))}
        </div>
    )
}

export default FriendAll