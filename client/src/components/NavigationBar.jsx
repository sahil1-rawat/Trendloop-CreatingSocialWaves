import React, { useState } from 'react';
import { AiFillHome, AiOutlineHome } from 'react-icons/ai';
import { BsCameraReels, BsCameraReelsFill } from 'react-icons/bs';
import { RiSearchLine, RiSearchFill } from 'react-icons/ri';
import {
  MdChatBubbleOutline,
  MdChatBubble,
  MdOutlineSlowMotionVideo,
  MdSlowMotionVideo,
} from 'react-icons/md';
import { RiAccountCircleFill, RiAccountCircleLine } from 'react-icons/ri';

import { Link, useNavigate } from 'react-router-dom';
import { usePostStore } from '../../store';

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

const NavigationBar = () => {
  const { tab, setTab } = usePostStore();
  const navigate = useNavigate();
  return (
    <div className='fixed bottom-0 left-0 w-full bg-white py-3 z-50'>
      <div className='flex justify-evenly px-4'>
        <Link
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
        <Link
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

        {/*  */}
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
