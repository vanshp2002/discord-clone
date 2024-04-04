"use client";
import { useParams } from 'next/navigation';
import React from 'react'
import { useState } from 'react';
import { Separator } from '../ui/separator';


interface FriendAddProps {

}


const FriendAdd = ({

}: FriendAddProps) => {
    const params = useParams();
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");

    if(message){
        setTimeout(() => {
            setMessage("");
        }, 5000);
    }

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
        setMessage(toJson.message);
        setStatus(toJson.status);
        e.target.reset();
    }

    return (
        <>
            <div className="bg-[#313338] p-4 rounded-lg">
                <h2 className="text-white text-lg font-semibold mb-2">ADD FRIEND</h2>
                <p className="text-gray-400 text-sm mb-4">
                    You can add friends with their Discord username.
                </p>
                <div className="relative">
                    <form onSubmit={onSubmit}>
                        <input
                            type="text"
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="You can add friends with their Discord username."
                            className="bg-zinc-800 h-[55px] text-white w-full px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-[#03a9f4]"
                        />
                        <button
                            className="absolute font-semibold right-3 top-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                        >
                            Send Friend Request
                        </button>
                    </form>
                </div>
                {message && status=="404" && <p className="text-red-500 text-sm mt-2">{message}</p>}
                {message && !status && <p className="text-green-400 text-sm mt-2">{message}</p>}
            </div>
            <Separator className="h-[1px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-full mx-auto" />
        </>
    )
}

export default FriendAdd