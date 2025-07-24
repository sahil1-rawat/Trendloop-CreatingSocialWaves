import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import AdminPostVideo from './AdminPostVideo';

const ManagePostsPage = () => {
  const BASE_URL = import.meta.env.VITE_SOCKET_URL;

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
const videoRefs = useRef({});

const fetchPosts=async()=>{
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/posts`,
        {
        withCredentials: true,

        }
        


      );
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      toast.error('Failed to fetch posts');
    }
}

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/posts/${selectedPost._id}`,{
        withCredentials: true,

        });
      setPosts(posts.filter((p) => p._id !== selectedPost._id));
      setOpenDialog(false);
      toast.success( 'Post deleted successfully' );
    } catch (err) {
      toast.error( 'Failed to delete post' );
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen pb-16">

      <h1 className="text-3xl font-bold mb-4">Manage Posts</h1>
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-16">
      {posts.map((post) => (
        <Card key={post._id} className="p-4 shadow-md">
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <img
                src={post.owner?.profilePic?.url}
                alt={post.owner?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{post.owner?.name}</p>
<div className='text-gray-500 text-sm'>
              {format(new Date(post.createdAt), 'MMMM do')} | {format(new Date(post.createdAt), 'HH:mm')}
            </div>              </div>
            </div>
            <p className="mb-2">{post.caption}</p>
  
{post.post.length > 0 && (
  post.type === 'reel' ? (
    <AdminPostVideo src={post.post[0].url} postId={post._id} />
  ) : (
    <img
      src={post.post[0].url}
      alt="Post"
      className="w-full h-80 object-fill rounded-md"
    />
  )
)}


            <Button
              variant="destructive"
              className="mt-4 w-full"
              onClick={() => {
                setSelectedPost(post);
                setOpenDialog(true);
              }}
            >
              Delete Post
            </Button>
          </CardContent>
        </Card>
      ))}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the post.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
            {/* <Button variant="destructive" > */}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
};

export default ManagePostsPage;
