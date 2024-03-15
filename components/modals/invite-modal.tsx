

"use client";
import React, { useState } from 'react';


import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { useOrigin } from '@/hooks/use-origin';
import axios from 'axios';

export const InviteModal = () => {
    const {onOpen, isOpen,onClose,type, data} = useModal();

    const isModalOpen = isOpen && type==="invite";
    const origin = useOrigin();
    const {server} = data;

    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const onNew = async () => {
        try{
            setIsLoading(true);
            const res = await fetch("/api/servers/newinvitelink", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({serverId: server._id}),
            });
            const response = await res.json();

            onOpen("invite", {server: response});
        }
        catch(error){
            console.log(error);
        }
        finally{
            setIsLoading(false);
        }
    }
    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Invite Friends
                    </DialogTitle>                 
                </DialogHeader>
                <div className="p-6">
                    <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                            Server invite link
                    </Label>
                    <div className="flex ites-center mt-2 gap-x-2 ">
                        <Input disabled={isLoading}
                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:focus-visible:ring-offset-0"
                            value={inviteUrl}
                        />
                    <Button disabled={isLoading} size="icon">
                        {copied 
                        ? <Check className="w-4 h-4"/> 
                        : <Copy onClick={onCopy} className="w-4 h-4"/>}
                        
                    </Button>
                    </div>
                    <Button disabled={isLoading} onClick={onNew} variant="link" size="sm" className="text-xs text-zinc-500 mt-4">
                        Generate a new link
                        <RefreshCw className="w-4 h-4 ml-2"/>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}