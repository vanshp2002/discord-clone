"use client";

import React, { useState } from 'react';
import axios from 'axios';
import qs from "query-string";

interface CustomPollProps {
    onSubmit: () => void;
    query: Record<string, any>;
}

const CustomPoll = ({
    onSubmit,
    query,
 }: CustomPollProps) => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']); // Initially two empty options

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

    const handleSubmit = async (e: any) => {
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
            onSubmit();
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">Create Poll</h2>
            <form onSubmit={handleSubmit}>
                <label className="block mb-2">
                    <span className="text-gray-700">Question:</span>
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="form-input mt-1 block w-full"
                    />
                </label>
                {options.map((opt, index) => (
                    <div key={index} className="mb-2">
                        <label className="block mb-1">
                            <span className="text-gray-700">Option {index + 1}:</span>
                            <input
                                type="text"
                                value={opt}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                className="form-input mt-1 block w-full"
                            />
                        </label>
                        <button type="button" onClick={() => handleRemoveOption(index)} className="text-red-600">
                            Remove Option
                        </button>
                    </div>
                ))}
                <button type="button" onClick={handleAddOption} className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2">
                    Add Option
                </button>
                <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded-md">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default CustomPoll;