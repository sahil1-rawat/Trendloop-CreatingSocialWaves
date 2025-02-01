import React, { useState } from 'react';
import axios from 'axios';
import { usePostStore, useUserStore } from '../../store';
import { Comment } from './Comment';
import { fetchPosts } from '../utills/FetchPost';
import PostHeader from './PostCard/PostHeader';
import PostMedia from './PostCard/PostMedia';
import PostActions from './PostCard/PostActions';

import { LoadingAnimation } from './Loading';
import toast from 'react-hot-toast';
const PostCard = ({ type, value }) => {
  const { setPosts, setReels } = usePostStore();

  const [show, setShow] = useState(false);
  const [comment, setNewComment] = useState('');
  const { setIsLoading, addLoading, setAddLoading, isAuth } = useUserStore();

  const [isEdited, setIsEdited] = useState(false);
  const handleEdit = async () => {
    setIsEdited(true);
  };

  // Function to handle adding a comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const res = await axios.post(`/api/post/comment/${value._id}`, {
        comment,
        withCredentials: true,
      });
      if (res.status === 201) {
        setTimeout(() => {
          setAddLoading(false);
          fetchPosts({ setPosts, setReels, setIsLoading, isAuth });
          setNewComment('');
          setShow(false);
        }, 500);
      }
    } catch (err) {
      setTimeout(() => {
        setAddLoading(false);
        toast.error(err.response.data.message);
      }, 500);
    }
  };
  const showComments = () => {
    setShow(!show);
  };

  return (
    <div className='bg-gray-100 flex items-center justify-center pt-3 pb-14'>
      <div className='bg-white rounded-lg shadow-md max-w-md w-full'>
        {/* Post Header */}
        <PostHeader value={value} />
        {/* Post Media */}
        <PostMedia value={value} type={type} />
        {/* Post Actions */}
        <PostActions value={value} showComments={showComments} />

        {/* Add Comment */}
        {show && (
          <form className='flex gap-3 p-4 border-t'>
            <input
              type='text'
              className='custom-input flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter Comment'
              value={comment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type='submit'
              className={`bg-blue-500 text-white rounded-md px-4 py-2 ${
                !comment.trim()
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer'
              }`}
              onClick={handleAddComment}
              disabled={!comment.trim()}>
              {addLoading ? <LoadingAnimation /> : 'Comment'}
            </button>
          </form>
        )}

        <hr className='mt-2 mb-2' />
        {/* All Comments */}
        <div className='px-4'>
          <p className='text-gray-800 font-semibold'>Comments</p>
          <hr className='mt-2 mb-2' />
          <div className='mt-4 max-h-56 overflow-y-auto'>
            {value.comments && value.comments.length > 0 ? (
              value.comments.map((comment, index) => (
                <Comment
                  key={index}
                  value={comment}
                  postOwner={value.owner}
                  postId={value._id}
                  Click={handleEdit}
                  isEdited={isEdited}
                  setIsEdited={setIsEdited}
                />
              ))
            ) : (
              <p className='text-gray-500 text-sm mb-4'>No Comments</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
