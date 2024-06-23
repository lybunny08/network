import React from 'react';
import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import ChatRequstes from '../components/chat/ChatRequests';
import ChatList from '../components/chat/ChatList';

const Messages = () => {
  const chatListChoicesStyles = {
    focus: 'fw-bold',
    normal: 'fw-normal'
  }
  const [chatListView, setChatListView] = useState('messages');
  const [chatListChoiceMessageStyle, setChatListChoiceMessageStyle] = useState(chatListChoicesStyles.focus);
  const [chatListChoiceRequestStyle, setChatListChoiceRequestStyle] = useState(chatListChoicesStyles.normal);
  
  const switchChatListView = (value) => () => {
    setChatListView(value);
  }

  useEffect(() => {
    switch (chatListView) {
      case 'messages':
        setChatListChoiceMessageStyle(chatListChoicesStyles.focus);
        setChatListChoiceRequestStyle(chatListChoicesStyles.normal);
        break;
      case 'requests':
        setChatListChoiceMessageStyle(chatListChoicesStyles.normal);
        setChatListChoiceRequestStyle(chatListChoicesStyles.focus);
        break
      default:
        console.log("not allowed.");
        break;
    }
  }, [chatListView]);

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
                className={`btn btn-link col text-decoration-none text-dark ${chatListChoiceMessageStyle}`}
                type="button"
                onClick={switchChatListView('messages')} >Messages</button>
              <button  
                className={`btn btn-link col text-decoration-none text-dark ${chatListChoiceRequestStyle}`}
                type="button"
                onClick={switchChatListView('requests')}>Demandes</button>
            </div>
            <div id='chat-list' 
              style={{ height: '28rem'}} 
              className='overflow-y-auto mt-3'>
                { 
                  chatListView == 'requests' ? (
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