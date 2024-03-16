

"use client";
import React, { useState } from 'react';


import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
    DialogFooter,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from '../ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const DeleteServerModal = ({email}) => {
    const {isOpen,onClose,type, data} = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type==="deleteServer";
    const {server} = data;
    const [isLoading, setIsLoading] = useState(false);

    const onConfirm = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/fetchUserProfile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email}),
            });

            const user = await response.json();

            const res = await fetch(`/api/servers/delete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user._id, 
                    serverId: server._id
                }),
            });

            onClose();
            router.refresh();
            router.push("/");
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }
    

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Server
                    </DialogTitle>  
                    <DialogDescription className='text-center text-zinc-500'>
                        Are you sure you want to do this? <br/>
                        
                        <span className="font-semibold text-indigo-500">
                            {server?.name} 
                        </span> will be permanently deleted.
                    </DialogDescription>               
                </DialogHeader>

                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            onClick = {onClose}
                            variant="ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            onClick = {onConfirm}
                            variant="primary"
                        >
                            Delete
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}