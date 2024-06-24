import React, { useState, useEffect } from "react";

import SearchBar from "../../../components/SearchBar";
import SwitchableButton from "../../../components/chat/SwitchButton";
import ChatList from "./ChatList";

export default function NetworkSpace ({ showChatSpace }) {
    const [viewSection, setViewSection] = useState("Messages");
    function onSwitch (value) {
      setViewSection(value);
    }

    return (
        <>
          <div id='chat-list-header' style={{ paddingRight:'2em'}}>
            <h5>Malcovys</h5>
            <SearchBar/>
          </div>
          <div className='mt-3' id='chat-list-body'>
            <SwitchableButton leftTitle="Messages" rightTitle="Demandes" onSwitch={onSwitch}/>
            <div id='chat-list' 
              style={{ height: '28rem'}} 
              className='overflow-y-auto mt-3'>
                <ChatList showChatSpace={showChatSpace} viewSection={viewSection}/>
            </div>
          </div>
        </>
    );
}