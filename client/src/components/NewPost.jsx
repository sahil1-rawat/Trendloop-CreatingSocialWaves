import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Addpost from './AddPost';

const NewPost = () => {
  return (
    <div className='flex justify-center items-center min-h-screen px-4 sm:px-6 py-8'>
      {/* Tabs Container */}
      <Tabs
        defaultValue='Post'
        className='w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px] bg-white p-4 sm:p-6 rounded-lg shadow-lg'>
        <TabsList className='grid w-full grid-cols-2 gap-2 bg-gray-300 text-blue-700 rounded-md overflow-hidden'>
          <TabsTrigger
            value='Post'
            className='!font-semibold text-sm sm:text-base py-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white text-center'>
            Post
          </TabsTrigger>
          <TabsTrigger
            value='Reel'
            className='!font-semibold text-sm sm:text-base py-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white text-center'>
            Reel
          </TabsTrigger>
        </TabsList>

        <TabsContent value='Post'>
          <Addpost type='post' />
        </TabsContent>
        <TabsContent value='Reel'>
          <Addpost type='reel' />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewPost;
