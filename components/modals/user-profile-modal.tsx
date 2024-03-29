
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
import FileUpload  from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect } from "react";
import { useServerState } from "@/components/providers/server-provider";


const formSchema = z.object({
    displayName:z.string().min(1,{message:"Display Name is required"}),
    imageUrl:z.string().min(0,{message: "Server image is required"}),
});


export const UserModal = ({}) => {
    const {isOpen,onClose,type, data} = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type==="editUser";
    const { user } = data;
    const { serverUpdated, setServerUpdated } = useServerState();


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            displayName:"",
            imageUrl:"",
        }
        });

    useEffect(() => {
        if(user){
            form.setValue("displayName", user.displayname);
            form.setValue("imageUrl", user.imageUrl);
        }
    }, [user, form]);

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values : z.infer<typeof formSchema>) => {
        try{
            const res = await fetch ("/api/modifyUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user?._id,
                    imageUrl: values.imageUrl,
                    displayname: values.displayName,
                }),
            });
            setServerUpdated(prevServerUpdated => prevServerUpdated + 1);
            form.reset();
            router.refresh();
            onClose();
        }catch(error){
            console.error("Error modifying user details", error);
        }
    }   

    const handleClose = () => {
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Customize your profile
                    </DialogTitle>

                    <DialogDescription className="text-center text-zinc-500">
                        Change your Display Name and upload a photo
                    </DialogDescription>                    
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex item-center justify-center text-center">
                                <FormField
                                control = {form.control}
                                name="imageUrl"
                                render = {({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload 
                                                endpoint="serverImage"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                                />
                            </div>

                            <FormField 
                                control={form.control}
                                name="displayName"
                                render = {({field}) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                Display Name
                                            </FormLabel>

                                            <FormControl>
                                                <Input 
                                                    disabled={isLoading}
                                                    className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" 
                                                    placeholder="Enter Display name"
                                                    {...field} 
                                                />
                                            </FormControl>
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
                                        Save
                                </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}