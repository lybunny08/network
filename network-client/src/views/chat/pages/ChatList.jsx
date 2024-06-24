import React, { useState, useEffect } from "react";

import { getChats, getConnectionRequests } from "../../../helper/requests";
import ChatAvatar from "../../../components/chat/ChatAvatar";

const ChatList = ({ showChatSpace, viewSection }) => {
    const [chats, setChats] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            if (viewSection === 'Demandes') {
                try {
                    const response = await getConnectionRequests();
                    if (response.error) {
                        setError(response.error);
                    } else {
                        console.log(response);
                    }
                } catch (err) {
                    setError('Failed to fetch connection requests');
                }
            } else {
                try {
                    let limit = 20;
                    let offset = 0;
                    const response = await getChats(limit, offset);
                    if (response.error) {
                        setError(response.error);
                    } else {
                        setChats(response);
                    }
                } catch (err) {
                    setError('Failed to fetch chats');
                }
            }

            setLoading(false);
        };

        fetchData();
    }, [viewSection]);

    if (loading) {
        return <div className="d-flex justify-content-center">Loading...</div>;
    }

    if (error) {
        return <div className="d-flex justify-content-center text-danger">Error: {error}</div>;
    }

    return (
        <>
            {viewSection === 'Demandes' ? (
                requests.length === 0 ? (
                    <div className="d-flex justify-content-center">
                        Aucun résultat.
                    </div>
                ) : (
                    <div className="d-flex justify-content-center">
                        {requests.map((request) => (
                            <ChatAvatar key={request._id} chat={request} handleClick={showChatSpace} />
                        ))}
                    </div>
                )
            ) : (
                chats.length === 0 ? (
                    <div className="d-flex justify-content-center">
                        Aucun résultat.
                    </div>
                ) : (
                    <div className="d-flex justify-content-center">
                        {chats.map((chat) => (
                            <ChatAvatar key={chat._id} chat={chat} handleClick={showChatSpace} />
                        ))}
                    </div>
                )
            )}
        </>
    );
};

export default ChatList;
