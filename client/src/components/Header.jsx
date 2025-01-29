import React, { useRef, useState, useEffect } from 'react';
import logo from '../assets/logo1.gif';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const divRef = useRef(null);
  const searchRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // Function to fetch results
  const fetchResults = async (searchTerm) => {
    try {
      const res = await axios.get(`/api/user/get/alluser?search=${searchTerm}`);
      const users = res.data.users || [];
      setResults(users);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = async (e) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);

    if (searchTerm) {
      fetchResults(searchTerm); // Fetch results when the search term changes
    } else {
      setResults([]); // Clear results if search term is empty
    }
  };

  const handleUserClick = () => {
    setResults([]);
  };

  // Hide results when clicking outside but keep search term
  const handleOutsideClick = (event) => {
    if (
      divRef.current &&
      !divRef.current.contains(event.target) &&
      searchRef.current &&
      !searchRef.current.contains(event.target)
    ) {
      setResults([]); // Clear the results, keep search term
      setIsFocused(false); // Reset focus state
    }
  };

  const handleFocus = () => {
    setIsFocused(true); // Set focus state to true
    if (search && results.length === 0) {
      fetchResults(search); // Fetch results again if there is a search term
    }
  };

  const handleBlur = () => {
    setIsFocused(false); // Reset focus state when search input loses focus
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

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
        <div className='relative w-1/3 max-w-lg' ref={divRef}>
          <input
            type='text'
            placeholder='Search'
            className='w-full py-2 pr-7 pl-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
            value={search}
            ref={searchRef}
            onChange={handleSearch}
            onFocus={handleFocus} // Trigger when user focuses the input field again
            onBlur={handleBlur} // Trigger when input loses focus
          />
          <FaSearch className='absolute top-3 right-3 text-gray-400' />

          {search && results.length > 0 && isFocused ? (
            <div className='absolute w-full bg-white border border-gray-300 shadow-lg mt-2 rounded-lg max-h-60 overflow-y-auto z-[1000]'>
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
          ) : (
            search &&
            results.length === 0 &&
            isFocused && ( // Only show when search term exists, no results, and input is focused
              <div className='absolute w-full bg-white border border-gray-300 shadow-lg mt-2 rounded-lg z-[1000]'>
                <p className='p-2 text-sm text-gray-500'>No results found</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
