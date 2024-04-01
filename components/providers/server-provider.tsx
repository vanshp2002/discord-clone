"use client";
import React, { createContext, useContext, useState } from 'react';

type ServerStateType = {
    serverUpdated: any;
    setServerUpdated: React.Dispatch<React.SetStateAction<any>>;
};

const ServerStateContext = createContext<ServerStateType | undefined>(undefined);

export const ServerStateProvider: React.FC = ({ children }) => {
    const [serverUpdated, setServerUpdated] = useState(1);

    return (
        <ServerStateContext.Provider value={{ serverUpdated, setServerUpdated }}>
            {children}
        </ServerStateContext.Provider>
    );
};

export const useServerState = () => {
    const context = useContext(ServerStateContext);
    if (context === undefined) {
        throw new Error('useSharedState must be used within a SharedStateProvider');
    }
    return context;
};