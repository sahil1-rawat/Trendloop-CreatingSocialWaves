import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePostStore, useUserStore } from '../../../store';
import { fetchUser } from '../../utills/FetchPost';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
const LikesData = ({ totalLikes, value }) => {
  // follow unfollow users
  const { usersData, setUsersData, setIsAuth } = useUserStore();
  const [likesData, setLikesData] = useState([]);
  const { setTab } = usePostStore();
  const [isFollowing, setIsFollowing] = useState({});
  useEffect(() => {
    if (usersData?.followings && likesData.length > 0) {
      const initialFollowStatus = likesData.reduce(
        (isFollowingStatus, like) => {
          isFollowingStatus[like._id] = usersData.followings.includes(like._id);

          return isFollowingStatus;
        },
        {}
      );
      setIsFollowing(initialFollowStatus);
    }
  }, [usersData, value.owner, likesData]);
  const followandUnfollowUsers = async (id) => {
    try {
      const res = await axios.post(`/api/user/follow/${id}`);

      if (res.status === 200) {
        //! 'like._id':true/false
        // ? toggle follower status
        setIsFollowing((prev) => ({
          ...prev,
          [id]: !prev[id],
        }));
        fetchUser({ setUsersData, setIsAuth });
        toast.dismiss();
        toast.success(res.data.message);
      }
    } catch (err) {
      //console.log(err);
    }
  };

  const postsLikesData = async () => {
    try {
      const res = await axios.post(`/api/post/likes/${value._id}`);
      if (res.status === 200) {
        setLikesData(res.data.posts.likes);
      }
    } catch (err) {
      //console.log(err);
    }
  };

  useEffect(() => {
    postsLikesData();
  }, [value]);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <button className='hover:bg-gray-50 rounded-full  cursor-pointer mt-1 text-sm text-gray-500 font-medium'>
            {totalLikes} {totalLikes <= 1 ? 'Like' : 'Likes'}
          </button>
        </DialogTrigger>
        {likesData.length > 0 && (
          <DialogContent className='sm:max-w-[425px] sm:w-full p-4 rounded-lg bg-white shadow-lg'>
            <DialogHeader>
              <DialogTitle className='text-xl font-semibold text-gray-800'>
                Likes
              </DialogTitle>
              <DialogDescription className='sr-only'>
                Total Likes
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4 overflow-y-auto max-h-[300px]'>
              {likesData.map((like) => (
                <div
                  key={like._id}
                  className='flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-lg'>
                  <img
                    src={like.profilePic.url}
                    alt={like.name}
                    className='w-12 h-12 rounded-full object-cover shadow-sm'
                  />
                  <div className='flex-1'>
                    <Link
                      to={`/user/${like._id}`}
                      className='text-gray-900 font-medium text-sm hover:underline'
                      onClick={() =>
                        usersData._id === like._id
                          ? setTab('/account')
                          : setTab(`user/${like._id}`)
                      }>
                      {like.name}
                    </Link>
                    <p className='text-sm text-gray-500'>{like.email}</p>
                  </div>
                  {like._id !== usersData._id && (
                    <button
                      className={`mt-4 ${
                        isFollowing[like._id]
                          ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
                          : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600'
                      } text-white py-2 px-6 rounded-lg font-semibold`}
                      onClick={() => followandUnfollowUsers(like._id)}>
                      {isFollowing[like._id] ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default LikesData;
