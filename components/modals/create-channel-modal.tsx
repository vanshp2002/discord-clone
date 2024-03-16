
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

import { redirect } from "next/navigation";


import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogHeader,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { Select,
    SelectContent,
    SelectTrigger,
    SelectItem,
    SelectValue} from "@/components/ui/select";
import Channel from "@/models/channel";

const ChannelType = z.enum(["TEXT", "AUDIO", "VIDEO"]);

const formSchema = z.object({
    name:z.string().min(1,{message:"Channel name is required"}).refine(
        name => name !== "general",
        {
            message: "Channel name cannot be 'general'",
        }
    ),
    type: ChannelType,
});


export const CreateChannelModal = ({email}) => {
    const {isOpen,onClose,data,type} = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type==="createChannel";
    const {server} = data;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name:"",
            type:ChannelType.parse("TEXT"),
        }
        });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values : z.infer<typeof formSchema>) => {
        try{
            const response = await fetch("/api/fetchUserProfile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                    }),
                });

                const user = await response.json();
                
            const res = await fetch ("/api/servers/createchannel", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    serverId: server._id,
                    userId: user._id,
                    name: values.name,
                    type: values.type,
                }),
            });
            form.reset();
            router.refresh();
            onClose();
            window.location.reload();
        }catch(error){
            console.error("Error creating server", error);
        }
    }   

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
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
                                render = {({field}) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                Channel Name
                                            </FormLabel>

                                            <FormControl>
                                                <Input 
                                                    disabled={isLoading}
                                                    className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" 
                                                    placeholder="Enter Channel name"
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
                                render={({field}) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Channel Type
                                        </FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none" 
                                                >
                                                    <SelectValue placeholder="select channel type" />

                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent
                                                on hover focus ring color should be lighter than complete black
                                                className="bg-white border border-neutral-200 rounded-lg shadow-lg text-black"
                                            >
                                                <SelectItem value="TEXT">Text</SelectItem>
                                                <SelectItem value="AUDIO">Audio</SelectItem>
                                                <SelectItem value="VIDEO">Video</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>

                                )}

                            />
                        </div>
                        
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                                <Button
                                    variant="primary"
                                    disabled={isLoading}
                                    >
                                        Create
                                </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}