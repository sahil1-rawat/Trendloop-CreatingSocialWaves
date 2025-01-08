import React from 'react';
import Addpost from '../components/Addpost';
import PostCard from '../components/PostCard';
import { usePostStore, useUserStore } from '../../store';
import Loading from '../components/Loading';

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
            <p>No Post yet</p>
          )}
        </div>
      )}
    </>
  );
};

export default Home;
