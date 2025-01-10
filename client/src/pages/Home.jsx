import React from 'react';

import PostCard from '../components/PostCard';
import { usePostStore, useUserStore } from '../../store';
import Loading from '../components/Loading';
import Addpost from '../components/AddPost';
import { AiOutlineFile } from 'react-icons/ai';

const Home = () => {
  const { posts } = usePostStore();
  const { isLoading } = useUserStore();

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <Addpost type='post' />
          {posts && posts.length > 0 ? (
            posts.map((ele) => (
              <PostCard value={ele} key={ele._id} type='post' />
            ))
          ) : (
            <div className='flex justify-center flex-col items-center mb-11 text-xl text-center sm:text-4xl text-black font-semibold bg-gray-100'>
              <AiOutlineFile />
              <p className='pb-4'>
                No posts available right now. Be the first to post!
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Home;
