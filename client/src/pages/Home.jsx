import React from 'react';
import Addpost from '../components/Addpost';
import PostCard from '../components/PostCard';
import { usePostStore } from '../../store';

const Home = () => {
  const { posts } = usePostStore();
  return (
    <div>
      <Addpost type='post' />
      {posts && posts.length > 0 ? (
        posts.map((ele) => <PostCard value={ele} key={ele._id} type='post' />)
      ) : (
        <p>No Post yet</p>
      )}
    </div>
  );
};

export default Home;
