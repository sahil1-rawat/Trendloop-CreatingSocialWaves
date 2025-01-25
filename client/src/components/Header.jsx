import React, { useState } from 'react';
import logo from '../assets/logo1.gif';
import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa'; // Importing social media icons
import { Link } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    try {
      const searchTerm = e.target.value;
      setSearch(searchTerm);

      if (searchTerm) {
        // Only make the API call if there's a search term
        const res = await axios.get(
          `/api/user/get/alluser?search=${searchTerm}`
        );

        const users = res.data.users || []; // Extract users from response
        setResults(users); // Set the search results
      } else {
        setResults([]); // Clear results if the search term is empty
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleUserClick = () => {
    setResults([]);
    setSearch('');
  };
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
            value={search}
            onChange={handleSearch}
          />
          <FaSearch className='absolute top-3 right-3 text-gray-400' />

          {search && results.length > 0 && (
            <div className='absolute w-full bg-white border border-gray-300 shadow-lg mt-2 rounded-lg max-h-60 overflow-y-auto'>
              <ul className='text-sm text-gray-700'>
                {results.map((user) => (
                  <li
                    key={user._id}
                    className='p-2 hover:bg-gray-100 cursor-pointer'>
                    <Link
                      to={`/user/${user._id}`}
                      className='flex items-center space-x-2'
                      onClick={handleUserClick}>
                      <img
                        src={user.profilePic?.url || 'default-profile-pic.jpg'}
                        alt={user.name}
                        className='w-8 h-8 rounded-full'
                      />
                      <span>{user.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
