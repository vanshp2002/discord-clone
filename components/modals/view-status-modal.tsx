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
import { use, useEffect, useState } from "react";
import qs from "query-string";
import { set } from "mongoose";
import { Input } from "../ui/input";
import { FileUpload } from "../ui/file-upload";
import { boolean } from "zod";
import { fetchData } from "next-auth/client/_utils";
import { UserAvatar } from "../user-avatar";
import { Separator } from "@radix-ui/react-separator";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const ViewStatusModal = ({ }) => {

    const { isOpen, onClose, data, type } = useModal();

    const isModalOpen = isOpen && type === "viewStatus";

    const handleClose = () => {
        setFileUrl([]);
        setIsVideo([]);
        setCurrIndex(0);
        onClose();
    }

    const { user } = data;
    const [guser, setGuser] = useState(null);
    const [fileUrl, setFileUrl]: any = useState([]);
    const [isVideo, setIsVideo]: any = useState([]);
    const [currIndex, setCurrIndex] = useState(0);

    useEffect(() => {

        const fetchStatus = async () => {
            try {

                const response = await fetch("/api/getuserbyid/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: user
                    })
                });
                const { user: usertemp } = await response.json();
                setGuser(usertemp);

                const res = await fetch("/api/status/getstatus/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: user
                    })
                });
                const { status: statuses } = await res.json();

                console.log(statuses);


                if (statuses.length > 0) {
                    setFileUrl([]);
                    setIsVideo([]);
                    let videobool = [];
                    let url = [];
                    for (let i = 0; i < statuses.length; i++) {
                        const status = statuses[i];
                        if (status.src.includes(".mp4")) {
                            videobool.push(true);
                        } else {
                            videobool.push(false);
                        }
                        url.push(status.src);
                    }
                    setFileUrl(url);
                    setIsVideo(videobool);
                }
            } catch (error) {
                console.log(error);
            }
            console.log(isVideo);
        }

        fetchStatus();

    }, [isOpen, user]);
    //check if extension is mp4
    //if yes, show video
    //if no, show image


    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     console.log(fileUrl);

    //     if(fileUrl === ''){
    //         alert("Please upload a file");
    //         return;
    //     }

    //     try {
    //         const url = qs.stringifyUrl({
    //             url: "/api/status/uploadstatus",
    //         });

    //         const values = {
    //             userId: user,
    //             fileUrl: fileUrl
    //         };

    //         await axios.post(url, values);
    //         e.target.reset();
    //         setFileUrl('');
    //         onClose();
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };



    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-zinc-900 text-white p-4 max-w-md max-h-md mx-auto rounded-lg">

                <div className="flex justify-between items-center p-2 mt-6">
                    <div className="flex items-center gap-x-2">
                        <UserAvatar src={guser?.imageUrl} className="w-6 h-6 md:w-7 md:h-7" />
                        <p className="text-white ml-2">{guser?.displayname}</p>
                    </div>
                    <p> {currIndex + 1}/{fileUrl.length} </p>
                </div>

                <Separator className="h-[3px] bg-zinc-300 dark:bg-zinc-700 rounded-md" style={{ maxWidth: "93%" }} />

                <div className="flex items-center">

                    <ChevronLeft onClick={() => setCurrIndex(Math.max(currIndex - 1, 0))} className=" text-white" style={{ zIndex: 3 }} />
                    <div className="flex items-center justify-between w-full">

                        <div className="flex items-center p-4">
                            {fileUrl.length > 0 && isVideo[currIndex] ?
                                <video src={fileUrl[currIndex]} controls className="w-auto h-full" />
                                :
                                <div className=" p-3 mx-auto w-auto h-full ">
                                    <img src={fileUrl[currIndex]} />
                                </div>
                            }
                        </div>

                    </div>
                    <ChevronRight onClick={() => setCurrIndex(Math.min(currIndex + 1, fileUrl.length - 1))} className=" text-white" style={{ zIndex: 3 }} />
                </div>
            </DialogContent>
        </Dialog>
    )

}