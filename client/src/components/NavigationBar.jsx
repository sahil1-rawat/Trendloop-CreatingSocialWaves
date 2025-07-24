import React, { useState } from 'react';
import { AiFillDashboard, AiFillHome, AiOutlineDashboard, AiOutlineHome } from 'react-icons/ai';
import { BsCameraReels, BsCameraReelsFill } from 'react-icons/bs';
import { RiSearchLine, RiSearchFill } from 'react-icons/ri';
import {
  MdChatBubbleOutline,
  MdChatBubble,
  MdOutlineSlowMotionVideo,
  MdSlowMotionVideo,
  MdManageSearch,
  MdOutlineManageSearch,
} from 'react-icons/md';
import { RiAccountCircleFill, RiAccountCircleLine } from 'react-icons/ri';

import { Link, useNavigate } from 'react-router-dom';
import { usePostStore, useUserStore } from '../../store';

import { FaCirclePlus } from 'react-icons/fa6';
import { FiPlusCircle } from 'react-icons/fi';
import { PiVideo, PiVideoFill } from 'react-icons/pi';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FaUserCog, FaUsersCog } from 'react-icons/fa';

const NavigationBar = () => {
  const { tab, setTab } = usePostStore();
  const {usersData}=useUserStore();
  const navigate = useNavigate();
  return (
    <div className='fixed bottom-0 left-0 w-full bg-white py-3 z-50'>

      <div className='flex justify-evenly px-4'>
        {
usersData&& usersData.isAdmin?
        <Link
          to='/'
          onClick={() => setTab('/')}
          className='flex flex-col items-center text-2xl'>
          <span title='dashboard'>
            {tab === '/' ? (
              <AiFillDashboard color='#FF5733' size={30} />
            ) : (
              <AiOutlineDashboard size={30} />
            )}
          </span>
        </Link>
:        <Link
          to='/'
          onClick={() => setTab('/')}
          className='flex flex-col items-center text-2xl'>
          <span title='Home'>
            {tab === '/' ? (
              <AiFillHome color='#FF5733' size={30} />
            ) : (
              <AiOutlineHome size={30} />
            )}
          </span>
        </Link>
        }

{
          usersData && usersData.isAdmin ? 
                  <Link
          to='/users'
          onClick={() => setTab('/users')}
          className='flex flex-col items-center text-2xl'>
          <span title='manage-users'>
            {tab === '/users' ? (
              <FaUsersCog color='#FF5733' size={30} />
            ) : (
              <FaUserCog size={30} />
            )}
          </span>
        </Link>
          :         <Link
          to='/reels'
          onClick={() => setTab('/reels')}
          className='flex flex-col items-center text-2xl'>
          <span title='Reels'>
            {tab === '/reels' ? (
              <PiVideoFill color='#FF5733' size={30} />
            ) : (
              <PiVideo size={30} />
            )}
          </span>
        </Link>
}

        {/*  */}
        {
          usersData && usersData.isAdmin?  null:
          <DropdownMenu>
          <DropdownMenuTrigger>
            <span
              title='New Post'
              className='flex flex-col items-center text-2xl'>
              {tab === '/new-post' || tab === '/new-reel' ? (
                <FaCirclePlus color='#FF5733' size={30} />
              ) : (
                <FiPlusCircle size={30} />
              )}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                navigate('/new-post');
                setTab('/new-post');
              }}>
              Post
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigate('/new-reel');
                setTab('/new-reel');
              }}>
              Reel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        }
        
{
          usersData && usersData.isAdmin ?       <Link
          to='/manage-posts'
          onClick={() => setTab('/manage-posts')}
          className='flex flex-col items-center text-2xl'>
          <span title='manage-posts'>
            {tab === '/manage-posts' ? (
              <MdManageSearch color='#FF5733' size={30} />
            ) : (
              <MdOutlineManageSearch size={30} />
            )}
          </span>
        </Link>:
           <Link
          to='/chat'
          onClick={() => setTab('/chat')}
          className='flex flex-col items-center text-2xl'>
          <span title='Message'>
            {tab === '/chat' ? (
              <MdChatBubble color='#FF5733' size={30} />
            ) : (
              <MdChatBubbleOutline size={30} />
            )}
          </span>
        </Link>
}
       
        <Link
          to='/account'
          onClick={() => setTab('/account')}
          className='flex flex-col items-center text-2xl'>
          <span title='Profile'>
            {tab === '/account' ? (
              <RiAccountCircleFill color='#FF5733' size={30} />
            ) : (
              <RiAccountCircleLine size={30} />
            )}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default NavigationBar;
