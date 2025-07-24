import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import {
  RiCloseFill,
  RiMessageFill,
  RiMore2Fill,
  RiPhoneFill,
  RiVideoFill,
} from 'react-icons/ri';
import { IoCallOutline, IoVideocamOutline } from 'react-icons/io5';
import { FaUserCircle, FaUserFriends } from 'react-icons/fa';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from "@/components/ui/button"
import { useChatStore, useUserStore } from '../../../../../../../store';
import { Link } from 'react-router-dom';

const ChatHeader = () => {
  const {
    closeChat,
    selectedChatData,
    selectedChatType,
    onlineStatuses,
  } = useChatStore();
  const{ usersData}=useUserStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
      setIsEditingGroup(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownItemClick = (action, event) => {
    event.stopPropagation();
    if (action === 'View Profile') {
      setDropdownOpen(false); // Close dropdown
      setSheetOpen(true); // Open sheet
    } else {
      //console.log(`${action} clicked`);

      setDropdownOpen(false);
    }
  };

  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [name, setName] = useState(selectedChatData.name || '');
  const [description, setDescription] = useState(
    selectedChatData.description || ''
  );
  const [isChanged, setIsChanged] = useState(false);
  const { _id } = selectedChatData;



  // const handleSaveGroup = async () => {
  //   try {
  //     const res = await apiClient.patch(
  //       `${EDIT_GROUT_INFO_ROUTE}/${_id}`,
  //       {
  //         name,
  //         description,
  //       },
  //       { withCredentials: true }
  //     );

  //     if (res.status === 200 && res.data) {
  //       const updatedGroup = res.data;

  //       useAppStore.setState((state) => ({
  //         selectedChatData: {
  //           ...state.selectedChatData,
  //           name: updatedGroup.name,
  //           description: updatedGroup.description,
  //         },
  //       }));
  //       useAppStore.setState((state) => ({
  //         groups: state.groups.map((group) => {
  //           if (group._id === _id) {
  //             return {
  //               ...group,
  //               name: updatedGroup.name,
  //               description: updatedGroup.description,
  //             };
  //           }
  //           // Otherwise, return the group unchanged
  //           return group;
  //         }),
  //       }));
  //       setIsEditingGroup(false);
  //     }
  //   } catch (err) {
  //     //console.log(err);
  //   }
  //   // Handle group save logic
  // };
  const handleCancel = () => {
    setIsEditingGroup(false);
    setName(selectedChatData.name);
    setDescription(selectedChatData.description);
  };
  const handleAddPeople = () => {
    // Handle add people logic
  };

  const handleExitGroup = () => {
    // Handle exit group logic
  };
//console.log(selectedChatData)
  
  return (
    <div className='h-[10vh] min-h-[60px] border-b-2 border-[#2f303b] flex items-center justify-between px-4 sm:px-20 shadow-md relative'>
      <div className='flex gap-3 sm:gap-5 items-center w-full justify-between'>
        <div className='flex gap-3 items-center'>
          <div className='w-10 h-10 sm:w-12 sm:h-12 relative'>
            {selectedChatType === 'contact' ? (
              <Avatar className='w-full h-full rounded-full overflow-hidden flex items-center justify-center '>
                {selectedChatData.profilePic.url ? (
                  <AvatarImage
                    src={`${selectedChatData.profilePic.url}`}
                    alt='profile'
                    className='object-cover rounded-full bg-black w-[40px] h-[40px]'
                  />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center  `}>
                    <FaUserCircle
                      className={`bg-red-500 rounded-full w-[40px] h-[40px] `}
                    />
                  </div>
                )}
                {/* {onlineStatuses[selectedChatData._id] === true ? (
                  <span className='absolute right-0.5 bottom-2  inline-block w-2 h-2 bg-green-500 rounded-full border-2 border-black'></span>
                ) : (
                  <span className='absolute right-0.5 bottom-2 inline-block w-2 h-2 bg-gray-700 rounded-full border-2 border-black'></span>
                )} */}
              </Avatar>
            ) : (
              <Avatar className='w-full h-full rounded-full overflow-hidden'>
                <div
                  className={` w-full h-full flex items-center justify-center`}>
                  <FaUserFriends
                    className={`rounded-full bg-[#aaa6d0] text-black/50 border-[1px] border-[#bbb7e4] w-[40px] h-[40px]`}
                  />
                </div>
              </Avatar>
            )}
          </div>
          <Link to={`${`/user/${selectedChatData._id}`}`}
                className='text-gray-700 font-semibold text-md hover:underline'
                onClick={() =>
                  usersData._id === selectedChatData._id
                    ? setTab('/account')
                    : setTab(`user/${selectedChatData._id}`)
                }>
          <div className='text-white font-bold text-sm sm:text-base line-clamp-1'>
            {selectedChatType === 'contact'
              ? selectedChatData.name
                ? selectedChatData.name
                : selectedChatData.email
              : selectedChatData.name}
          </div>
          </Link>
        </div>
        <div className='flex items-center gap-2 sm:gap-5'>
          {/* <button
            className='text-2xl sm:text-3xl text-neutral-500 hover:text-white transition-all'
            title='Video Call'>
            <IoVideocamOutline />
          </button>
          <button
            className='text-2xl sm:text-3xl text-neutral-500 hover:text-white transition-all'
            title='Voice Call'>
            <IoCallOutline />
          </button> */}
          <button
            className='text-2xl sm:text-3xl text-neutral-500 hover:text-white transition-all'
            onClick={toggleDropdown}
            title='More Options'>
            <RiMore2Fill />
          </button>
          {dropdownOpen && (
            <div
              className='absolute right-0 mt-2 bg-[#2a2b33] rounded-md shadow-lg border border-[#3a3b43] z-10 max-h-60'
              ref={dropdownRef}
              style={{ top: '90%' }}>
              <ul className='list-none p-2'>
                
                {/* <li
                  className='px-4 py-2 text-white hover:bg-[#3a3b43] cursor-pointer transition-colors'
                  onClick={(event) =>
                    handleDropdownItemClick('Clear Chat', event)
                  }>
                  Clear Chat
                </li> */}
                {selectedChatData === 'contact' && (
                  <li
                    className='px-4 py-2 text-white hover:bg-[#3a3b43] cursor-pointer transition-colors'
                    onClick={(event) =>
                      handleDropdownItemClick('Block Contact', event)
                    }>
                    Block Contact
                  </li>
                )}

                <li
                  className='px-4 py-2 text-white hover:bg-[#3a3b43] cursor-pointer transition-colors'
                  onClick={closeChat}>
                  Close Chat
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

            
    </div>
  );
};

export default ChatHeader;
