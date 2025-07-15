import React from 'react';
import { BsCheck2All } from 'react-icons/bs';

const UserChat = ({ chat, isOnline, onSelect }) => {
  const other = chat.users[0];
  const latestText = chat.latestMessage?.text ?? '';
  const isSent = chat.latestMessage?.sender === other._id;

  return (
    <button
      onClick={onSelect}
      className='w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-gray-100'>
      <div className='relative'>
        <img
          src={other.profilePic.url}
          alt='avatar'
          className='w-9 h-9 rounded-full object-cover'
        />
        {isOnline && (
          <span className='absolute bottom-0 right-0 block w-3 h-3 bg-green-500 rounded-full ring-2 ring-white' />
        )}
      </div>
      <div className='flex-1 min-w-0'>
        <p className='font-medium truncate'>{other.name}</p>
        <p className='text-xs text-gray-500 truncate flex items-center gap-1'>
          {!isSent && <BsCheck2All className='inline' />}
          {latestText}
        </p>
      </div>
    </button>
  );
};
export default UserChat;
