import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogHeader,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import qs from "query-string";
import { set } from "mongoose";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { UserAvatar } from "../user-avatar";
import { Separator } from "../ui/separator";
// import { ScrollArea } from "@radix-ui/react-scroll-area";
import { AiFillStar } from "react-icons/ai";
import { useRouter } from "next/navigation";

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
    "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500"/>
};

export const ViewVotesModal = ({}) => {

    const {isOpen,onClose,data,type} = useModal();

    const isModalOpen = isOpen && type==="viewVotes";

    const handleClose = () => {
        onClose();
    }

    const router = useRouter();

    const calculateIndex = (votes   : any) => {
        let maxVotes = 0;
        let index = -1;
        if(votes) {
            votes.forEach((vote:any, i: any) => {
                if(vote.voters.length > maxVotes){
                    maxVotes = vote.voters.length;
                    index = i;
                } 
            });
        }
        return index;
    }

    const {votes} = data;
    const [newvotes, setNewvotes] = useState([]);
    const [indexWithMaxVotes, setIndexWithMaxVotes] = useState(calculateIndex(newvotes));


    useEffect(() => {
        setNewvotes(votes);
    }, [votes]);

    useEffect(() => {
        const index = calculateIndex(newvotes);
        setIndexWithMaxVotes(index);
    }, [newvotes]);

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose} >
            {/* <DialogHeader  className="bg-gray-800 text-white p-4 max-w-md mx-auto rounded-lg">
                <DialogTitle className="text-xl mb-4 font-bold">Create a Poll</DialogTitle>
                <DialogDescription className="">Ask a question and let people vote on it</DialogDescription>
            </DialogHeader> */}
            <DialogContent  className="bg-gray-800 text-white p-4 max-w-md mx-auto rounded-lg">
            <DialogTitle className="mt-3 mx-auto text-xl font-bold">View Votes</DialogTitle>
                <DialogDescription className="mx-auto ">See which people have voted</DialogDescription>

                <div className="">
                   { votes && 
                    votes.map((vote: any, index: any) => (
                        <div key={index} className="p-3 mt-1">
                            <div className="flex items-center justify-between">
                                <p className="px-2">
                                    {vote.option}
                                </p>
                                <div className="flex items-center gap-x-2">
                                    {indexWithMaxVotes===index && <AiFillStar className="h-5 w-5 text-yellow-500"/>}
                                    <p className="text-xs mr-5">
                                        {vote.voters.length} votes
                                    </p>
                                </div>
                            </div>
                            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-full mb-3 " />
                            <ScrollArea className="rounded bg-gray-700 px-2 py-0 flex-grow">
                            {vote.voters.map((voter:any, index: any) => (
                                <div key={index} className="flex items-center mt-2 p-2">
                                   <UserAvatar src={voter.userId.imageUrl} className="h-7 w-7 md:h-8 md:w-8 mr-2"/>
                                    <div className="flex flex-col gap-y-1 mr-2">
                                        <div className="text-xs font-semibold flex items-center gap-x-1">
                                            {voter.userId.username}
                                            {roleIconMap[voter.role]}
                                        </div>
                                        <p className="text-xs text-zinc-500"> 
                                            {voter.userId.email}
                                        </p>
                                    </div>
                                </div>
                            ))}    
                            </ScrollArea>
                        </div>
                    ))
                   }
                </div>
            </DialogContent>
            {/* <DialogFooter className="bg-gray-100 px-6 py-4">
                <Button
                    variant="primary"
                    >
                        Create
                </Button>
            </DialogFooter> */}
        </Dialog>
    )

}