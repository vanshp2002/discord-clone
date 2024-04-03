"use client";
import React, { createContext, useContext, useState } from 'react';

type SharedListType = {
    list: string;
    setList: React.Dispatch<React.SetStateAction<string>>;
};

const SharedListContext = createContext<SharedListType | undefined>(undefined);

export const SharedListProvider: React.FC = ({ children }) => {
    const [list, setList] = useState<string>('');

    return (
        <SharedListContext.Provider value={{ list, setList }}>
            {children}
        </SharedListContext.Provider>
    );
};

export const useListState = () => {
    const context = useContext(SharedListContext);
    if (context === undefined) {
        throw new Error('useSharedState must be used within a SharedStateProvider');
    }
    return context;
};