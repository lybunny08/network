import React from 'react';

const ChatAvatar = ({ chat, handleClick }) => {
    const { _id: chatId, user } = chat; // Destructuring et aliasing pour plus de lisibilité
    const { userName, lastMessage, profilImageUrl } = user; // Destructuring des propriétés de user
    const style = { backgroundColor: '#ffff' };

    const handleButtonClick = () => {
        handleClick(chatId); // Appelle handleClick avec chatId lorsque le bouton est cliqué
    };

    return (
        <button
            className="py-2 d-flex w-100"
            id='chat-avatar'
            style={style}
            onClick={handleButtonClick} // Utilise une fonction de rappel pour onClick
        >
            <img src={profilImageUrl} alt='avatar' style={{ width: '45px', height: '45px', borderRadius: '50%', marginRight: '15px' }} />
            <div className='d-flex flex-column'>
                <span className="fs-6 text-dark" id='userName'>{userName}</span>
                <span className='text-muted small' id='lastMessage'>{lastMessage}</span>
            </div>
        </button>
    );
};

export default ChatAvatar;
