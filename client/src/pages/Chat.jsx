import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { useChatStore } from '../../store';
import { FaSearch } from 'react-icons/fa';
import UserChat from '../components/Chat/UserChat';
import MessageContainer from '../components/Chat/MessageContainer';
import { SocketData } from '../context/SocketContext';

const Chat = ({ user }) => {
  const { chats, selectedChat, setChats, setSelectedChat } = useChatStore();
  const [users, setUsers] = useState([]);
  const [searchMode, setSearchMode] = useState(false);
  const [query, setQuery] = useState('');
  const searchInputRef = useRef(null);
  const { onlineUsers } = SocketData();

  /* -------------------------------- Fetch Users */
  const fetchAllUsers = async () => {
    try {
      let page = 1;
      const all = [];
      let hasMore = true;
      while (hasMore) {
        const { data } = await axios.get(
          `/api/user/get/alluser?search=${query}&page=${page}`
        );
        const pageUsers = data.users ?? [];
        all.push(...pageUsers);
        hasMore = pageUsers.length === 20;
        page += 1;
      }
      setUsers(all);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load users');
    }
  };

  /* -------------------------------- Fetch Chats */
  const getAllChats = async () => {
    try {
      const { data } = await axios.get('/api/messages/chat');
      setChats(Array.isArray(data.chats) ? data.chats : []);
    } catch (err) {
      console.error(err);
    }
  };

  /* -------------------------------- Lifecycle */
  useEffect(() => {
    fetchAllUsers();
  }, [query]);

  useEffect(() => {
    getAllChats();
  }, []);

  /* -------------------------------- New Chat */
  const createChat = async (id) => {
    try {
      await axios.post('/api/messages', { receiverId: id, message: 'Hi 👋' });
      getAllChats();
      setSearchMode(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not create chat');
    }
  };

  /* -------------------------------- UI */
  return (
    <div className='flex h-screen bg-gray-50'>
      {/* SIDEBAR */}
      <aside className='w-full md:w-1/3 lg:w-1/4 border-r bg-white flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b'>
          <h2 className='font-semibold text-lg'>Chats</h2>
          <button
            onClick={() => setSearchMode((v) => !v)}
            className='text-gray-600 hover:text-black transition'
            title={searchMode ? 'Close search' : 'Search users'}>
            {searchMode ? '✕' : <FaSearch />}
          </button>
        </div>

        {/* Search input */}
        {searchMode && (
          <div className='p-3'>
            <input
              ref={searchInputRef}
              type='text'
              className='w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-400'
              placeholder='Search by name…'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        )}

        {/* List */}
        <div className='flex-1 overflow-y-auto'>
          {searchMode ? (
            users.length ? (
              users.map((u) => (
                <button
                  key={u._id}
                  onClick={() => createChat(u._id)}
                  className='w-full flex items-center gap-3 p-3 hover:bg-gray-100'>
                  <img
                    src={u.profilePic.url}
                    alt='avatar'
                    className='w-9 h-9 rounded-full object-cover'
                  />
                  <span className='text-sm font-medium text-gray-800'>
                    {u.name}
                  </span>
                </button>
              ))
            ) : (
              <p className='text-center text-gray-500 py-8'>No users found.</p>
            )
          ) : chats.length ? (
            chats.map((chat) => (
              <UserChat
                key={chat._id}
                chat={chat}
                isOnline={onlineUsers.includes(chat.users[0]._id)}
                onSelect={() => setSelectedChat(chat)}
              />
            ))
          ) : (
            <p className='text-center text-gray-500 py-8'>
              Start a conversation!
            </p>
          )}
        </div>
      </aside>

      {/* MAIN CHAT AREA */}
      <main className='flex-1 flex flex-col'>
        {selectedChat ? (
          <MessageContainer selectedChat={selectedChat} />
        ) : (
          <div className='flex flex-col items-center justify-center h-full text-gray-500'>
            <p className='text-2xl'>👋 Hi {user.name}</p>
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Chat;
