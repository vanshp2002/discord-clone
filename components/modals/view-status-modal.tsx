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

export const ViewStatusModal = ({}) => {

    const {isOpen,onClose,data,type} = useModal();
    
    const isModalOpen = isOpen && type==="viewStatus";

    const handleClose = () => {
        onClose();
    }

    const {user} = data;
    const [fileUrl, setFileUrl] = useState('');
    const [isVideo, setIsVideo] = useState(false);

    useEffect(() => {

        const fetchStatus = async () => {
            try {
                const res = await fetch("/api/status/getstatus/",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: user
                    })
                });
                const data = await res.json();

                setFileUrl(data.fileUrl);
                setIsVideo(data.fileUrl.includes("mp4"));
            } catch (error) {
                console.log(error);
            }
        }

        fetchStatus();

    }, [isOpen, user] );
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
        <Dialog open={isModalOpen} onOpenChange={handleClose} >
            <DialogContent  className="bg-gray-800 text-white p-4 max-w-md mx-auto rounded-lg">
            <DialogTitle className=" mt-3 mx-auto text-xl font-bold">View Status</DialogTitle>
                <DialogDescription className="mx-auto "> Update the network with your activity </DialogDescription>
            
            {/* show status here video /image */}

            {fileUrl && isVideo ? (
                <video src={fileUrl} controls className="w-full h-96" />
            ) : (
                <img src={fileUrl} alt ="status" className="w-full h-96" />
            )    
            }

            </DialogContent>
        </Dialog>
    )

}