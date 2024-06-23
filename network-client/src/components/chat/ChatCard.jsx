import React from 'react';

const ChatCard = ({ person, lastMessage }) => {
    const {userName, imageUrl} = person;
    const lastMessage = lastMessage;

    return (
        <div className="py-2 px-3 d-flex" id='chat-card'>
            <img src=''  alt='image' style={{ width: '45px', height: '45px', borderRadius: '50%', marginRight: '15px' }} />
            <div className='d-flex flex-column'>
                <span className="fs-6" id='userName'>{userName}</span>
                <span className='text-muted small' id='lastMessage'>{imageUrl}</span>
            </div>
        </div>
    );
};

export default ChatCard;