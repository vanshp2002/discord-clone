"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Picker, { Emoji } from "emoji-picker-react";

import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash, Smile, Reply } from "lucide-react";

import { UserAvatar } from "@/components/user-avatar";
import { ActionToolTip } from "@/components/ui/action-tooltip";
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
import { EmojiPicker }from "@/components/emoji-picker";
import { EmojiReactionPicker } from "../emoji-reaction-picker";
import { ReactionDisplayer } from "../reaction-displayer";
import { useSharedState } from "../providers/reply-provider";
import { UserCardAvatar } from "../user-card-avatar";
import { Pin, PinOff } from 'lucide-react';
import { set } from "mongoose";
// import { PollItem } from "./poll-item";

interface ChatItemProps {
    type: "channel" | "conversation";
    id: string;
    content: string;
    chatId: string;
    reply: any;
    message: any;
    member: any;
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    reactions: any;
    currentMember: any;
    isUpdated: boolean;
    socketUrl: string;
    onReplyClick: (messageId: string) => void;
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
    id,
    content,
    chatId,
    reply,
    message,
    member,
    timestamp,
    fileUrl,
    deleted,
    reactions,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery,
    onReplyClick,
  }: ChatItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const params = useParams();
    const router = useRouter();
    const { replyMessage, setReplyMessage } = useSharedState({});
    const [isPinned, setIsPinned] = useState(message?.pinned);
    const [messageId, setMessageId] = useState(id);

    const { onOpen } = useModal();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: content
        }
    });

    const handleChange = () => {
        setReplyMessage({ replyToId: id, replyToName: member.userId.displayname, replyToAvatar: member.userId.imageUrl, replyToContent: content, chatId: chatId});
    };

    const handleConChange = () => {
        setReplyMessage({ replyToId: id, replyToName: member.displayname, replyToAvatar: member.imageUrl, replyToContent: content, chatId: chatId});
    };

    const onMemberClick = () => {
        if(member._id === currentMember._id) {
            return;
        }
        router.push(`/servers/${params?.serverId}/conversations/${member?._id}`);
    }

    const onAddReaction = async (emoji: string) => {
        const url = qs.stringifyUrl({
            url: `${socketUrl}/${id}`,
            query: socketQuery,
          });
        
        const body = {
            task: "addReaction",
            emoji,
            messageId: id,
            memberId: currentMember._id,
        };
    
        await axios.post(url, body);
        router.refresh();
    }

    const onRemoveReaction = async (emoji: string, currentMemberId: string) => {
        const url = qs.stringifyUrl({
            url: `${socketUrl}/${id}`,
            query: socketQuery,
          });
        
        const body = {
            task: "removeReaction",
            emoji,
            messageId: id,
            memberId: currentMemberId,
        };
    
        await axios.post(url, body);
        router.refresh();
    }

    const onPinMessage = async () => {
        const res = await fetch("/api/messages/pin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ messageId: id, chatId, type }),
        });
        setIsPinned(true);
    }

    const onUnpinMessage = async () => {
        const res = await fetch("/api/messages/unpin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ messageId: id, chatId, type }),
        });
        setIsPinned(false);
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
    };

    const calculateBarWidth = (options: any) => {
        if(!options){
            return [];
        }
        let maxVotes = 0;
        options.forEach((option: any) => {
            if(option.voters.length > maxVotes){
                maxVotes = option.voters.length;
            }
        });

        let barWidths: any = [];
        options.forEach((option: any) => {
            if(maxVotes === 0){
                barWidths.push(0);
            }
            else {
                barWidths.push((option.voters.length / maxVotes) * 100);
            }
        });

        return barWidths;
    }

    const isLoading = form.formState.isSubmitting;

    const fileType = fileUrl?.split(".").pop();

    const isAdmin = currentMember.role === "ADMIN";
    const isModerator = currentMember.role === "MODERATOR";
    const isOwner = currentMember._id === member._id;
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !deleted && isOwner && !fileUrl;
    const isPDF = fileType === "pdf" && fileUrl;
    const isImage = !isPDF && fileUrl;
    const isPoll = message?.pollId;

    const isMessageOwner = type==="conversation" && currentMember._id === member._id;
    const [selectedOption, setSelectedOption] = useState("");
    const [barWidth, setBarWidth] = useState(calculateBarWidth(message?.pollId?.options)); 
    const [optionHovered, setOptionHovered] = useState("");
    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] :any = useState([]);

    useEffect(() => {
        setOptions(message?.pollId?.options);
    }, [message?.pollId?.options]);

    useEffect(() => {
        let radiobtn = null;
        if(options) {
            options.forEach((option: any, index: any) => {
                if(option.voters){
                    option.voters.forEach((voter: any) => {
                        if(voter._id === currentMember._id){
                            radiobtn = document.getElementById(`${messageId}option${index}`);
                            if(radiobtn){
                                radiobtn.checked = true;
                                // setSelectedOption(`${messageId}option${index}`);
                                setSelectedOptions([...selectedOptions, `${messageId}option${index}`]);
                            }
                        }
                    });
                }
            });
        }
        setBarWidth(calculateBarWidth(options));
    }, [options]);


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

            // setSelectedOption("");
            setSelectedOptions(selectedOptions.filter((item:any) => item !== oid));
        } else {

            if(!message?.pollId?.allowMultiple && selectedOptions.length > 0){
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

    return (
        <>


        {type==="channel" && isPoll &&
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
                    <ActionToolTip label={member.role}>
                        {roleIconMap[member.role]}
                    </ActionToolTip>
                    </div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {timestamp}
                    </span>
                </div>

                <div className="bg-zinc-700/75 mt-5 p-4 rounded-lg w-[40%] mr-3">
                    

                    <div className="mb-4">
                        <p className="text-white text-m">{message.pollId.question}</p>
                        <div className="mt-1">
                            {message.pollId.allowMultiple ? 
                                <p className="text-white text-xs">Select one or more options</p>
                                : <p className="text-white text-xs">Select one option</p>}
                        </div>
                    </div>
                    <div className="mb-4">
                        {message.pollId.options.map((option: any,index:any) => (
                            <div key={`option${index}`} className={`flex items-center mb-2 rounded px-3 py-1 ${optionHovered === `option${index}` ? 'bg-zinc-600/90' : ''}`}
                                onMouseEnter={() => setOptionHovered(`option${index}`)} 
                                onMouseLeave={() => setOptionHovered("")}
                            >
                            <input id={`${messageId}option${index}`} type="radio" name={`${messageId}option${index}`} className="mr-2" onClick={() => handleVote(`${messageId}option${index}`, option.option)}
                            />
                            <div className="container p-1">
                                <span className="text-white text-sm">{option.option}</span>
                                <div className="flex-grow h-2 mx-4 bg-black rounded-full mt-2 ml-0 left-0 flex items-center">
                                    <div className="bg-green-500 h-[86%] rounded-full" style={{width: `${index<barWidth.length ? barWidth[index] : 0}%`, transition: 'width 0.5s ease'}}></div>
                                </div>
                            </div>
                            <span className="text-white text-sm">{option.voters.length}</span>
                            </div>
                        ))}
                    </div>
                    <div className="text-center container bg-zinc-800 w-full h-full p--2" onClick={() => onOpen("viewVotes", {votes: message?.pollId?.options})}>
                        {/* <button  className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-sm"> */}
                        View votes
                        {/* </button> */}
                    </div>
                    </div>

                 </div>
            </div>
            </div>
        }

        {/* ------------------------------------------------------------------------ */}

        {type==="channel" && !isPoll &&
            <div id={id} className="relative group items-center hover:bg-black/5 p-4 transition w-full">
            {reply && (
                <div onClick={() => onReplyClick(reply.replyToId)} className="ml-4 text-xs flex items-center gap-x-2 p-2 rounded-md">
                    <Reply className="w-4 h-4 text-zinc-500 dark:text-zinc-400" style={{ transform: 'scaleX(-1)' }} />
                    <UserAvatar src={reply.replyToAvatar} className="h-3 w-3 md:h-3 md:w-3" />
                    <p className="text-xs text-zinc-600 dark:text-zinc-200">
                    {reply.replyToName}: {reply.replyToContent}
                    </p>
                </div>
            )}
                    <div className="group flex gap-x-2 items-start w-full">
                <div className="cursor-pointer" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                {member && <UserCardAvatar user={member?.userId} currentUserId={currentMember.userId._id} chatId={chatId} isHovered={isHovered} />}
                </div>
                <div className="flex flex-col w-full">
                <div className="flex items-center gap-x-2"> 
                    <div className="flex items-center">
                    <p onClick={onMemberClick} className="font-semibold text-sm hover:underline cursor-pointer">
                        {member?.userId?.displayname}
                    </p>
                    <ActionToolTip label={member.role}>
                        {roleIconMap[member.role]}
                    </ActionToolTip>
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
                    <div>   
                        
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

                        <div className="flex gap-x-2 mt-2">
                        {reactions.map((reaction: any) => (
                            <div key={reaction.emoji} className="flex gap-x-1">
                            {reaction.memberId.length > 0 && (
                                <ReactionDisplayer type={type} emoji={reaction.emoji} memberId={reaction.memberId} currentMemberId={currentMember._id} onReactionClick={onRemoveReaction}/>
                            )}
                            </div>
                        ))}
                        </div>
                    </div>
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

                {!isEditing && (
                <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
                <div className="relative group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                    <div className={`group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm ${isHovered ? 'flex' : 'hidden'}`}>
                        
                        <ActionToolTip label="React">
                            <EmojiReactionPicker onChange={(emoji: string) => onAddReaction(emoji)} isHovered={isHovered} />
                        </ActionToolTip>
                        <ActionToolTip label="Reply">
                            <Reply
                                className="cursor-pointer w-5 h-5 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                                onClick={handleChange}
                            />
                        </ActionToolTip>
                        {canEditMessage && ( 
                            <ActionToolTip label="Edit">
                                <Edit
                                    onClick={() => setIsEditing(true)}
                                    className="cursor-pointer w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                                />
                            </ActionToolTip>
                        )}
                        {canDeleteMessage && (
                            <ActionToolTip label="Delete">
                                <Trash
                                    onClick={() => onOpen("deleteMessage", { 
                                        apiUrl: `${socketUrl}/${id}`,
                                        query: socketQuery,
                                    })}
                                    className="cursor-pointer w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                                />
                            </ActionToolTip>
                        )}
                        {isAdmin && (
                            !isPinned ?
                                <ActionToolTip label="Pin">
                                    <Pin onClick={onPinMessage} className="cursor-pointer w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
                                </ActionToolTip>
                                :
                                <ActionToolTip label="Unpin">
                                    <PinOff onClick={onUnpinMessage} className="cursor-pointer w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
                                </ActionToolTip>
                            )
                        }

                    </div>
                </div>
                </div>
            )}
            </div>
        }

  {/* ----------------------------------------------------------------------------------------------------------------------------------------------------------       */}

        {type==="conversation" && 
            <div id={id} className="relative group items-center hover:bg-black/5 p-4 transition w-full">
                {reply && (
                <div onClick={() => onReplyClick(reply.replyToId)} className="ml-4 text-xs flex items-center gap-x-2 p-2 rounded-md">
                    <Reply className="w-4 h-4 text-zinc-500 dark:text-zinc-400" style={{ transform: 'scaleX(-1)' }} />
                    <UserAvatar src={reply.replyToAvatar} className="h-3 w-3 md:h-3 md:w-3" />
                    <p className="text-xs text-zinc-600 dark:text-zinc-200">
                    {reply.replyToName}: {reply.replyToContent}
                    </p>
                </div>
            )}
                    <div className="group flex gap-x-2 items-start w-full">
                <div className="cursor-pointer" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                {member && <UserCardAvatar user={member} currentUserId={currentMember._id} chatId={chatId} isHovered={isHovered} />}
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
                    <div>   
                        
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

                        <div className="flex gap-x-2 mt-2">
                        {reactions.map((reaction: any) => (
                            <div key={reaction.emoji} className="flex gap-x-1">
                            {reaction.memberId.length > 0 && (
                                <ReactionDisplayer type={type} emoji={reaction.emoji} memberId={reaction.memberId} currentMemberId={currentMember._id} onReactionClick={onRemoveReaction}/>
                            )}
                            </div>
                        ))}
                        </div>
                    </div>
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

                {!isEditing && (
                <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
                <div className="relative group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                    <div className={`group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm ${isHovered ? 'flex' : 'hidden'}`}>
                        
                        <ActionToolTip label="React">
                                <EmojiReactionPicker onChange={(emoji: string) => onAddReaction(emoji)} isHovered={isHovered} />
                        </ActionToolTip>
                        <ActionToolTip label="Reply">
                            <Reply
                                className="cursor-pointer w-5 h-5 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                                onClick={handleConChange}
                            />
                        </ActionToolTip>
                        {isMessageOwner && ( 
                            <ActionToolTip label="Edit">
                                <Edit
                                    onClick={() => setIsEditing(true)}
                                    className="cursor-pointer w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                                />
                            </ActionToolTip>
                        )}
                        {isMessageOwner && (
                            <ActionToolTip label="Delete">
                                <Trash
                                    onClick={() => onOpen("deleteMessage", { 
                                        apiUrl: `${socketUrl}/${id}`,
                                        query: socketQuery,
                                    })}
                                    className="cursor-pointer w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                                />
                            </ActionToolTip>
                        )}
                    </div>
                </div>
                </div>
            )}
            </div>
        }

        </>
        
    )
}