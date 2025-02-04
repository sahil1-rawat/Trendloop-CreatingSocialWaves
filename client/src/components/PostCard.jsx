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
      </div>
    </div>
  );
};

export default PostCard;
