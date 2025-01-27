import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiFillDelete } from 'react-icons/ai';
import { usePostStore, useUserStore } from '../../store';
import toast from 'react-hot-toast';
import axios from 'axios';

import { BsThreeDots } from 'react-icons/bs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { fetchPosts } from '../utills/FetchPost';

export const Comment = ({
  value,
  postOwner,
  postId,
  Click,
  isEdited,
  setIsEdited,
}) => {
  const { setPosts, setReels, setTab } = usePostStore();
  const { usersData, setIsLoading } = useUserStore();
  const commentId = value._id;

  const profilePicUrl = value?.user?.profilePic?.url || value?.profilePic;
  const userName = value?.user?.name || value?.name;
  const userId = value?.user?._id || '';

  const [newComment, setNewComment] = useState(value.comment);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    const formatTime = new Date(value.createdAt);
    const now = new Date();
    setMinutes(Math.floor((now - formatTime) / (1000 * 60)));

    const interval = setInterval(() => {
      const diff = new Date() - formatTime;
      setMinutes(Math.floor(diff / (1000 * 60)));
    }, 60000);

    return () => clearInterval(interval);
  }, [value.createdAt]);

  const deleteComment = async () => {
    try {
      const res = await axios.delete(`/api/post/comment/${postId}`, {
        data: { commentId },
        withCredentials: true,
      });
      if (res.status === 200) {
        fetchPosts({ setPosts, setReels, setIsLoading });
        toast.success(res.data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const editOldComment = async () => {
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const res = await axios.put(`/api/post/comment/${postId}`, {
        commentId: value._id,
        newComment,
        withCredentials: true,
      });
      if (res.status === 200) {
        fetchPosts({ setPosts, setReels, setIsLoading });
        toast.success(res.data.message);
        setIsEdited(false);
      }
    } catch (err) {
      toast.error('Something went wrong');
      setIsEdited(false);
    }
  };

  return (
    <div className='flex items-start space-x-4 mt-3 mb-4 p-3 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200'>
      <Link to={userId ? `/user/${userId}` : '/profile'} target='_blank'>
        <img
          src={profilePicUrl}
          alt={`${userName}'s profile`}
          title='View Profile'
          className='w-12 h-12 rounded-full border border-gray-300 hover:ring-2 hover:ring-gray-400 transition-transform duration-200'
        />
      </Link>

      <div className='flex-1'>
        <Link
          to={`/user/${userId}`}
          className='text-gray-900 font-medium text-sm hover:underline'
          onClick={() =>
            usersData._id === userId
              ? setTab('/account')
              : setTab(`user/${userId}`)
          }>
          {userName}
        </Link>
        {isEdited ? (
          <div className='flex items-center space-x-2 mt-2'>
            <input
              type='text'
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className='flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200'
              placeholder='Edit your comment...'
            />
            <button
              onClick={editOldComment}
              className='px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200'>
              Save
            </button>
          </div>
        ) : (
          <p className='text-gray-700 text-sm mt-1'>{value.comment}</p>
        )}
      </div>

      {(value.user?._id === usersData?._id ||
        postOwner?._id === usersData?._id) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className='text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors duration-150'>
              <BsThreeDots size={20} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {value.user?._id === usersData?._id && minutes < 2 && (
              <DropdownMenuItem onClick={() => setIsEdited(true)}>
                Edit
              </DropdownMenuItem>
            )}
            {(value.user?._id === usersData?._id ||
              postOwner?._id === usersData?._id) && (
              <DropdownMenuItem onClick={deleteComment}>
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
