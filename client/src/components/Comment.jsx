import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiFillDelete } from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';
import { usePostStore, useUserStore } from '../../store';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { fetchPosts, sharePost } from '../utills/FetchPost';

export const Comment = ({
  value,
  postOwner,
  postId,
  setType,
  setValue,
  params,
}) => {
  console.log(value.replies);

  const { setPosts, setReels, setTab } = usePostStore();
  const { usersData, setIsLoading, isAuth } = useUserStore();

  const [newComment, setNewComment] = useState(value.comment);
  const [minutes, setMinutes] = useState(0);
  const [editedCommentId, setEditedCommentId] = useState(null);
  const [replyText, setReplyText] = useState(''); // State to hold reply text
  const [showReplyInput, setShowReplyInput] = useState(false); // Toggle for showing reply input

  const commentId = value._id;
  const profilePicUrl = value?.user?.profilePic?.url || value?.profilePic;
  const userName = value?.user?.name || value?.name;
  const userId = value?.user?._id || '';

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

  const handleReply = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/post/reply/${postId}`, {
        commentId: value._id,
        replyComment: replyText,
        withCredentials: true,
      });
      if (res.status === 201) {
        setReplyText(''); // Clear reply input
        setShowReplyInput(false); // Close the reply input after submission
        fetchPosts({ setPosts, setReels, setIsLoading, isAuth }); // Refresh posts
      }
    } catch (err) {
      toast.error('Failed to reply');
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
        fetchPosts({ setPosts, setReels, setIsLoading, isAuth });
        toast.success(res.data.message);
        if (setValue && setType && params)
          sharePost({ setValue, setType, params });
        setEditedCommentId(null);
      }
    } catch (err) {
      toast.error('Something went wrong');
      setEditedCommentId(null);
    }
  };

  const deleteComment = async () => {
    try {
      const res = await axios.delete(`/api/post/comment/${postId}`, {
        data: { commentId },
        withCredentials: true,
      });
      if (res.status === 200) {
        setTimeout(() => {
          fetchPosts({ setPosts, setReels, setIsLoading, isAuth });
          if (setValue && setType && params)
            sharePost({ setValue, setType, params });

          toast.success(res.data.message);
        }, 500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='flex items-start space-x-3 mt-3 mb-4 p-3 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200'>
      {/* Profile Picture */}
      <Link to={userId ? `/user/${userId}` : '/profile'}>
        <img
          src={profilePicUrl}
          alt={`${userName}'s profile`}
          title='View Profile'
          className='w-10 h-10 rounded-full border border-gray-300 hover:ring-2 hover:ring-gray-400 transition-transform duration-200'
        />
      </Link>

      <div className='flex-1'>
        {/* User Name */}
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

        {/* Editable Comment */}
        {editedCommentId === commentId ? (
          <div className='flex flex-col space-y-2 mt-2'>
            <textarea
              className='w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
              placeholder='Edit your comment...'
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows='2'
              style={{ minHeight: '50px' }}
            />
            <div className='flex justify-end space-x-4'>
              <button
                onClick={() => {
                  setEditedCommentId(null);
                  setNewComment(value.comment);
                }}
                className='px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200'>
                Cancel
              </button>
              <button
                onClick={editOldComment}
                className={`px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${
                  newComment.trim() === value.comment || !newComment.trim()
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer '
                }`}
                disabled={
                  newComment.trim() === value.comment || !newComment.trim()
                }>
                Save
              </button>
            </div>
          </div>
        ) : (
          // Displaying Comment Text
          <div className='flex flex-col'>
            <p className='text-gray-900 text-sm bg-gray-100 px-4 py-2 rounded-2xl shadow-sm border border-gray-200 w-full break-words leading-relaxed hover:bg-gray-200 transition duration-200'>
              {value.comment}
            </p>
          </div>
        )}

        {/* Time Ago */}
        <span className='text-xs text-gray-500 mt-1'>
          {minutes > 0 ? `${minutes}m ago` : 'Just now'}
        </span>

        {/* Like, Comment, Reply Actions */}
        <div className='flex items-center space-x-4 text-xs text-gray-500 mt-2'>
          <button className='flex items-center space-x-1 hover:text-blue-500'>
            <span>👍</span> {/* Like Icon */}
            <span>{value.likes?.length || 0} Likes</span>
          </button>

          <button
            className='flex items-center space-x-1 hover:text-blue-500'
            onClick={() => setShowReplyInput(!showReplyInput)} // Toggle reply input
          >
            <span>↩️</span> {/* Reply Icon */}
            <span>Reply</span>
          </button>
        </div>

        {/* Reply Input */}
        {showReplyInput && (
          <form onSubmit={handleReply} className='mt-2'>
            <textarea
              className='w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
              placeholder='Write a reply...'
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows='2'
              style={{ minHeight: '50px' }}
            />
            <div className='flex justify-end space-x-4 mt-2'>
              <button
                type='button'
                onClick={() => setShowReplyInput(false)}
                className='px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200'>
                Cancel
              </button>
              <button
                type='submit'
                className={`px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${
                  !replyText.trim()
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer'
                }`}
                disabled={!replyText.trim()}>
                Reply
              </button>
            </div>
          </form>
        )}

        {/* Displaying Replies */}
        {value.replies && value.replies.length > 0 && (
          <div className='ml-6 mt-4'>
            {value.replies.map((reply, index) => (
              <div>
                <div key={index} className='flex items-start space-x-3 mt-3'>
                  {/* Profile Picture for Reply */}
                  <Link to={`/user/${reply.user}`}>
                    <img
                      src={reply.profilePic || 'default-pic.jpg'}
                      alt={`${reply.user.name}'s profile`}
                      className='w-8 h-8 rounded-full border border-gray-300'
                    />
                  </Link>

                  {/* Reply Text */}
                  <div className='flex-1'>
                    <p className='text-gray-900 font-medium text-sm'>
                      {reply.name}
                    </p>
                    <p className='text-gray-800 text-sm'>{reply.comment}</p>
                  </div>
                </div>
                <div className='flex items-center space-x-4 text-xs text-gray-500 mt-2'>
                  <button className='flex items-center space-x-1 hover:text-blue-500'>
                    <span>👍</span> {/* Like Icon */}
                    <span>{value.likes?.length || 0} Likes</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dropdown for actions */}
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
              <DropdownMenuItem onClick={() => setEditedCommentId(commentId)}>
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
