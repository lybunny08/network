import React from 'react';

const ChatCard = ({ person, lastMessage }) => {
    // let {userName, imageUrl} = person;
    // let lastMessage = lastMessage;

    return (
        <button className="py-2 d-flex w-100" id='chat-card'
            style={{ backgroundColor: '#ffff'}}
        >
            <img src=''  alt='image' style={{ width: '45px', height: '45px', borderRadius: '50%', marginRight: '15px'}} />
            <div className='d-flex flex-column'>
                <span className="fs-6 text-dark" id='userName'>userName</span>
                <span className='text-muted small' id='lastMessage'>lastMessage</span>
            </div>
        </button>
    );
};

export default ChatCard;