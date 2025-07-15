import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
// import Message from './Message';
// import MessageInput from './MessageInput';
import { useUserStore } from '../../../store';
import Loading, { LoadingAnimation } from '../Loading';
import Message from './Message';
import MessageInput from './MessageInput';
import { SocketData } from '../../context/SocketContext';
// import { SocketData } from '../../context/SocketContext';

const MessageContainer = ({ selectedChat, setChats }) => {
  const [messages, setMessages] = useState([]);
  const { usersData } = useUserStore();
  const [loading, setLoading] = useState(false);
  //   console.log(selectedChat.users[0]._id);
  const { socket } = SocketData();

  useEffect(() => {
    socket.on('newMessage', (message) => {
      if (selectedChat._id === message.chatId) {
        setMessages((prev) => [...prev, message]);
      }

      setChats((prev) => {
        const updatedChat = prev.map((chat) => {
          if (chat._id === message.chatId) {
            return {
              ...chat,
              latestMessage: {
                text: message.text,
                sender: message.sender,
              },
            };
          }
          return chat;
        });
        return updatedChat;
      });
    });

    return () => socket.off('newMessage');
  }, [socket, selectedChat, setChats]);

  async function fetchMessages() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/messages/${selectedChat.users[0]._id}`
      );

      setMessages(data['messages']);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const messageContainerRef = useRef(null);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div>
      {selectedChat && (
        <div className='flex flex-col h-full'>
          <div className='flex items-center gap-3 border-b px-4 py-3 bg-white shadow-sm'>
            <img
              src={selectedChat.users[0].profilePic.url}
              className='w-10 h-10 rounded-full object-cover'
              alt='avatar'
            />
            <div>
              <p className='font-medium'>{selectedChat.users[0].name}</p>
            </div>{' '}
          </div>
          <div className='flex-1 overflow-y-auto px-4 py-6 space-y-2 bg-gray-50'>
            {loading ? (
              <Loading />
            ) : (
              <>
                <div
                  ref={messageContainerRef}
                  className='flex flex-col gap-4 my-4 h-[400px] overflow-y-auto border border-gray-300 bg-gray-100 p-3'>
                  {messages &&
                    messages.map((m) => (
                      <Message
                        key={m._id}
                        message={m}
                        own={m.sender === usersData._id}
                      />
                    ))}
                </div>

                <MessageInput
                  setMessages={setMessages}
                  selectedChat={selectedChat}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
