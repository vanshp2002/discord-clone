"use client";
import React, { createContext, useContext, useState } from 'react';

type SharedStateType = {
  replyMessage: string;
  setReplyMessage: React.Dispatch<React.SetStateAction<string>>;
};

const SharedStateContext = createContext<SharedStateType | undefined>(undefined);

export const SharedStateProvider: React.FC = ({ children }) => {
  const [replyMessage, setReplyMessage] = useState<string>('');

  return (
    <SharedStateContext.Provider value={{ replyMessage, setReplyMessage }}>
      {children}
    </SharedStateContext.Provider>
  );
};

export const useSharedState = () => {
  const context = useContext(SharedStateContext);
  if (context === undefined) {
    throw new Error('useSharedState must be used within a SharedStateProvider');
  }
  return context;
};
