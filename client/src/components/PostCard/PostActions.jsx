import React, { useEffect, useRef, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { BsChatFill, BsShareFill } from 'react-icons/bs';
import { usePostStore, useUserStore } from '../../../store';
import axios from 'axios';
import {
  fetchPosts,
  sharePost as updateSharePost,
} from '../../utills/FetchPost';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import LikesData from './LikesData';
import { Comment } from '../Comment';
import toast from 'react-hot-toast';
import { BASE_URL } from '../../../common';

const PostActions = ({ value, showComments, setValue }) => {
  const { setPosts, setReels, myCommentId } = usePostStore();
  const { usersData, setIsLoading, addLoading, setAddLoading, isAuth } =
    useUserStore();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [totalLikes, setTotalLikes] = useState(value.likes.length);
  const [comment, setNewComment] = useState('');
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    if (value.likes && usersData._id)
      setIsLike(value.likes.includes(usersData._id));
  }, [value, usersData._id]);

  const likeUnlikePost = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_SOCKET_URL}/api/post/likeunlike/${value._id}`,
        {},
        {
        withCredentials: true,


      });

      if (res.status === 200) {
        setIsLike(!isLike);
        setTotalLikes(res.data.totalLikes);
        if (setValue) {
          setValue((prevValue) => ({
            ...prevValue,
            likes: !isLike
              ? [...prevValue.likes, usersData._id]
              : prevValue.likes.filter((id) => id !== usersData._id),
          }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleReply = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SOCKET_URL}/api/post/reply/${value._id}`,
        {
          commentId: myCommentId,
          replyComment: comment,
        },
        {
          withCredentials: true,
        }
      );
      if (res.status === 201) {
        setShowReplyInput(false); // Close the reply input after submission
        setAddLoading(false);
        fetchPosts({ setPosts, setReels, setIsLoading, isAuth });
        setNewComment('');
      }
    } catch (err) {
      toast.error('Failed to reply');
      //console.log(err);
    }
  };
  const handleAddComment = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_SOCKET_URL}/api/post/comment/${value._id}`, {
        comment,
      },{
        withCredentials: true,

      });
      console.log(res);
      if (res.status === 201) {
        setTimeout(() => {
          setAddLoading(false);
          fetchPosts({ setPosts, setReels, setIsLoading, isAuth });
          setNewComment('');
        }, 500);
      }
    } catch (err) {
      console.log(err)
      setTimeout(() => {
        setAddLoading(false);
        toast.error(err.response.data.message);
      }, 500);
    }
  };

  const sharePost = () => {
    navigator.share
      ? navigator.share({
          title: 'Check out this post!',
          url: `/post/${value._id}`,
        })
      : alert('Share API is not supported in your browser.');
  };
  const textareaRef = useRef(null);
  useEffect(() => {
    if (showReplyInput && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [showReplyInput]);
  return (
    <div className='flex items-center justify-between px-6 py-2 border-t border-gray-200 bg-white shadow-sm rounded-lg'>
      {/* Like Section */}
      <div className='flex flex-col items-center'>
        <button
          onClick={likeUnlikePost}
          title={isLike ? 'Unlike' : 'Like'}
          className={`flex items-center justify-center w-12 h-12 rounded-full transition duration-200 shadow-sm ${
            isLike
              ? 'bg-red-100 text-red-500 hover:bg-red-200'
              : 'hover:bg-gray-200 text-gray-600'
          }`}>
          {isLike ? (
            <FaHeart className='text-2xl' />
          ) : (
            <FaRegHeart className='text-2xl' />
          )}
        </button>
        <span className='text-sm text-gray-600 font-medium'>
          {totalLikes} Likes
        </span>
      </div>

      {/* Comment Section */}
      <div className='flex flex-col items-center '>
        <Dialog>
          <DialogTrigger asChild>
            <button className='flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-200 text-gray-600 transition duration-200 shadow-sm'>
              <BsChatFill className='text-2xl' />
            </button>
          </DialogTrigger>

          {/* Comment Modal */}
          <DialogContent className='max-w-lg w-full rounded-lg shadow-lg border border-gray-200 bg-gray-200'>
            {/* Header */}
            <DialogHeader>
              <DialogTitle className='text-gray-800 font-semibold text-center text-lg'>
                Comments
              </DialogTitle>
            </DialogHeader>

            {/* Comments List */}
            <div className='px-4'>
              <hr className='mt-2 mb-2 border-gray-300' />
              <div className='mt-4 max-h-60 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
                {value.comments && value.comments.length > 0 ? (
                  value.comments.map((comment, index) => (
                    <Comment
                      key={index}
                      value={comment}
                      postOwner={value.owner}
                      postId={value._id}
                      showReplyInput={showReplyInput}
                      setShowReplyInput={setShowReplyInput}
                    />
                  ))
                ) : (
                  <div className='flex flex-col items-center justify-center mt-3 mb-4 p-5rounded-lg   transition-shadow duration-200'>
                    <svg
                      className='w-12 h-12 text-gray-300 mb-2'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 20 20'
                      fill='currentColor'>
                      <path
                        fillRule='evenodd'
                        d='M10 3a7 7 0 00-7 7 7 7 0 001.97 4.82A1 1 0 015 16v3l3-1.5a9.73 9.73 0 004 .5 7 7 0 000-14zm-5 7a5 5 0 119 3.25c-.74.31-1.51.5-2.3.56A1 1 0 0110 15H6.83A5 5 0 015 10z'
                        clipRule='evenodd'
                      />
                    </svg>

                    {/* No Comments Message */}
                    <p className='text-gray-600 text-sm font-medium text-center'>
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Comment Input */}
            <DialogFooter className='border-t  px-4 py-3 '>
              <form className='flex items-center gap-3 w-full'>
                <textarea
                  className='w-full flex-1 border  rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all duration-200 bg-white placeholder-gray-400'
                  placeholder='Write a comment...'
                  value={comment}
                  ref={textareaRef}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows='2'
                />
                <button
                  type='submit'
                  className={`bg-blue-500 text-white rounded-lg px-6 py-2 font-medium hover:bg-blue-600 transition duration-200 ${
                    !comment.trim()
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-pointer'
                  }`}
                  onClick={showReplyInput ? handleReply : handleAddComment}
                  disabled={!comment.trim()}>
                  Comment
                </button>
              </form>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Comment Count */}
        <span className='mt-1 text-sm text-gray-500 font-medium'>
          {value.comments.length}{' '}
          {value.comments.length === 1 ? 'Comment' : 'Comments'}
        </span>
      </div>

      {/* Share Section */}
      <div className='flex flex-col items-center'>
        <button
          onClick={sharePost}
          className='flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-200 text-blue-500 transition duration-200 shadow-sm'>
          <BsShareFill className='text-2xl' />
        </button>
        <span className='mt-1 text-sm text-blue-500 font-medium'>Share</span>
      </div>
    </div>
  );
};

export default PostActions;
