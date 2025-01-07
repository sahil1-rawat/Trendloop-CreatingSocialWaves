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

const NavigationBar = () => {
  const [tab, setTab] = useState(window.location.pathname);

  return (
    <div className='fixed bottom-0 w-full bg-white py-3'>
      <div className='flex justify-around'>
        <Link
          to='/'
          onClick={() => setTab('/')}
          className='flex flex-col items-center text-2xl'>
          <span>{tab === '/' ? <AiFillHome /> : <AiOutlineHome />}</span>
        </Link>
        <Link
          to='/reels'
          onClick={() => setTab('/reels')}
          className='flex flex-col items-center text-2xl'>
          <span>
            {tab === '/reels' ? <BsCameraReelsFill /> : <BsCameraReels />}
          </span>
        </Link>

        <Link
          to='/search'
          onClick={() => setTab('/search')}
          className='flex flex-col items-center text-2xl'>
          <span>{tab === '/search' ? <RiSearchFill /> : <RiSearchLine />}</span>
        </Link>
        <Link
          to='/chat'
          onClick={() => setTab('/chat')}
          className='flex flex-col items-center text-2xl'>
          <span>
            {tab === '/chat' ? <MdChatBubble /> : <MdChatBubbleOutline />}
          </span>
        </Link>
        <Link
          to='/account'
          onClick={() => setTab('/account')}
          className='flex flex-col items-center text-2xl'>
          <span>
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
