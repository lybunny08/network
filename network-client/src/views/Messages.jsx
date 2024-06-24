import React from 'react';
import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import ChatRequstes from '../components/chat/ChatRequests';
import ChatList from '../components/chat/ChatList';

const Messages = () => {
  const chatStyles = {
    focus: 'fw-bold',
    normal: 'fw-normal'
  }
  const [chatView, setChatView] = useState('messages');
  const [chatMessageStyle, setChatMessageStyle] = useState(chatStyles.focus);
  const [chatRequestStyle, setChatRequestStyle] = useState(chatStyles.normal);
  
  const HandleswitchChatView = (value) => () => {
    setChatView(value);
  }

  useEffect(() => {
    switch (chatView) {
      case 'messages':
        setChatMessageStyle(chatStyles.focus);
        setChatRequestStyle(chatStyles.normal);
        break;
      case 'requests':
        setChatMessageStyle(chatStyles.normal);
        setChatRequestStyle(chatStyles.focus);
        break
      default:
        console.log("not allowed.");
        break;
    }
  }, [chatView]);

  return (
      <div className='d-flex flex-row'>
        <div className='border-end' id="chat-list" 
          style={{ padding:'1.5em 0em 0 2em', width:'20em' }}>
          <div id='chat-list-header' style={{ paddingRight:'2em'}}>
            <h5>Malcovys Bonely</h5>
            <SearchBar/>
          </div>
          <div className='mt-3' id='chat-list-body'>
            <div className='row text-center' id='chat-list-choices'>
              <button 
                className={`btn btn-link col text-decoration-none text-dark ${chatMessageStyle}`}
                type="button"
                onClick={HandleswitchChatView('messages')} >Messages</button>
              <button  
                className={`btn btn-link col text-decoration-none text-dark ${chatRequestStyle}`}
                type="button"
                onClick={HandleswitchChatView('requests')}>Demandes</button>
            </div>
            <div id='chat-list' 
              style={{ height: '28rem'}} 
              className='overflow-y-auto mt-3'>
                { 
                  chatView == 'requests' ? (
                    <ChatRequstes />
                  ) : (
                    <ChatList />
                  )
                }
              
              
            </div>
          </div>
        </div>
        <div className='' id='chat-view'>
          <p>chat veiw</p>
        </div>
      </div>
  );
};

export default Messages;