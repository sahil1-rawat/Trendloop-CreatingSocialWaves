import { Link } from 'react-router-dom';
import { AiFillDelete } from 'react-icons/ai';
import { usePostStore, useUserStore } from '../../store';
import toast from 'react-hot-toast';
import axios from 'axios';
import { fetchPosts } from '../utills/FetchPost';
import { BsThreeDots } from 'react-icons/bs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

export const Comment = ({
  value,
  postOwner,
  postId,
  Click,
  isEdited,
  setIsEdited,
}) => {
  const { setPosts, setReels } = usePostStore();

  const { usersData, setIsLoading } = useUserStore();
  const commentId = value._id;

  const profilePicUrl = value?.user?.profilePic?.url || value?.profilePic;
  const userName = value?.user?.name || value?.name;
  const userId = value?.user?._id || '';
  const deleteComment = async () => {
    try {
      const res = await axios.delete(`/api/post/comment/${postId}`, {
        data: { commentId },
        withCredentials: true,
      });

      if (res.status === 200) {
        fetchPosts({ setPosts, setReels, setIsLoading });

        toast.dismiss();
        toast.success(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [newComment, setNewComment] = useState('');

  const editOldComment = async () => {
    try {
      const res = await axios.put(`/api/post/comment/${postId}`, {
        commentId: value._id,
        newComment,
        withCredentials: true,
      });
      if (res.status === 200) {
        fetchPosts({ setPosts, setReels, setIsLoading });
        toast.dismiss();
        toast.success(res.data.message);
        setIsEdited(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className='flex items-start space-x-4 mt-3 mb-4 p-3 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200'>
      <Link to={profilePicUrl} target='_blank'>
        <img
          src={profilePicUrl}
          alt={`${userName}'s profile`}
          title='View Profile'
          className='w-12 h-12 rounded-full border border-gray-300 hover:ring-2 hover:ring-gray-400 transition-transform duration-200'
        />
      </Link>

      <div className='flex-1'>
        <Link
          to={`${
            value.user._id === usersData._id ? '/account' : `/user/${userId}`
          }`}
          className='text-gray-900 font-medium text-sm hover:underline'>
          {userName}
        </Link>
        {isEdited ? (
          <>
            <input
              type='text'
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={editOldComment}>Edit</button>
          </>
        ) : (
          <p className='text-gray-700 text-sm mt-1'>{value.comment}</p>
        )}
      </div>
      {(value.user._id === usersData._id ||
        postOwner._id === usersData._id) && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className='text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors duration-150'>
              <BsThreeDots size={20} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {value.user._id === usersData._id && (
              <DropdownMenuItem onClick={Click}>Edit</DropdownMenuItem>
            )}
            {(value.user._id === usersData._id ||
              postOwner._id === usersData._id) && (
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
