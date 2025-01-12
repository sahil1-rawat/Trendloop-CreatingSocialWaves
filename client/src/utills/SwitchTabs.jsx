import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostCard from '../components/PostCard';
import { AiOutlineFile } from 'react-icons/ai';
const SwitchTabs = ({ myPosts, myReels }) => {
  return (
    <Tabs defaultValue='posts' className='xs:w-[400px] w-[300px] '>
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
      <TabsContent value='posts'>
        <>
          {myPosts && myPosts.length > 0 ? (
            myPosts.map((post) => (
              <PostCard key={post._id} value={post} type='post' />
            ))
          ) : (
            <div className='flex justify-center flex-col items-center mb-[43px] text-4xl md:text-6xl  font-semibold'>
              <AiOutlineFile className='text-gray-600' />
              <p className='pb-4 text-black'>No Posts Yet</p>
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
            <div className='flex justify-center flex-col items-center mb-[43px] text-4xl md:text-6xl  font-semibold'>
              <AiOutlineFile className='text-gray-600' />
              <p className='pb-4 text-black'>No Reels Yet</p>
            </div>
          )}
        </>
      </TabsContent>
    </Tabs>
  );
};

export default SwitchTabs;
