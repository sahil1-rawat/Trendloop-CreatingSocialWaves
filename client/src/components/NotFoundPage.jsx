import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className='flex h-screen items-center justify-center bg-gray-100'>
      <div className='text-center'>
        <h1 className='text-6xl font-bold text-gray-800'>404</h1>
        <p className='mt-4 text-xl text-gray-600'>Page Not Found</p>
        <p className='mt-2 text-gray-500'>
          Sorry, the page you are looking for does not exist.
        </p>
        <Link
          to='/'
          className='mt-6 inline-block rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600'>
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
