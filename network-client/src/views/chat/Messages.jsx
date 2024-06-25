import React, { useEffect, useState } from 'react';

import NetworkSpace from './pages/NetworkSpace';
import ChatSpace from './pages/ChatView';

const Messages = () => {
  const [showChat, setShowChat] = useState("");

  function showChatSpace(chatId) {
    setShowChat(chatId);
  }

  useEffect(() => {
    console.log(showChat);
  }, [showChat]);

  return (
    <div className='d-flex flex-row vh-100'>
      <div className='border-end' id="chat-list" 
        style={{ padding: '1.5em 0 0 2em', width: '20em', overflowY: 'auto' }}>
        <NetworkSpace showChatSpace={showChatSpace} />
      </div>
      <div className='flex-grow-1 d-flex justify-content-center' id='chat-view'>
        {showChat ? (
          <div>
              <ChatSpace chatId={showChat} />
          </div>
        ) : (
          <p>Selectionner un chat pour le voir</p>
        )}
      </div>
    </div>
  );
};

export default Messages;
