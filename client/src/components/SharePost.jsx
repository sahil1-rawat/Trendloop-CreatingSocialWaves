import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Comment } from './Comment';
import PostHeader from './PostCard/PostHeader';
import PostMedia from './PostCard/PostMedia';
import PostActions from './PostCard/PostActions';
import { fetchPosts, sharePost } from '../utills/FetchPost';
import { usePostStore, useUserStore } from '../../store';
import toast from 'react-hot-toast';
import Loading, { LoadingAnimation } from './Loading';
import NotFoundPage from './NotFoundPage';

const SharePost = () => {
  const params = useParams();
  const [value, setValue] = useState(null);
  const [type, setType] = useState('post');
  const { setPosts, setReels } = usePostStore();
  const [show, setShow] = useState(false);
  const [comment, setNewComment] = useState('');
  const { setIsLoading, addLoading, setAddLoading } = useUserStore();
  const [isEdited, setIsEdited] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    setLoading(true); // Start loading
    sharePost({ setValue, setType, params }).then(() => {
      setLoading(false); // Stop loading after fetching
    });
  }, [params.id]);

  const handleEdit = async () => {
    setIsEdited(true);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setAddLoading(true);
    try {
      const res = await axios.post(`/api/post/comment/${value._id}`, {
        comment,
        withCredentials: true,
      });
      if (res.status === 201) {
        setTimeout(() => {
          setAddLoading(false);
          fetchPosts({ setPosts, setReels, setIsLoading });
          setNewComment('');
          sharePost({ setType, setValue, params });
          setShow(false);
        }, 500);
      }
    } catch (err) {
      setTimeout(() => {
        setAddLoading(false);
        toast.error(err.response?.data?.message || 'Failed to add comment.');
      }, 500);
    }
  };

  // Show loading state
  if (loading) {
    return <Loading />;
  }

  // Show Not Found page if post is not found
  if (!value || !value._id) {
    return <NotFoundPage />;
  }

  return (
    <div className='bg-gray-100 flex items-center justify-center pt-3 pb-14'>
      <div className='bg-white rounded-lg shadow-md max-w-md w-full'>
        <PostHeader
          value={value}
          setValue={setValue}
          setType={setType}
          params={params}
        />
        <PostMedia
          value={value}
          type={type}
          setValue={setValue}
          setType={setType}
          params={params}
        />
        <PostActions
          value={value}
          showComments={() => setShow(!show)}
          setValue={setValue}
        />

        {show && (
          <form className='flex gap-3 p-4 border-t' onSubmit={handleAddComment}>
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
              disabled={!comment.trim()}>
              {addLoading ? <LoadingAnimation /> : 'Comment'}
            </button>
          </form>
        )}

        <hr className='mt-2 mb-2' />
        <div className='px-4'>
          <p className='text-gray-800 font-semibold'>Comments</p>
          <hr className='mt-2 mb-2' />
          <div className='mt-4 max-h-56 overflow-y-auto'>
            {value.comments?.length > 0 ? (
              value.comments.map((comment, index) => (
                <Comment
                  key={index}
                  value={comment}
                  postOwner={value.owner}
                  postId={value._id}
                  Click={handleEdit}
                  isEdited={isEdited}
                  setIsEdited={setIsEdited}
                  setValue={setValue}
                  setType={setType}
                  params={params}
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

export default SharePost;
