import React, { useState, useEffect } from "react";
import ChatCard from "./ChatCard";
import { getChats } from "../../helper/requests";

const ChatList = () => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChats = async () => {
            let limit = 20;
            let offset = 0;

            const response = await getChats(limit, offset);

            if (response.error || response.message) {
                setError(response.error ?? response.message);
            } else {
                setChats(response);
            }

            setLoading(false);
        };

        fetchChats();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            {chats.length === 0 ? (
                <div className="d-flex justify-content-center">
                    <span>Vide.</span>
                </div>
            ) : (
                chats.map((chat) => <ChatCard key={chat._id} chat={chat} />)
            )}
        </>
    );
};

export default ChatList;
