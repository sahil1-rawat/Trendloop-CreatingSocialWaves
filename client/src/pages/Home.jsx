import React, { useEffect } from 'react';

import PostCard from '../components/PostCard';
import { usePostStore, useUserStore } from '../../store';
import Loading from '../components/Loading';
import Addpost from '../components/AddPost';
import { AiOutlineFile } from 'react-icons/ai';
import { fetchPosts } from '../utills/FetchPost';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { setPosts, setReels, posts } = usePostStore();
  const navigate = useNavigate();

  const { setIsLoading, addLoading, setAddLoading, isLoading } = useUserStore();
  useEffect(() => {
    fetchPosts({ setPosts, setReels, setIsLoading });
  }, [setPosts, setReels, setIsLoading]);
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {posts && posts.length > 0 ? (
            posts.map((ele) => (
              <PostCard value={ele} key={ele._id} type='post' />
            ))
          ) : (
            <div className='h-[83vh] flex flex-col justify-center items-center mb-11 text-center bg-gray-100 rounded-lg shadow-md'>
              <AiOutlineFile size={50} className='text-gray-400 mb-4' />
              <p className='text-lg sm:text-2xl text-gray-600 font-medium'>
                No posts available right now.
              </p>
              <p className='text-md sm:text-lg text-gray-500 mt-2'>
                Be the first to share something amazing!
              </p>
              <button
                className='mt-6 px-4  py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-all duration-200'
                onClick={() => {
                  navigate('/new-post');
                }}>
                Add a Post
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Home;
