"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash, Reply } from "lucide-react";

import { UserAvatar } from "@/components/user-avatar";
import { ActionTooltip } from "@/components/action-tooltip";
import { cn } from "@/lib/utils";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import Image from "next/image";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSharedState } from "../providers/reply-provider";
import { UserCardAvatar } from "../user-card-avatar";

interface ChatItemProps {
    type: "channel" | "conversation";
    reply: any;
    chatId: string;
    id: string;
    content: string;
    member: any;
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: any;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
};

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
}

const formSchema = z.object({
    content: z.string().min(1),
});

export const ChatItem = ({
    type,
    reply,
    chatId,
    id,
    content,
    member,
    timestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery,
}: ChatItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const params = useParams();
    const router = useRouter();
    const { replyMessage, setReplyMessage } = useSharedState("");
    const { onOpen } = useModal();
    const [isHovered, setIsHovered] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: content
        }
    });

    const onMemberClick = () => {
        if (member._id === currentMember._id) {
            return;
        }
        router.push(`/servers/${params?.serverId}/conversations/${member?._id}`);
    }

    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.key === "Escape" || event.keyCode === 27) {
                setIsEditing(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keyDown", handleKeyDown);
    }, []);

    useEffect(() => {
        form.reset({
            content: content,
        })
    }, [content]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery,
            });

            await axios.patch(url, values);

            form.reset();
            setIsEditing(false);
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = () => {
        setReplyMessage({ replyExist: true, replyId: id, replyContent: content, replyName: member?.userId?.displayname, replyImg: "" });
    };

    const handleChange1 = () => {
        setReplyMessage({ replyExist: true, replyId: id, replyContent: content, replyName: member?.displayname, replyImg: "" });
    };

    const isLoading = form.formState.isSubmitting;

    const fileType = fileUrl?.split(".").pop();

    const isAdmin = currentMember.role === "ADMIN";
    const isModerator = currentMember.role === "MODERATOR";
    const isOwner = currentMember._id === member._id;
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !deleted && isOwner && !fileUrl;
    const isPDF = fileType === "pdf" && fileUrl;
    const isImage = !isPDF && fileUrl;

    const isConversationMessageOwner = type === "conversation" && currentMember?.userId?._id === member._id;

    return (
        <>
            {type === "channel" && <div className="relative group items-center hover:bg-black/5 p-4 transition w-full">

                {reply && (
                    <div className="ml-4 text-xs flex items-center gap-x-2 p-2 rounded-md">
                        <Reply className="w-4 h-4 text-zinc-500 dark:text-zinc-400" style={{ transform: 'scaleX(-1)' }} />
                        {/* <UserAvatar src={reply.replyToAvatar} className="h-3 w-3 md:h-3 md:w-3" /> */}
                        <p className="text-xs text-zinc-600 dark:text-zinc-200">
                            {reply.replyName}: {reply.replyContent}
                        </p>
                    </div>
                )}

                <div className="group flex gap-x-2 items-start w-full">
                    <div className="cursor-pointer" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                        <UserCardAvatar user={member.userId} currentUserId={currentMember._id} chatId={chatId} isHovered={isHovered} />
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="flex items-center gap-x-2">
                            <div className="flex items-center">
                                <p onClick={onMemberClick} className="font-semibold text-sm hover:underline cursor-pointer">
                                    {member?.userId?.displayname}
                                </p>
                                <ActionTooltip label={member.role}>
                                    {roleIconMap[member.role]}
                                </ActionTooltip>
                            </div>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                {timestamp}
                            </span>

                        </div>
                        {isImage && (
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
                            >
                                <Image
                                    src={fileUrl}
                                    alt={content}
                                    fill
                                    className="object-cover"
                                />
                            </a>
                        )}

                        {isPDF && (
                            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                                <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                                <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                                >
                                    PDF File
                                </a>
                            </div>
                        )}

                        {!fileUrl && !isEditing && (
                            <p className={cn(
                                "text-sm text-zinc-600 dark:text-zinc-300",
                                deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
                            )}>
                                {content}
                                {isUpdated && !deleted && (
                                    <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                        (edited)
                                    </span>
                                )}
                            </p>
                        )}

                        {!fileUrl && isEditing && (
                            <Form {...form}>
                                <form
                                    className="flex items-center w-full gap-x-2 pt-2"
                                    onSubmit={form.handleSubmit(onSubmit)}
                                >
                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <div className="relative w-full">
                                                        <Input
                                                            disabled={isLoading}
                                                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                                            placeholder="Edited message"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button disabled={isLoading} size="sm" variant="primary">
                                        Save
                                    </Button>
                                </form>
                                <span className="text-[10px] mt-1 text-zinc-400">
                                    Press escape to cancel, enter to save
                                </span>
                            </Form>
                        )}
                    </div>
                </div>


                <div className="absolute top-1/2 right-2 transform -translate-y-1/2">

                    <div className="relative group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                        <div className={`group-hover:flex items-center gap-x-2 absolute p-1-top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm ${isHovered ? 'flex' : 'hidden'}`}>
                            <ActionTooltip label="reply">

                                <Reply
                                    className="cursor-pointer w-5 h-5 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                                    onClick={() => handleChange()}
                                />

                            </ActionTooltip>
                            {canEditMessage && (
                                <ActionTooltip label="Edit">
                                    <Edit
                                        onClick={() => setIsEditing(true)}
                                        className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                                    />
                                </ActionTooltip>
                            )}
                            {canDeleteMessage && (<ActionTooltip label="Delete">
                                <Trash
                                    onClick={() => onOpen("deleteMessage", {
                                        apiUrl: `${socketUrl}/${id}`,
                                        query: socketQuery,
                                    })}
                                    className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                                />
                            </ActionTooltip>)}
                        </div>
                    </div>
                </div>

            </div>}
            {type === "conversation" && <div className="relative group items-center hover:bg-black/5 p-4 transition w-full">
                {reply && (
                    <div className="ml-4 text-xs flex items-center gap-x-2 p-2 rounded-md">
                        <Reply className="w-4 h-4 text-zinc-500 dark:text-zinc-400" style={{ transform: 'scaleX(-1)' }} />
                        {/* <UserAvatar src={reply.replyToAvatar} className="h-3 w-3 md:h-3 md:w-3" /> */}
                        <p className="text-xs text-zinc-600 dark:text-zinc-200">
                            {reply.replyName}: {reply.replyContent}
                        </p>
                    </div>
                )}
                <div className="group flex gap-x-2 items-start w-full">
                    <div className="cursor-pointer" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                        <UserCardAvatar user={member} currentUserId={currentMember._id} chatId={chatId} isHovered={isHovered} />
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="flex items-center gap-x-2">
                            <div className="flex items-center">
                                <p onClick={onMemberClick} className="font-semibold text-sm hover:underline cursor-pointer">
                                    {member?.displayname}
                                </p>

                            </div>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                {timestamp}
                            </span>
                        </div>
                        {isImage && (
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
                            >
                                <Image
                                    src={fileUrl}
                                    alt={content}
                                    fill
                                    className="object-cover"
                                />
                            </a>
                        )}

                        {isPDF && (
                            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                                <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                                <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                                >
                                    PDF File
                                </a>
                            </div>
                        )}

                        {!fileUrl && !isEditing && (
                            <p className={cn(
                                "text-sm text-zinc-600 dark:text-zinc-300",
                                deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
                            )}>
                                {content}
                                {isUpdated && !deleted && (
                                    <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                        (edited)
                                    </span>
                                )}
                            </p>
                        )}

                        {!fileUrl && isEditing && (
                            <Form {...form}>
                                <form
                                    className="flex items-center w-full gap-x-2 pt-2"
                                    onSubmit={form.handleSubmit(onSubmit)}
                                >
                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <div className="relative w-full">
                                                        <Input
                                                            disabled={isLoading}
                                                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                                            placeholder="Edited message"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button disabled={isLoading} size="sm" variant="primary">
                                        Save
                                    </Button>
                                </form>
                                <span className="text-[10px] mt-1 text-zinc-400">
                                    Press escape to cancel, enter to save
                                </span>
                            </Form>
                        )}
                    </div>
                </div>

                <div className="absolute top-1/2 right-2 transform -translate-y-1/2">

                    <div className="relative group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                        <div className={`group-hover:flex items-center gap-x-2 absolute p-1-top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm ${isHovered ? 'flex' : 'hidden'}`}>
                            <ActionTooltip label="reply">

                                <Reply onClick={() => handleChange1()} className="cursor-pointer w-5 h-5 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />

                            </ActionTooltip>
                            {isConversationMessageOwner && (
                                <>
                                    <ActionTooltip label="Edit">
                                        <Edit
                                            onClick={() => setIsEditing(true)}
                                            className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                                        />
                                    </ActionTooltip>
                                    <ActionTooltip label="Delete">
                                        <Trash
                                            onClick={() => onOpen("deleteMessage", {
                                                apiUrl: `${socketUrl}/${id}`,
                                                query: socketQuery,
                                            })}
                                            className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                                        />
                                    </ActionTooltip>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div >}
        </>
    )
}