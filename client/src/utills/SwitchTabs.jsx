import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostCard from '../components/PostCard';
import { AiOutlineFile } from 'react-icons/ai';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserStore } from '../../store';

const SwitchTabs = ({ myPosts, myReels }) => {
  const navigate = useNavigate();
  const params = useParams();
  const { usersData } = useUserStore();
  return (
    <Tabs defaultValue='posts' className='xs:w-[400px] w-[300px]'>
      {/* Tab Navigation */}
      <TabsList className='grid w-full grid-cols-2 bg-gray-300 text-blue-700 pb-10'>
        <TabsTrigger
          value='posts'
          className='!font-semibold text-lg data-[state=active]:bg-indigo-500 data-[state=active]:text-white'>
          Posts
        </TabsTrigger>
        <TabsTrigger
          value='reels'
          className='!font-semibold text-lg data-[state=active]:bg-indigo-500 data-[state=active]:text-white'>
          Reels
        </TabsTrigger>
      </TabsList>

      {/* Posts Content */}
      <TabsContent value='posts'>
        <>
          {myPosts && myPosts.length > 0 ? (
            myPosts.map((post) => (
              <PostCard key={post._id} value={post} type='post' />
            ))
          ) : (
            <div className='flex justify-center flex-col items-center mb-[43px] text-center bg-gray-100 rounded-lg  py-10 px-6'>
              <AiOutlineFile className='text-gray-400 mb-4' size={60} />
              <h2 className='text-xl sm:text-2xl text-gray-600 font-semibold'>
                No Posts Yet
              </h2>
              {!params.id && (
                <>
                  <p className='text-sm sm:text-base text-gray-500 mt-2'>
                    It looks like you haven’t shared any posts yet. Start
                    posting to see them here!
                  </p>
                  <button
                    className='mt-6 px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-all duration-200'
                    onClick={() => {
                      navigate('/new-post');
                    }}>
                    Create a Post
                  </button>
                </>
              )}
            </div>
          )}
        </>
      </TabsContent>

      <TabsContent value='reels'>
        <>
          {myReels && myReels.length > 0 ? (
            myReels.map((reel) => (
              <PostCard key={reel._id} value={reel} type='reel' />
            ))
          ) : (
            <div className='flex justify-center flex-col items-center mb-[43px] text-center bg-gray-100 rounded-lg  py-10 px-6'>
              <AiOutlineFile className='text-gray-400 mb-4' size={60} />
              <h2 className='text-xl sm:text-2xl text-gray-600 font-semibold'>
                No Reels Yet
              </h2>
              {!params.id && (
                <>
                  <p className='text-sm sm:text-base text-gray-500 mt-2'>
                    Share your first reel to show it here. Let the world see
                    your creativity!
                  </p>
                  <button
                    className='mt-6 px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-all duration-200'
                    onClick={() => {
                      navigate('/new-reel');
                    }}>
                    Add a Reel
                  </button>
                </>
              )}
            </div>
          )}
        </>
      </TabsContent>
    </Tabs>
  );
};

export default SwitchTabs;
