"use client";
import { useParams } from 'next/navigation';
import React from 'react'
import { useState } from 'react';


interface FriendAddProps {

}


const FriendAdd = ({

}: FriendAddProps) => {
    const params = useParams();
    const [username, setUsername] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log(params?.userId);
        const response = await fetch("/api/friend/addfriend",{
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                userOneId: params?.userId,
                userTwoName: username 
            })
        })
        const toJson = await response.json();
        console.log(toJson.message);
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <input onChange={(e) => setUsername(e.target.value)} type="text"></input>
                <div>
                    <button type="submit" >
                        send
                    </button>
                </div>
            </form>
        </>
    )
}

export default FriendAdd