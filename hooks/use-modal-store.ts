import {create} from "zustand";

export type ModalType = "createServer" | "invite" | "editServer" | "members" | "editUser" | "createChannel" | "leaveServer" | "deleteServer" | "deleteChannel" | "editChannel" | "messageFile" | "deleteMessage" | "createPoll"
    | "viewVotes";

interface ModalData {
    server?: string;
    user?: string;
    channel?: string;
    channelType?: string;
    apiUrl?: string;
    query?: Record<string, any>;
    votes?: any;
}

interface ModalStore {
    type: ModalType | null;
    data: ModalData;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type:null,
    data: {},
    isOpen: false,
    onOpen: (type,data={}) => set({type, isOpen: true, data}),
    onClose: () => set({type: null, isOpen: false}),
}));