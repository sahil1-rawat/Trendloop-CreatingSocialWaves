import React from 'react';
import logo from '../assets/logo1.gif';
import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa'; // Importing social media icons
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className='w-full bg-white py-3 z-50 shadow-md'>
      <div className='container mx-auto flex justify-between items-center'>
        <div className='flex items-center'>
          <img
            src={logo}
            alt='Logo'
            className='w-12 h-12 mr-3 cursor-pointer'
          />
          <span className='font-bold text-xl text-gray-800'>Trendloop</span>
        </div>

        {/* Search Bar */}
        <div className='relative w-1/3 max-w-lg'>
          <input
            type='text'
            placeholder='Search'
            className='w-full py-2 pr-7 pl-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
          />
          <FaSearch className='absolute top-3 right-3 text-gray-400' />
        </div>

        {/* <div className='flex items-center space-x-6'>
          <FaBell className='text-2xl cursor-pointer text-gray-700' />
          <Link to='/account'>
            <FaUserCircle
              className='text-3xl cursor-pointer text-gray-700'
              title='Profile'
            />
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default Header;
