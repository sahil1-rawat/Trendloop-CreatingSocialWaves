import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { usePostStore, useUserStore } from '../../../store';
import { format } from 'date-fns';
import axios from 'axios';
import { fetchPosts, fetchUser, sharePost } from '../../utills/FetchPost';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { BASE_URL } from '../../../common';

const PostHeader = ({ value, setValue, setType, params: params2 }) => {
  const formatDate = format(new Date(value.createdAt), 'MMMM do');
  const formatTime = format(new Date(value.createdAt), 'HH:mm');
  const [isFollower, setIsFollower] = useState(false);
  const { usersData, setUsersData, setIsAuth, setIsLoading, isAuth } =
    useUserStore();
  const { setPosts, setReels, setTab } = usePostStore();
  const [caption, setCaption] = useState(value.caption);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (usersData?.followings?.includes(value.owner._id)) {
      setIsFollower(true);
    }
  }, [usersData, value.owner]);

  //follow and unfollow the user
  const followandUnfollowUsers = async (id) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/user/follow/${id}`,
        {},
        {
          withCredentials:true
        }
      );

      if (res.status === 200) {
        setIsFollower(!isFollower);
        fetchUser({ setUsersData, setIsAuth });
        if (setValue) sharePost({ setValue, setType, params: params2 });
        toast.dismiss();
        toast.success(res.data.message);
      }
    } catch (err) {
      //console.log(err);
    }
  };

  // Function to handle edit click
  const handleEditClick = () => {
    setDropdownOpen(false);
    setDialogOpen(true);
    setCaption(value.caption);
  };

  // Function to edit caption
  const editCaption = async () => {
    try {
      const res = await axios.put(`${BASE_URL}/api/post/edit/${value._id}`, {
        newCaption: caption,
      },{
        withCredentials: true,
        
      });
      if (res.status === 200) {
        toast.success(res.data.message);
        fetchPosts({ setPosts, setReels, setIsLoading, isAuth });
        if (setValue && setType && params2)
          sharePost({ setValue, setType, params: params2 });
        setDialogOpen(false);
      }
    } catch (err) {
      //console.log(err);
    }
  };
  // //console.log(params.id);
  //console.log(usersData.id);

  // Function to delete a post
  const deletePost = async () => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/post/delete/${value._id}`,{
                withCredentials: true,
      });
      if (res.status === 200) {
        toast.success(res.data.message);
        if (setValue && setType && params2) {
          navigate('/');
        }
        fetchPosts({ setPosts, setReels, setIsLoading, isAuth });
      }
    } catch (err) {
      //console.log(err);
    }
  };

  return (
    <>
      <div className='flex items-center justify-between mt-3 mx-2'>
        <div className='flex items-center gap-2'>
          <Link to={value.owner.profilePic.url} target='_blank'>
            <img
              src={value.owner.profilePic.url}
              alt='Profile'
              title='View Profile'
              className='w-12 h-12 rounded-full border border-gray-300 hover:ring-2 hover:ring-gray-400 transition-transform duration-200 object-cover'
            />
          </Link>

          <div className='flex justify-between flex-col  bg-white rounded-lg'>
            <div className='flex'>
              <Link
                to={`${`/user/${value.owner._id}`}`}
                className='text-gray-700 font-semibold text-md hover:underline'
                onClick={() =>
                  usersData._id === value.owner._id
                    ? setTab('/account')
                    : setTab(`user/${value.owner._id}`)
                }>
                {value.owner.name}
              </Link>
              {value.owner._id !== usersData._id &&
                params.id !== value.owner._id && (
                  <div>
                    <div
                      className={`px-4 ml-4 rounded-lg text-white transition duration-300 cursor-pointer ${
                        isFollower ? 'bg-green-800' : 'bg-red-800'
                      }`}
                      onClick={() => followandUnfollowUsers(value.owner._id)}>
                      {isFollower &&
                      usersData.followings.includes(value.owner._id)
                        ? 'Following'
                        : 'Follow'}
                    </div>
                  </div>
                )}
            </div>
            <div className='text-gray-500 text-sm'>
              {formatDate} | {formatTime}
            </div>
          </div>
        </div>
        {value.owner._id === usersData._id && (
          <>
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button className='text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors duration-150'>
                  <BsThreeDotsVertical size={20} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={handleEditClick}>
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    setDropdownOpen(false);
                    deletePost();
                  }}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent
                  className='sm:max-w-[425px]'
                  aria-describedby={undefined}>
                  <DialogHeader>
                    <DialogTitle>Edit Caption</DialogTitle>
                  </DialogHeader>
                  <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='name' className='text-right'>
                        Caption
                      </Label>
                      <Input
                        id='name'
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className='col-span-3'
                        placeholder='Edit Caption'
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type='cancel'
                      onClick={() => setDialogOpen(false)}
                      className='bg-gray-300 text-black hover:bg-gray-400'>
                      Cancel
                    </Button>
                    <Button
                      type='submit'
                      onClick={editCaption}
                      className='bg-blue-500 text-white hover:bg-blue-700'
                      disabled={caption.trim() === value.caption}>
                      Edit
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenu>
          </>
        )}
      </div>
      {/* Post Caption */}
      <div className='px-4 mt-4'>
        <p className='text-gray-800'>{value.caption}</p>
      </div>
    </>
  );
};

export default PostHeader;
