import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useChatStore } from '../../store';

const Chat = () => {
  const { chats, selectedChat, setChats, setSelectedChats } = useChatStore();
  const [users, setUsers] = useState([]);
  const [query, SetQuery] = useState('');
  const [search, setSearch] = useState(false);
  async function fetchAllUsers() {
    try {
      const { data } = await axios.get(
        `/api/user/get/alluser?search=?search=${query}`
      );
      setUsers(data);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    fetchAllUsers();
  }, [query]);

  const getAllChats = async () => {
    try {
      const { data } = await axios.get('/api/messages/chat');
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllChats();
  }, []);

  async function createChat(id) {
    try {
      const { data } = await axios.post('/api/messages', {
        receiverId: id,
        message: 'hii',
      });
    } catch (e) {
      toast.error(e.response.data.message);
      console.log(e);
    }
  }
  return <div>Chat</div>;
};

export default Chat;
