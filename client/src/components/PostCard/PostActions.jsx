import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { BsChatFill, BsShareFill } from 'react-icons/bs';
import { useUserStore } from '../../../store';
import axios from 'axios';

import LikesData from './LikesData';

const PostActions = ({ value, showComments }) => {
  const [isLike, setIsLike] = useState(false);
  const { usersData } = useUserStore();
  const [totalLikes, setTotalLikes] = useState(value.likes.length);

  // Check if the post is liked by the user
  useEffect(() => {
    setIsLike(value.likes.includes(usersData._id));
  }, [value.likes, usersData._id]);

  // Like/Unlike a post
  const likeUnlikePost = async () => {
    try {
      const res = await axios.post(`/api/post/likeunlike/${value._id}`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setIsLike(!isLike);
        setTotalLikes(res.data.totalLikes);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Share button handler
  const sharePost = () => {
    navigator.share
      ? navigator.share({
          title: 'Check out this post!',
          url: window.location.href,
        })
      : alert('Share API is not supported in your browser.');
  };

  return (
    <div className='flex items-center justify-between px-6 py-1 border-t border-gray-200 bg-white shadow-sm rounded-lg'>
      {/* Like Section */}
      <div className='flex flex-col items-center'>
        <button
          onClick={likeUnlikePost}
          title={isLike ? 'Unlike' : 'Like'}
          className={`flex items-center justify-center w-12 h-12 rounded-full transition ${
            isLike
              ? 'bg-red-100 text-red-500 hover:bg-red-200'
              : ' hover:bg-gray-200 text-gray-600'
          }`}>
          {isLike ? (
            <FaHeart className='text-2xl' />
          ) : (
            <FaRegHeart className='text-2xl' />
          )}
        </button>
        <LikesData value={value} totalLikes={totalLikes} />
      </div>

      {/* Comments Section */}
      <div className='flex flex-col items-center'>
        <button
          className='flex items-center justify-center w-12 h-12 rounded-full  hover:bg-gray-200 text-gray-600 transition'
          onClick={showComments}>
          <BsChatFill className='text-2xl' />
        </button>
        <span className='mt-1 text-sm text-gray-500 font-medium'>
          {value.comments.length}{' '}
          {value.comments.length <= 1 ? 'Comment' : 'Comments'}
        </span>
      </div>

      {/* Share Section */}
      <div className='flex flex-col items-center'>
        <button
          onClick={sharePost}
          className='flex items-center justify-center w-12 h-12 rounded-full  hover:bg-gray-200 text-blue-500 transition'>
          <BsShareFill className='text-2xl' />
        </button>
        <span className='mt-1 text-sm text-blue-500 font-medium'>Share</span>
      </div>
    </div>
  );
};

export default PostActions;
