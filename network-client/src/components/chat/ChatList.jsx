import React from "react";
import { useState, useEffect } from "react";
import ChatCard from "./ChatCard";

const ChatList = () => {
    const [chats, setChats] = useState([]);


    return(
        <>
        {
            chats ? (
                <h1>Rien</h1>
            ) : (
                <ChatCard/>
            )
        }
            
        </>
    )
}

export default ChatList;