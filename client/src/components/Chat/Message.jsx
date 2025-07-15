import React from 'react';
// import dayjs from 'dayjs';

const Message = ({ message, own }) => {
  // const time = dayjs(message.createdAt).format('HH:mm');
  return (
    <div className={`flex ${own ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs break-words rounded-lg px-3 py-2 text-sm shadow ${
          own ? 'bg-blue-500 text-white' : 'bg-white text-gray-900'
        }`}>
        <p>{message.text}</p>
        <span className='block text-[10px] text-right mt-1 opacity-75'>
          {/* {time} */}
        </span>
      </div>
    </div>
  );
};
export default Message;
