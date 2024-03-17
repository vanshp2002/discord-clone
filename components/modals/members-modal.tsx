"use client";

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { useOrigin } from '@/hooks/use-origin';
import { ScrollArea } from '@/components/ui/scroll-area';
import UserAvatar from '../user-avatar';
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldIcon, ShieldQuestion } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
    DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    "ADMIN": <ShieldAlert className="h-4 w-4 text-rose-500" />
}

export const MembersModal = ({ email }) => {
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const origin = useOrigin();
    const isModalOpen = isOpen && type === "members";
    const { server } = data;
    const [membersData, setMembersData] = useState([]);
    const [loadingId, setLoadingId] = useState("");
    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            try {
                // console.log(server?.members);
                const response = await fetch("/api/servers/getmembersdata", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        members: server?.members
                    })
                });
                const data = await response.json();
                setMembersData(Object.values(data.members));
                console.log(Object.values(data.members));
            } catch (error) {
                console.error("Error fetching members data:", error);
            }
        };
        fetchData();
    }, [server?.members]); // Run effect when server members change

    const onRoleChange = async (memberId: string, role: string) => {
        try {
            setLoadingId(memberId);
            const updatedServers = await fetch("/api/servers/changerole", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    serverId: server?._id,
                    memberId,
                    role
                })
            })
            const toJson = await updatedServers.json();
            router.refresh();
            onOpen("members", { server: toJson.server });

        } catch (error) {
            console.log(error);
        }
        finally {
            setLoadingId("");
        }
    }

    const onKick = async (memberId: string) => {
        try {
            setLoadingId(memberId);
            const updatedServers = await fetch("/api/servers/kickmember", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    serverId: server?._id,
                    memberId
                })
            })
            const toJson = await updatedServers.json();
            router.refresh();
            onOpen("members", { server: toJson.server });

        } catch (error) {
            console.log(error);
        }
        finally {
            setLoadingId("");
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Manage Members
                    </DialogTitle>
                    <DialogDescription>
                        {membersData.length} Members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {membersData.map((member) => (
                        <div key={member._id} className="flex items-center gap-x-2 mb-6">
                            <UserAvatar src={member?.userId?.imageUrl} />
                            <div className="flex flex-col gap-y-1">
                                <div className="text-xs font-semibold flex items-center gap-x-1">
                                    {member?.userId?.username}
                                    {roleIconMap[member?.role]}
                                </div>
                                <p className="text-xs text-zinc-500">
                                    {member?.userId?.email}
                                </p>
                            </div>
                            {server?.userId !== member?.userId?._id &&
                                loadingId !== member?._id && (
                                    <div className="ml-auto">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <MoreVertical className="h-4 w-4 tet-zinc-500" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent side="left">
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger className="flex items-center">
                                                        <ShieldQuestion className="w-4 h-4 mr-2" />
                                                        <span>Role</span>
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuPortal>
                                                        <DropdownMenuSubContent>
                                                            <DropdownMenuItem onClick={() => onRoleChange(member._id, "GUEST")}>
                                                                <Shield className="h-4 w-4 mr-2" />
                                                                Guest
                                                                {member.role === "GUEST" && (
                                                                    <Check
                                                                        className="h-4 w-4 ml-auto"
                                                                    />
                                                                )}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => onRoleChange(member._id, "MODERATOR")}>
                                                                <ShieldCheck className="h-4 w-4 mr-2" />
                                                                Moderator
                                                                {member.role === "MODERATOR" && (
                                                                    <Check
                                                                        className="h-4 w-4 ml-auto"
                                                                    />
                                                                )}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => onKick(member._id)}>
                                                    <Gavel className="h-4 w-4 mr-2" />
                                                    Kick
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )}
                            {loadingId === member._id && (
                                <Loader2
                                    className="animate-spin text-zinc-500 ml-auto w-4 h-4"
                                />
                            )}
                        </div>
                    ))}
                </ScrollArea>
                <div className="p-6">
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MembersModal;
