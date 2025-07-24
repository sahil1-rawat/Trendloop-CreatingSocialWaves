import React from 'react';
import { useChatStore } from '../../store';
import ContactsContainer from '../components/Chat/components/contacts-container';
import EmptyChatContainer from '../components/Chat/components/empty-chat-container';
import { useMediaQuery } from 'react-responsive';
import ChatContainer from '../components/Chat/components/chat-container';

const Chat = () => {
  const { selectedChatType } = useChatStore();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className='flex h-[calc(100vh-64px)] text-white overflow-hidden'>
      {(!isMobile || selectedChatType === undefined) && <ContactsContainer />}
      
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer
         />
      )}
    </div>
  );
};

export default Chat;