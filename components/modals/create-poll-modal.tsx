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

export const CreatePollModal = ({}) => {

    const {isOpen,onClose,data,type} = useModal();
    
    const isModalOpen = isOpen && type==="createPoll";

    const handleClose = () => {
        setQuestion('');
        setOptions(['', '']);
        setAllowMultiple(false);
        onClose();
    }

    const {query} = data;

    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']); // Initially two empty options
    const [allowMultiple, setAllowMultiple] = useState(false);

    const handleOptionChange = (index: any, value: any) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleAddOption = () => {
        setOptions([...options, '']);
    };

    const handleRemoveOption = (index: any) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Ensure question and at least two options are present
        if (question.trim() === '' || options.filter(opt => opt.trim() !== '').length < 2) {
            alert('Please provide a question and at least two options');
            return;
        }
        
        try {
            console.log("creating Polls");
            const url = qs.stringifyUrl({
                url: "/api/socket/polls",
                query,
            });

            const values = {
                question,
                options: options.filter(opt => opt !== ''),
            };

            await axios.post(url, values);
            e.target.reset();
            setQuestion('');
            setOptions(['', '']);
            setAllowMultiple(false);
            onClose();
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose} >
            {/* <DialogHeader  className="bg-gray-800 text-white p-4 max-w-md mx-auto rounded-lg">
                <DialogTitle className="text-xl mb-4 font-bold">Create a Poll</DialogTitle>
                <DialogDescription className="">Ask a question and let people vote on it</DialogDescription>
            </DialogHeader> */}
            <DialogContent  className="bg-gray-800 text-white p-4 max-w-md mx-auto rounded-lg">
            <DialogTitle className=" mt-3 mx-auto text-xl font-bold">Create a Poll</DialogTitle>
                <DialogDescription className="mx-auto ">Ask a question and let people vote on it</DialogDescription>
            {/* <div className="max-w-lg mx-auto p-6 bg-white rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">Create Poll</h2> */}
            <form onSubmit={handleSubmit}>

                <div className="mb-4">
                    <span className=" text-m">Question:</span>
                    <Input
                    type="text" 
                    value={question} 
                    onChange={(e) => setQuestion(e.target.value)} 
                    className="mt-1 p-2 w-full bg-gray-700 border border-gray-600 rounded"
                    placeholder="What do you want to ask?"
                    />
                </div>
                <div className="mb-4">
                    <span className=" text-m">Options:</span>
                    {options.map((option, index) => (
                    <div key={index} className="flex items-center mb-2 mt-2">
                        <Input 
                        type="text" 
                        value={option} 
                        onChange={(e) => handleOptionChange(index, e.target.value)} 
                        className="p-2 flex-grow bg-gray-700 border border-gray-600 rounded mr-2"
                        placeholder={`Option ${index + 1}`}
                        />
                        {options.length > 2 && (
                        <button type="button" onClick={() => setOptions(options.filter((_, i) => i !== index))} className="text-gray-400 hover:text-gray-300">
                            ×
                        </button>
                        )}
                    </div>
                    ))}
                    <button type="button" onClick={handleAddOption} className="text-sm text-blue-500 hover:text-blue-400">
                    + Add Option
                    </button>
                </div>
                <div className="flex items-center mb-4">
                    <input
                    type="checkbox"
                    checked={allowMultiple}
                    onChange={() => setAllowMultiple(!allowMultiple)}
                    className="mr-2"
                    />
                    <p className="text-xs">
                        Allow multiple answers
                    </p>
                </div>
                <Button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white">
                    Create Poll
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