"use client";
import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';


interface FriendSearchProps {
    data: any
}

const FriendSearch = ({
    data
}: FriendSearchProps) => {

    const [open, setOpen] = useState(false);
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const down = (e: KeyboardEvent)=>{
            if(e.key === "k" && (e.metaKey || e.ctrlKey)){
                e.preventDefault();
                setOpen((open) => !open);
            }
        }
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);
    const onClick = ({ id, type }: { id: string, type: "channel" | "member" }) => {
        setOpen(false);
    }
    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="group px-2 py-1 rounded-md flex items-left gap-x-2 w-full dark:bg-zinc-900 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
                <p className="text-sm text-zinc-500 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
                    Find or start a conversation
                </p>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search all channels and members" />
                <CommandList>
                    <CommandEmpty>
                        No Results found
                    </CommandEmpty>
                </CommandList>
            </CommandDialog>
        </>

    )
}

export default FriendSearch;