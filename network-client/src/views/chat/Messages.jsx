import React, {useEffect, useState} from 'react';

import NetworkSpace from './pages/NetworkSpace';

const Messages = () => {
  const [showChat, setShowChat] = useState();

  function showChatSpace (chatId) {
    setShowChat(chatId);
  }


  return (
      <div className='d-flex flex-row'>
        <div className='border-end' id="chat-list" 
          style={{ padding:'1.5em 0em 0 2em', width:'20em' }}>
          <NetworkSpace showChatSpace={showChatSpace} />
        </div>
        <div className='' id='chat-view'>
          <p>chat veiw</p>
        </div>
      </div>
  );
};

export default Messages;