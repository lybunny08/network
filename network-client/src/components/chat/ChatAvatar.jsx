import React from 'react';

const ChatAvatar = ({ chat, handleClick }) => {
    let chatId = chat._id;
    let userName = chat.users[0].userName;
    let lastMessage = chat.users[0].lastMessage;
    let imageAvatar = chat.users[0].imageAvatar;
    let style = { backgroundColor: '#ffff'};

    return (
        <button className="py-2 d-flex w-100" id='chat-avatar'
            style={style}
            onClick={handleClick(chatId)}
        >
            <img src={imageAvatar}  alt='avatar' style={{ width: '45px', height: '45px', borderRadius: '50%', marginRight: '15px'}} />
            <div className='d-flex flex-column'>
                <span className="fs-6 text-dark" id='userName'>{userName}</span>
                <span className='text-muted small' id='lastMessage'>{lastMessage}</span>
            </div>
        </button>
    );
};

export default ChatAvatar;