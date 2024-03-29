"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from 'react';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useModal } from "@/hooks/use-modal-store";

import {
    SelectContent,
    Select,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { useServerState } from "@/components/providers/server-provider";


const channelT = ['TEXT', 'AUDIO', 'VIDEO'];

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Channel name is required."
    }).refine(
        name => name !== "general",
        {
            message: "Channel name connot be 'general'"
        }
    ),
    type: z.string().min(4, {
        message: "Channel type is required."
    }),
})

export const CreateChannelModal = ({ email }) => {

    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const { server } = data;
    const { user } = data;
    const { channelType } = data;
    const isModalOpen = isOpen && type === "createChannel";

    const { serverUpdated, setServerUpdated } = useServerState();


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "TEXT"
        }
    });

    useEffect(() => {
        if (channelType) {
            form.setValue("type", channelType);
        }
        else {
            form.setValue("type", "TEXT");
        }
    }, [channelType, form])

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            console.log(values);
            console.log(server);
            console.log(user);
            const newchannel = await fetch("/api/channels/createchannel", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    serverId: server?._id,
                    userId: user?._id,
                    name: values.name,
                    type: values.type
                })
            })
            const toJson = await newchannel.json();
            setServerUpdated(prevServerUpdated => prevServerUpdated + 1);
            console.log(toJson);
            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.error("Error creating server", error);
        }
    }

    const handleClose = () => {
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black  p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Create Channel
                    </DialogTitle>

                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font bold text-zinc-500 dark:text-secondary/70">
                                            channel name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter channel name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Channel Type</FormLabel>
                                        <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger
                                                    className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                                                >
                                                    <SelectValue placeholder="Select a channel type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {channelT.map((type) => (
                                                    <SelectItem key={type} value={type} className="capitalize">
                                                        {type.toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="primary" disabled={isLoading}>
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}

export default CreateChannelModal;