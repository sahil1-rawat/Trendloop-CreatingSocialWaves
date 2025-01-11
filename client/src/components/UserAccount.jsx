import React, { useState, useEffect } from 'react';
import { FiUserPlus, FiUserCheck } from 'react-icons/fi';
import { AiOutlineFile } from 'react-icons/ai';
import { useNavigate, useParams } from 'react-router-dom';
import { usePostStore, useUserStore } from '../../store';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
import { fetchPosts, fetchUser, fetchUsers } from '../utills/FetchPost';
import PostCard from './../components/PostCard';
import axios from 'axios';
import Modal from './Modal';

const UserAccount = () => {
  const {
    usersData,
    isAuth,
    isLoading,
    setIsLoading,
    setUsersData,
    setIsAuth,
  } = useUserStore();
  const { posts, reels, setPosts, setReels, user, setUser } = usePostStore();
  const params = useParams();

  const [type, setType] = useState('post');
  const navigate = useNavigate();
  const [isFollower, setIsFollower] = useState(false);
  const [followerModal, setFollowerModal] = useState(false);
  const [followingModal, setFollowingModal] = useState(false);
  useEffect(() => {
    if (usersData.followings.includes(params.id)) {
      setIsFollower(true);
    }
  }, [usersData, params]);

  let myPosts, myReels;
  if (posts) {
    myPosts = posts.filter((post) => post.owner._id === params.id);
  }
  if (reels) {
    myReels = reels.filter((reel) => reel.owner._id === params.id);
  }
  const totalPosts = myPosts?.length + myReels?.length;

  useEffect(() => {
    fetchPosts({ setPosts, setReels, setIsLoading });
  }, []);

  useEffect(() => {
    fetchUsers({ setUser, params });
  }, [params.id]);
  const followandUnfollowUsers = async () => {
    try {
      const res = await axios.post(`/api/user/follow/${params.id}`);
      if (res.status === 200) {
        setIsFollower(!isFollower);
        fetchUsers({ setUser, params });
        fetchUser({ setUsersData, setIsAuth });
        toast.success(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);
  const followData = async () => {
    try {
      const res = await axios.get(
        `/api/user/followData/${user?._id || params.id}`
      );

      if (res.status === 200) {
        setFollowersData(res.data.user.followers);
        setFollowingsData(res.data.user.followings);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    followData();
  }, [user]);
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        isAuth && (
          <div className='bg-gray-100 min-h-screen'>
            <div className='flex justify-center py-10'>
              {followerModal && (
                <Modal
                  value={followersData}
                  title='followers'
                  setShow={setFollowerModal}
                />
              )}
              {followingModal && (
                <Modal
                  value={followingsData}
                  title='following'
                  setShow={setFollowingModal}
                />
              )}
              <div className='bg-white rounded-3xl shadow-lg p-8 w-full max-w-2xl'>
                <div className='relative flex flex-col items-center mb-6'>
                  <img
                    src={user?.profilePic?.url || ''}
                    alt='Profile'
                    className='w-40 h-40 rounded-full border-4 border-indigo-600 shadow-lg cursor-pointer'
                  />
                </div>

                <div className='text-center space-y-4'>
                  <>
                    <h1 className='text-3xl font-bold text-gray-800'>
                      {user.name}{' '}
                    </h1>
                    <p className='bg-indigo-100 text-indigo-700 font-bold px-4 py-1 rounded-lg inline-block'>
                      {user.email}
                    </p>
                    <div className='flex justify-center gap-6 text-gray-600'>
                      <p className='text-lg'>{totalPosts} Posts</p>
                      <p
                        className='text-lg cursor-pointer'
                        onClick={() => setFollowerModal(true)}>
                        {user.followers?.length} Followers
                      </p>
                      <p
                        className='text-lg cursor-pointer'
                        onClick={() => setFollowingModal(true)}>
                        {user.followings?.length} Following
                      </p>
                    </div>

                    <button
                      className='mt-6 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-3 px-12 rounded-lg font-semibold flex items-center justify-center gap-2 transition duration-200 shadow-lg'
                      onClick={followandUnfollowUsers}>
                      {isFollower ? (
                        <>
                          <FiUserCheck size={20} /> <span>Following</span>
                        </>
                      ) : (
                        <>
                          <FiUserPlus size={20} /> <span>Follow</span>
                        </>
                      )}
                    </button>
                  </>
                </div>
              </div>
            </div>
            <div className='flex justify-center items-center p-4 gap-6 mt-6'>
              <button
                className={` py-2 px-6 rounded-lg text-lg font-semibold ${
                  type === 'post'
                    ? ' bg-indigo-500 text-white'
                    : 'bg-gray-400 text-black '
                }`}
                onClick={() => setType('post')}>
                Posts
              </button>
              <button
                className={` py-2 px-6 rounded-lg text-lg font-semibold ${
                  type === 'reel'
                    ? ' bg-indigo-500 text-white'
                    : 'bg-gray-400 text-black'
                }`}
                onClick={() => setType('reel')}>
                Reels
              </button>
            </div>
            <div className='mt-6'>
              {type === 'post' ? (
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
              ) : (
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
              )}
            </div>
          </div>
        )
      )}
    </>
  );
};

export default UserAccount;
