import React, { useState, useEffect } from "react";

import { getChats } from "../../../helper/requests";
import ChatAvatar from "../../../components/chat/ChatAvatar";

const ChatList = ({ showChatSpace }) => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChats = async () => {
            let limit = 20;
            let offset = 0;

            const response = await getChats(limit, offset);

            if (response.error) {
                setError(response.error);
            } else {
                setChats(response);
            }

            setLoading(false);
        };

        fetchChats();
    }, []);

    if (loading) {
        return <div className="d-flex justify-content-center">Loading...</div>;
    }

    if (error) {
        return <div className="d-flex justify-content-center text-danger">Error: {error}</div>;
    }

    return (
        <>
            {chats.length === 0 ? (
                <div className="d-flex justify-content-center">
                    Aucun message trouvé.
                </div>
            ) : (
                <div className="d-flex justify-content-center">
                    {chats.map((chat) => <ChatAvatar key={chat._id} chat={chat} handleClick={showChatSpace} />)}
                </div>
            )}
        </>
    );
};

export default ChatList;