// contact-container/index.jsx
import React, { useEffect } from 'react';
import Logo from '@/assets/logo.png';
// import { apiClient } from '@/lib/api-client';
// import {
//   GET__CHAT_CONTACTS_ROUTE,
//   GET_USER_GROUP_ROUTE,
// } from '@/utils/constants';
// import ContactList from '@/components/ui/contact-list.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import NewMessage from './components/new-msg';
import ContactList from '../chat-container/components/contact-list';
import { useChatStore } from '../../../../../store';
import axios from 'axios';
import { BASE_URL } from '../../../../../common';
// import ProfileInfo from './components/profile-info';
// import moment from 'moment';
// import CreateGroup from './components/create-group';

const ContactsContainer = () => {
  const {
    setDirectMessagesContacts,
    directMessagesContacts,
    setSelectedChatData,
    groups,
    setGroups,
  } = useChatStore();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SOCKET_URL}/api/messages/get-chat-contacts`, {
          withCredentials: true,
        });
        // //console.log(`${res.data.contacts}`);

        if (res.data.contacts) {
          setDirectMessagesContacts(res.data.contacts);
        }
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
      }
    };
    /*     const getGroups = async () => {
      try {
        const res = await apiClient.get(GET_USER_GROUP_ROUTE, {
          withCredentials: true,
        });
        if (res.data.groups) {
          setGroups(res.data.groups);
        }
      } catch (err) {
        //console.log(err);
        console.error('Failed to fetch groups:', err);
      }
    }; */
    getContacts();
    // getGroups();
  }, [setDirectMessagesContacts, setGroups]);

  return (
<div className='relative w-full bg-[#2e2f38] text-[#e5e5e5] border-r border-[#32343e]
 max-w-[90vw] md:max-w-[35vw] xl:max-w-[20vw]'>
      <Tabs defaultValue='chats' className='w-full'>
        <TabsList className='flex border-b border-[#2f303b]'>
          {/* <TabsTrigger
            value='chats'
            className='data-[state=active]:bg-transparent  text-opacity-90 border-b-2 w-full rounded-none data-[state=active]:text-[#0abde3] data-[state=active]:font-semibold data-[state=active]:border-b-[#0abde3] p-3 transition-all duration-300 flex-1 px-4 py-2 text-sm md:text-base font-medium text-[#e0e0e0] hover:bg-[#2f303b] rounded-t-md'>
            Chats
          </TabsTrigger>
          <TabsTrigger
            value='groups'
            className='data-[state=active]:bg-transparent  text-opacity-90 border-b-2 w-full rounded-none data-[state=active]:text-[#0abde3] data-[state=active]:font-semibold data-[state=active]:border-b-[#0abde3] p-3 transition-all duration-300 flex-1 px-4 py-2 text-sm md:text-base font-medium text-[#e0e0e0] hover:bg-[#2f303b] rounded-t-md'>
            Groups
          </TabsTrigger> */}
        </TabsList>
        <TabsContent
          value='chats'
          className='p-2 overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-[#3a3a3a] scrollbar-track-[#1b1c24] overflow-x-hidden'>
          <div className='flex items-center justify-between mb-4'>
            <span className='text-lg font-semibold text-[#e0e0e0] tracking-widest'>
              Chats
            </span>
            <NewMessage />
          </div>
          <ContactList contacts={directMessagesContacts} />
        </TabsContent>
        <TabsContent
          value='groups'
          className='p-2 overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-[#3a3a3a] scrollbar-track-[#1b1c24]'>
          <div className='flex items-center justify-between mb-4'>
            <span className='text-lg font-semibold text-[#e0e0e0] tracking-widest'>
              Groups
            </span>
            {/* <CreateGroup /> */}
          </div>
          {/* Add the groups list here */}
          {/* <ContactList contacts={groups} isgroup={true} /> */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactsContainer;
