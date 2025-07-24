import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatStore, useUserStore } from '../../store';
import ContactsContainer from '../components/Chat/components/contacts-container';
import EmptyChatContainer from '../components/Chat/components/empty-chat-container';
import ChatContainer from '../components/Chat/components/chat-container';

const Chat = () => {
  const {
    selectedChatType,
    selectedChatData,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useChatStore();
  const {usersData}=useUserStore();
  
  return (
    <div className='flex h-[90vh] text-white overflow-hidden'>
      <ContactsContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )} 
      
    </div>
  );
};

export default Chat;
