"use client";
import React from 'react'
import { ActionTooltip } from '@/components/action-tooltip';
import { Plus, Settings } from 'lucide-react';
import { useModal } from '@/hooks/use-modal-store';

interface ServerSectionProps {
    label: string;
    role?: string;
    sectionType: "channels" | "members";
    channelType?: string;
    server?: any;
    user?: any;
}


const ServerSection = ({
    label,
    role,
    sectionType,
    channelType,
    server,
    user
}: ServerSectionProps) => {
    const { onOpen } = useModal();
    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
            {role !== "GUEST" && sectionType ===
                "channels" && (
                    <ActionTooltip label="Create Channel" side="top">
                        <button
                            onClick={() => onOpen("createChannel", {server, user, channelType})}
                            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
                            <Plus className="h-4 w-4" />
                        </button>
                    </ActionTooltip>
            )}
            {role === "ADMIN" && sectionType === "members" && (
                <ActionTooltip label="Manage Members" side="top">
                <button
                    onClick={() => onOpen("members", {server})}
                    className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
                    <Settings className="h-4 w-4" />
                </button>
            </ActionTooltip>
            )}
        </div>
    )
}

export default ServerSection