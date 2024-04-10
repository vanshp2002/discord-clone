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
import { Pin, PinOff } from 'lucide-react';
import { set } from "mongoose";

interface ChatItemProps {
    type: "channel" | "conversation";
    reply: any;
    chatId: string;
    id: string;
    content: string;
    member: any;
    message: any;
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
    message,
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
    const [isPinned, setIsPinned] = useState(message?.pinned);
    const isPoll = message?.pollId;
    const [messageId, setMessageId] = useState(id);
    const [optionHovered, setOptionHovered] = useState("");
    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions]: any = useState([]);



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: content
        }
    });

    const onPinMessage = async () => {
        setIsPinned(true);
        const res = await fetch("/api/messages/pin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ messageId: id, chatId, type }),
        });
    }

    const onUnpinMessage = async () => {
        setIsPinned(false);
        const res = await fetch("/api/messages/unpin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ messageId: id, chatId, type }),
        });
    }
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
    const calculateBarWidth = (options: any) => {
        if (!options) {
            return [];
        }
        let maxVotes = 0;
        options.forEach((option: any) => {
            if (option.voters.length > maxVotes) {
                maxVotes = option.voters.length;
            }
        });

        let barWidths: any = [];
        options.forEach((option: any) => {
            if (maxVotes === 0) {
                barWidths.push(0);
            }
            else {
                barWidths.push((option.voters.length / maxVotes) * 100);
            }
        });

        return barWidths;
    }
    const [selectedOption, setSelectedOption] = useState("");
    const [barWidth, setBarWidth] = useState(calculateBarWidth(message?.pollId?.options));

    useEffect(() => {
        setBarWidth(calculateBarWidth(message?.pollId?.options));
    }, [message?.pollId?.options]);


    const handleVote = async (oid: string, option: string) => {
        if (selectedOptions.includes(oid)) {
            let radio = document.getElementById(oid);
            if (radio) {
                radio.checked = false;
            }

            const url = qs.stringifyUrl({
                url: `/api/socket/polls/${id}`,
                query: socketQuery,
            });

            const body = {
                task: "unvote",
                option: option,
                memberId: currentMember._id,
            };

            await axios.post(url, body);

            setSelectedOptions(selectedOptions.filter((item: any) => item !== oid));
        } else {

            if (!message?.pollId?.allowMultiple && selectedOptions.length > 0) {
                let radio = document.getElementById(selectedOptions[0]);
                if (radio) {
                    radio.checked = false;
                }
            }

            setSelectedOptions([...selectedOptions, oid]);

            const url = qs.stringifyUrl({
                url: `/api/socket/polls/${id}`,
                query: socketQuery,
            });

            const body = {
                task: "vote",
                option: option,
                memberId: currentMember._id,
            };

            await axios.post(url, body);

        }
    }

    useEffect(() => {
        setOptions(message?.pollId?.options);
    }, [message?.pollId?.options]);

    useEffect(() => {
        let radiobtn = null;
        if (options) {
            options.forEach((option: any, index: any) => {
                if (option.voters) {
                    option.voters.forEach((voter: any) => {
                        if (voter._id === currentMember._id) {
                            radiobtn = document.getElementById(`${messageId}option${index}`);
                            if (radiobtn) {
                                radiobtn.checked = true;
                                setSelectedOptions([...selectedOptions, `${messageId}option${index}`]);
                            }
                        }
                    });
                }
            });
        }
        setBarWidth(calculateBarWidth(options));
    }, [options]);

    return (
        <>
            {type === "channel" && isPoll &&
                <div id={id} className="relative group items-center hover:bg-black/5 p-4 transition w-full">

                    <div className="group flex gap-x-2 items-start w-full">
                        <div className="cursor-pointer">
                            {member && <UserCardAvatar user={member?.userId} currentUserId={currentMember.userId._id} chatId={chatId} isHovered={isHovered} />}
                        </div>
                        <div className="flex flex-col w-full">
                            <div className="flex items-center gap-x-2 mt-2">
                                <div className="flex items-center">
                                    <p onClick={onMemberClick} className="font-semibold text-sm hover:underline cursor-pointer ">
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

                            <div className="bg-zinc-700/75 mt-5 rounded-lg w-[40%] mr-3">

                                <div className="p-4">


                                <div className="mb-4">
                                    <p className="text-white text-m">{message.pollId.question}</p>
                                    <div className="mt-1">
                                        {message.pollId.allowMultiple ?
                                            <p className="text-white text-xs">Select one or more options</p>
                                            : <p className="text-white text-xs">Select one option</p>}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    {message.pollId.options.map((option: any, index: any) => (
                                        <div key={`option${index}`} className={`flex items-center mb-2 rounded px-3 py-1 ${optionHovered === `option${index}` ? 'bg-zinc-600/90' : ''}`}
                                            onMouseEnter={() => setOptionHovered(`option${index}`)}
                                            onMouseLeave={() => setOptionHovered("")}
                                        >
                                            <input id={`${messageId}option${index}`} type="radio" name={`${messageId}option${index}`} className="mr-2" onClick={() => handleVote(`${messageId}option${index}`, option.option)}
                                            />
                                            <div className="container p-1">
                                                <span className="text-white text-sm">{option.option}</span>
                                                <div className="flex-grow h-2 mx-4 bg-black rounded-full mt-2 ml-0 left-0 flex items-center">
                                                    <div className="bg-green-500 h-[86%] rounded-full" style={{ width: `${index < barWidth.length ? barWidth[index] : 0}%`, transition: 'width 0.5s ease' }}></div>
                                                </div>
                                            </div>
                                            <span className="text-white text-sm">{option.voters.length}</span>
                                        </div>
                                    ))}
                                </div>
                                </div>
                                 <div className={`text-center container w-full h-full py-3 text-sm cursor-pointer ${optionHovered === 'viewVotes' ? 'bg-black' : ''}`} 
                        onClick={() => onOpen("viewVotes", {votes: message?.pollId?.options})}
                        onMouseEnter={() => setOptionHovered('viewVotes')} 
                        onMouseLeave={() => setOptionHovered("")}
                        style={{
                            borderBottomLeftRadius: '8px', 
                            borderBottomRightRadius: '8px' 
                        }}
                        >
                        <p className="text-zinc-300 text-sm">View Votes</p>
                    </div>
                            </div>

                        </div>
                    </div>
                </div>
            }


            {/* ------------------------------------------------------------------------ */}
            {type === "channel" && !isPoll && <div className="relative group items-center hover:bg-black/5 p-4 transition w-full">

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
                            {isAdmin && (
                                !isPinned ?
                                    <ActionTooltip label="Pin">
                                        <Pin onClick={onPinMessage} className="cursor-pointer w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
                                    </ActionTooltip>
                                    :
                                    <ActionTooltip label="Unpin">
                                        <PinOff onClick={onUnpinMessage} className="cursor-pointer w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
                                    </ActionTooltip>
                            )
                            }
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