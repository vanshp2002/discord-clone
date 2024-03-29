"use client";
import React, { useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useServerState } from "@/components/providers/server-provider";


export const DeleteChannelModal = ({ email }) => {

    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const isModalOpen = isOpen && type === "deleteChannel";
    const { server } = data;
    const { user } = data;
    const { channel } = data;

    const [isLoading, setIsLoading] = useState(false);
    const [loadingId, setLoadingId] = useState(false);
    const { serverUpdated, setServerUpdated } = useServerState();


    const onDelete = async (channelId: string) => {
        try {
            setLoadingId(channelId);
            const updatedServers = await fetch("/api/channels/deletechannel", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    serverId: server?._id,
                    channelId
                })
            })
            setServerUpdated(prevServerUpdated => prevServerUpdated + 1);
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
        finally {
            setLoadingId("");
        }
    }
    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black  p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Channel
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to do this?
                    </DialogDescription>
                    <DialogDescription className="text-center text-zinc-500">
                        <span className="font-semibold text-indigo-500">#{channel?.name}</span> will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            variant="ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            onClick={() => onDelete(channel?._id)}
                            variant="primary"
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteChannelModal;