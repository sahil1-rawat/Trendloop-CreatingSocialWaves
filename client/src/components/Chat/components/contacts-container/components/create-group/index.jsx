import React, { useEffect, useRef, useState } from 'react';
import {
  FaSadCry,
  FaSadTear,
  FaSearch,
  FaTimes,
  FaUserCircle,
  FaUsers,
} from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import ToolTips from '@/pages/Extra/ToolTips';
import { apiClient } from '@/lib/api-client';
import {
  CREATE_GROUP_ROUTE,
  GET__ALL_CONTACTS_ROUTE,
  HOST,
  SEARCH_CONTACTS_ROUTE,
} from '@/utils/constants';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { useAppStore } from '@/store';
import { BsChatDots, BsPlus } from 'react-icons/bs';
import { getColor } from '@/lib/utils';
import { Button } from '@headlessui/react';
import MultipleSelector from '@/components/ui/multipleselect.jsx';
import { toast } from 'react-toastify';

const CreateGroup = () => {
  const { setSelectedChatType, setSelectedChatData, addGroup } = useAppStore();
  const [newGroupModel, setNewGroupModel] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [groupName, setGroupName] = useState('');
  const DialogRef = useRef();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await apiClient.get(GET__ALL_CONTACTS_ROUTE, {
          withCredentials: true,
        });
        setAllContacts(res.data.contacts);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (DialogRef.current && !DialogRef.current.contains(event.target)) {
        setNewGroupModel(false);
        setGroupName('');
        clearAll();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDialogOpenChange = (isOpen) => {
    if (!isOpen) {
      setGroupName('');
    }
    setNewGroupModel(isOpen);
  };

  const clearAll = () => {
    setGroupName('');
    setSelectedContacts([]);
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setGroupName(value);
  };

  const createGroup = async () => {
    // Implement create group logic
    try {
      if (groupName.length > 2 && selectedContacts.length > 0) {
        const res = await apiClient.post(
          CREATE_GROUP_ROUTE,
          {
            name: groupName,
            members: selectedContacts.map((contact) => contact.value),
          },
          {
            withCredentials: true,
          }
        );
        if (res.status === 201) {
          setGroupName('');
          setSelectedContacts([]);
          setNewGroupModel(false);
          addGroup(res.data.group);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <ToolTips
        icon={
          <div
            className='relative'
            onClick={() => handleDialogOpenChange(true)}>
            <FaUsers className='text-2xl text-[#3498db]' />
            <BsPlus className='absolute text-sm text-white -top-1 -right-1 bg-[#3498db] rounded-full' />
          </div>
        }
        content='Create a New Group'
      />
      <Dialog open={newGroupModel} onOpenChange={handleDialogOpenChange}>
        <DialogContent
          className='bg-white text-black w-full max-w-[500px] h-full max-h-[90%] flex flex-col p-4 md:p-6 rounded-lg shadow-lg'
          ref={DialogRef}
          style={{ overflow: 'hidden' }}>
          <DialogHeader>
            <DialogTitle className='text-lg md:text-xl font-semibold'>
              Create New Group
            </DialogTitle>
            <DialogDescription className='text-sm md:text-base'>
              Add group details and select contacts.
            </DialogDescription>
          </DialogHeader>
          <div className='relative mb-4'>
            <Input
              placeholder='Group Name'
              className='w-full rounded-lg p-2 md:p-3 pr-10 bg-gray-200 border border-gray-300'
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            {groupName ? (
              <FaTimes
                className='absolute top-3 right-3 text-gray-600 cursor-pointer'
                onClick={clearAll}
                aria-label='Clear search'
              />
            ) : (
              <FaSearch
                className='absolute top-3 right-3 text-gray-600 cursor-pointer'
                aria-label='Search'
              />
            )}
          </div>
          <div className='flex-1 mb-4 '>
            <ScrollArea className='h-[320px] md:h-[370px] w-full rounded-lg overflow-hidden'>
              <MultipleSelector
                className='w-full rounded-lg py-2 bg-gray-200 text-black overflow-hidden'
                defaultOptions={allContacts}
                placeholder='Search Contacts'
                value={selectedContacts}
                onChange={setSelectedContacts}
                maxSelected={19}
                onMaxSelected={(currentCount) => {
                  toast.dismiss();
                  toast.warning('Add only maximum 20 members in a group');
                }}
                emptyIndicator={
                  <p className='text-center text-gray-600'>
                    No contacts found. Please add contacts to your list.
                  </p>
                }
              />
            </ScrollArea>
          </div>
          <div className='mt-auto'>
            <Button
              onClick={createGroup}
              className='w-full bg-[#3498db] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-[#3498dbcf] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'>
              Create Group
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateGroup;
