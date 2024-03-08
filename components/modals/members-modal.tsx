"use client";
import React, { useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Label } from '@/components/ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { useOrigin } from '@/hooks/use-origin';

export const MembersModal = ({ email }) => {

    const {onOpen, isOpen, onClose, type, data} = useModal();
    const origin = useOrigin();

    const isModalOpen = isOpen && type === "members";   
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
        try {
            setIsLoading(true);
            const response1 = await fetch("/api/servers/newinvitelink", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    serverId: server?._id
                })
            })
            const response2 = await fetch("/api/servers/getserverid", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    serverId: server?._id
                })
            })
            const link = await response2.json();
            const updatedServer = link.server
            onOpen("invite", {server: updatedServer});
            
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black  p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Manage Members
                    </DialogTitle>                    
                </DialogHeader>
                <DialogDescription>
                    {server?.members?.length} Members
                </DialogDescription>
               <div className="p-6">
                    Hello Members
               </div>
            </DialogContent>
        </Dialog>
    )
}

export default MembersModal;