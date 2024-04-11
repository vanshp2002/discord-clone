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
import { useState } from "react";
import qs from "query-string";
import { set } from "mongoose";
import { Input } from "../ui/input";
import { FileUpload } from "../ui/file-upload";

export const UploadStatusModal = ({ }) => {

    const { isOpen, onClose, data, type } = useModal();

    const isModalOpen = isOpen && type === "uploadStatus";

    const handleClose = () => {
        setFileUrl('');
        onClose();
    }

    const { user } = data;

    const [fileUrl, setFileUrl] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(user, fileUrl);

        if (fileUrl === '') {
            alert("Please upload a file");
            return;
        }

        try {
            const res = await fetch("/api/status/uploadstatus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fileUrl,
                    userId: user,
                })
            });
            e.target.reset();
            setFileUrl('');
            onClose();
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose} >
            <DialogContent className="bg-gray-800 text-white p-4 max-w-md mx-auto rounded-lg">
                <DialogTitle className=" mt-3 mx-auto text-xl font-bold">Upload a Status</DialogTitle>
                <DialogDescription className="mx-auto "> Update the network with your activity </DialogDescription>
                {/* <div className="max-w-lg mx-auto p-6 bg-white rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">Create Poll</h2> */}
                <form onSubmit={handleSubmit}>

                    <FileUpload
                        endpoint="statusFile"
                        value={fileUrl}
                        onChange={(e) => setFileUrl(e)}
                    />
                    <Button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white">
                        Upload
                    </Button>
                </form>
                {/* </div> */}
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