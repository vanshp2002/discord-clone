
export const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
    let conversation = await findConversation(memberOneId, memberTwoId) || await findConversation(memberOneId, memberTwoId);

    if (!conversation) {
        conversation = await createNewConversation(memberOneId, memberTwoId);
    }

    return conversation;
}

const findConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        const res: Response = await fetch("/api/conversations/find", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                memberOneId,
                memberTwoId
            })
        });
        const conversation = await res.json();
        return conversation;
    } catch {
        return null;
    }
}

const createNewConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        const res: Response = await fetch("/api/conversations/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                memberOneId,
                memberTwoId
            })
        });
        const conversation = await res.json();
        return conversation;
    } catch {
        return null;
    }
}