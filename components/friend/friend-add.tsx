"use client";
import { useParams } from 'next/navigation';
import React from 'react'
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';


interface FriendAddProps {

}


const FriendAdd = ({

}: FriendAddProps) => {
    const params = useParams();
    const [username, setUsername] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State to control button disablement

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log(params?.userId);
        const response = await fetch("/api/friend/addfriend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userOneId: params?.userId,
                userTwoName: username
            })
        });
        const toJson = await response.json();
        console.log(toJson.message);
    }

    const onChange = (e) => {
        setUsername(e.target.value);
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
                            value={username}
                            onChange={onChange}
                            placeholder="You can add friends with their Discord username."
                            className="bg-zinc-800 h-[55px] text-base w-full px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-[#03a9f4]"
                        />
                        <button
                            disabled={username === ""} // Disable button based on state
                            className={`absolute font-semibold text-base right-3 top-2 ${username === "" ? 'bg-[#2f3570] text-[#9d9b9b] cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} px-4 py-2 rounded-md`}
                        >
                            Send Friend Request
                        </button>
                    </form>
                </div>
            </div>
            <Separator className="h-[1px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-full mx-auto" />
        </>
    )
}

export default FriendAdd
