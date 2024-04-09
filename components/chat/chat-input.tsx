"use client";

import React, { useState } from 'react';
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Smile, Reply } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSharedState } from '@/components/providers/reply-provider';
import CustomPoll from '@/components/chat/custom-poll'
import { Button } from "@/components/ui/button"
import { UserAvatar } from "../user-avatar";
import {FaPoll} from "react-icons/fa";
import { useModal } from "@/hooks/use-modal-store";


import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EmojiPicker } from "../emoji-picker";
//   import { EmojiPicker } from "@/components/emoji-picker";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
})

export const ChatInput = ({
  apiUrl,
  query,
  name,
  type
}: ChatInputProps) => {

  const router = useRouter();
  const { onOpen } = useModal();

  const { replyMessage, setReplyMessage } = useSharedState("");
  const [createPoll, setCreatePoll] = useState(false);

  const handleClose = () => {
    setReplyMessage("");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const queryWithMessage = {
        ...query,
        ...replyMessage
      };
      const url = qs.stringifyUrl({
        url: apiUrl,
        query: queryWithMessage,
      });

      await axios.post(url, values);
      form.reset();
      setReplyMessage("");
      router.refresh();
    } catch (error) {
      console.log(error);
    }

  }

  const onPollSubmit = async () => {
    setCreatePoll(false);
  }

  return (
    <div>
      {/* {replyMessage &&
        <div className="flex">
          <Input
            className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
            placeholder={`${replyMessage?.replyName}`} disabled />
          <Button onClick={handleClose}>Click</Button>
        </div>
      } */}
      {replyMessage &&
        (
          <div className="flex p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg">
            <div className="flex items-center">
              <Reply className="h-4 w-4 mr-1 text-zinc-500 dark:text-zinc-400" style={{ transform: 'scaleX(-1)' }} />
              {/* <div className="h-8 w-8 bg-zinc-300 dark:bg-zinc-600 rounded-full flex items-center justify-center">
                <UserAvatar src={replyMessage.replyImg} className="h-8 w-8 md:h-8 md:w-8" />
              </div> */}
              <p className="text-xs text-zinc-600 dark:text-zinc-400 ml-2">
                <span className="font-semibold">Replying to {replyMessage.replyName}</span>
              </p>
            </div>
            <div className="flex-grow ml-2 pt-1.6 p-2 bg-zinc-700 rounded">
              <p className="text-[14px] text-zinc-600 dark:text-zinc-200 mb-1">{replyMessage.replyContent}</p>
            </div>
            <button onClick={handleClose} className="ml-3 mr-2 text-xs text-zinc-500 dark:text-zinc-400">
              &#10005;
            </button>
          </div>
        )
      }
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative p-4 pb-6">
                    <button
                      type="button"
                      onClick={() => onOpen("messageFile", { apiUrl, query })}
                      className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                    >
                      <Plus className="text-white dark:text-[#313338]" />
                    </button>
                    <Input
                      disabled={isLoading}
                      className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                      placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
                      {...field}
                    />
                    <div className="absolute top-7 right-8 flex my-auto">
                      <FaPoll onClick={() => { onOpen("createPoll", { query: query }) }} className=" mx-2 h-[24px] w-[24px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
                      <EmojiPicker
                        onChange={(emoji: string) => field.onChange(`${field.value} ${emoji}`)}
                      />
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>

  )
}