import { apiClient } from '@/lib/api-client';
import { getColor } from '@/lib/utils';
import ToolTips from '@/pages/Extra/ToolTips.jsx';
import { useAppStore } from '@/store';
import { HOST, LOGOUT_ROUTE } from '@/utils/constants';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import React from 'react';
import { MdLogout, MdEdit } from 'react-icons/md';
import { HiOutlinePencil } from 'react-icons/hi';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserCircle } from 'react-icons/fa';

const ProfileInfo = () => {
  const {
    userInfo,
    setUserInfo,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
    setGroups,
    setDirectMessagesContacts,
  } = useAppStore();
  const navigate = useNavigate();
  const logOut = async () => {
    try {
      const res = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        navigate('/auth');
        setUserInfo(undefined);
        setSelectedChatData(undefined);
        setSelectedChatType(undefined);
        setSelectedChatMessages([]);
        setGroups([]);
        setDirectMessagesContacts([]);

        toast.success('Goodbye for now!');
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className='absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]'>
      <div className='flex gap-3 items-center justify-center'>
        <Avatar className='w-16 h-16 rounded-full overflow-hidden flex items-center'>
          {userInfo.image ? (
            <AvatarImage
              src={`${HOST}/${userInfo.image}`}
              alt='profile'
              className='object-cover w-10 h-10 rounded-full bg-black'
            />
          ) : (
            <div className={` w-10 h-10`}>
              <FaUserCircle
                className={`${getColor(
                  userInfo.color
                )} h-full w-full rounded-full`}
              />
            </div>
          )}
        </Avatar>
        <div className='text-[13px] lg:text-md font-serif font-semibold line-clamp-2'>
          {userInfo.fullName ? `${userInfo.fullName}` : ''}
        </div>
      </div>
      <div className='flex gap-5 '>
        <ToolTips
          icon={
            <HiOutlinePencil
              className='text-[#0abde3] text-xl '
              onClick={() => {
                navigate('/profile');
              }}
            />
          }
          content='Edit Profile'
        />
        <ToolTips
          icon={<MdLogout className='text-red-500 text-xl' onClick={logOut} />}
          content='Logout'
        />
      </div>
    </div>
  );
};
export default ProfileInfo;
