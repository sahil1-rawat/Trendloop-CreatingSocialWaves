import React from 'react';

const Loading = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-16 h-16 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent'></div>
    </div>
  );
};
export const LoadingAnimation = () => {
  return (
    <div className='inline-block w-5 h-5 border-2 border-t-2 border-r-transparent border-red-500 rounded-full animate-spin'></div>
  );
};
export default Loading;
