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


export const LeaveServerModal = ({ email }) => {

    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const isModalOpen = isOpen && type === "leaveServer";
    const { server } = data;
    const { user } = data;

    const [isLoading, setIsLoading] = useState(false);
    const { serverUpdated, setServerUpdated } = useServerState();

    const onClick = async () => {
        try {
            setIsLoading(true);
            const leaveserver = await fetch("/api/servers/leaveserver", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    serverId: server?._id,
                    userId: user?._id
                })
            })
            onClose();
            router.refresh();
            setServerUpdated(prevServerUpdated => prevServerUpdated + 1);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black  p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Leave Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to leave <span className="font-semibold text-indigo-500">{server?.name}</span>?
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
                            onClick={onClick}
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

export default LeaveServerModal;