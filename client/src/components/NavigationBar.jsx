import React, { useState } from 'react';
import { AiFillHome, AiOutlineHome } from 'react-icons/ai';
import { BsCameraReels, BsCameraReelsFill } from 'react-icons/bs';
import {
  RiSearchLine,
  RiSearchFill,
  RiAddBoxFill,
  RiAddBoxLine,
} from 'react-icons/ri';
import { MdChatBubbleOutline, MdChatBubble } from 'react-icons/md';
import { RiAccountCircleFill, RiAccountCircleLine } from 'react-icons/ri';

import { Link } from 'react-router-dom';
import { usePostStore } from '../../store';

import { FaCirclePlus } from 'react-icons/fa6';
import { FiPlusCircle } from 'react-icons/fi';

import Addpost from './AddPost';
import { VisuallyHidden } from './../utills/VisuallyHidden';

const NavigationBar = () => {
  const { tab, setTab } = usePostStore();

  return (
    <div className='fixed bottom-0 left-0 w-full bg-white py-3 z-50'>
      <div className='flex justify-evenly px-4'>
        <Link
          to='/'
          onClick={() => setTab('/')}
          className='flex flex-col items-center text-2xl'>
          <span title='Posts'>
            {tab === '/' ? <AiFillHome /> : <AiOutlineHome />}
          </span>
        </Link>
        <Link
          to='/reels'
          onClick={() => setTab('/reels')}
          className='flex flex-col items-center text-2xl'>
          <span title='Reels'>
            {tab === '/reels' ? <BsCameraReelsFill /> : <BsCameraReels />}
          </span>
        </Link>

        <Link
          to='/search'
          onClick={() => setTab('/search')}
          className='flex flex-col items-center text-2xl'>
          <span title='Search'>
            {tab === '/search' ? <RiSearchFill /> : <RiSearchLine />}
          </span>
        </Link>
        <Link
          to='/new-post'
          onClick={() => setTab('/new-post')}
          className='flex flex-col items-center text-2xl'>
          <span title='New Post'>
            {tab === '/new-post' ? <FaCirclePlus /> : <FiPlusCircle />}
          </span>
        </Link>

        <Link
          to='/chat'
          onClick={() => setTab('/chat')}
          className='flex flex-col items-center text-2xl'>
          <span title='Message'>
            {tab === '/chat' ? <MdChatBubble /> : <MdChatBubbleOutline />}
          </span>
        </Link>
        <Link
          to='/account'
          onClick={() => setTab('/account')}
          className='flex flex-col items-center text-2xl'>
          <span title='Profile'>
            {tab === '/account' ? (
              <RiAccountCircleFill />
            ) : (
              <RiAccountCircleLine />
            )}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default NavigationBar;
