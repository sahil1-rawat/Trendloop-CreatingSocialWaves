import React from 'react';
import { FaRegHandshake } from 'react-icons/fa';
import { useUserStore } from '../../../../../store';

const EmptyChatContainer = () => {
  const { usersData } = useUserStore();

  return (
    <div className='flex-1 flex-col justify-center items-center bg-gradient-to-br from-[#1a1a1a] via-[#2b2b2b] to-[#3c3c3c] p-8 md:p-16 text-center hidden md:flex'>
      <div className='text-white max-w-lg mx-auto'>
        <h3 className='text-4xl font-bold leading-tight'>
          <div className='flex items-center justify-center mb-2'>
            Hey {usersData?.name || 'there'}
            <FaRegHandshake className='ml-3 text-[#ffd60a] animate-pulse' />
          </div>
        </h3>
        <p className='text-lg text-gray-300 mt-4'>
          Start chatting with your friends and connections.
          <br />
          Tap on a chat or search for someone new!
        </p>
        <div className='mt-8 text-sm text-gray-500'>
          Stay connected. Stay trending. 🚀
        </div>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
