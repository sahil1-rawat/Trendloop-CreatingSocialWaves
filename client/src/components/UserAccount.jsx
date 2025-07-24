import React, { useState, useEffect } from 'react';
import { FiUserPlus, FiUserCheck } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { usePostStore, useUserStore } from '../../store';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
import { fetchPosts, fetchUser, fetchUsers } from '../utills/FetchPost';
import axios from 'axios';
import Modal from './Modal';
import SwitchTabs from '../utills/SwitchTabs';
import { BASE_URL } from '../../common';

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
  const navigate = useNavigate();

  const [text, setText] = useState('Following');
  const [isFollower, setIsFollower] = useState(false);
  const [followerModal, setFollowerModal] = useState(false);
  const [followingModal, setFollowingModal] = useState(false);
  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);
  useEffect(() => {
    // Scroll to the top of the page when the component is rendered
    window.scrollTo(0, 0);
  }, []);

  // Effects
  useEffect(() => {
    if (usersData?.followings?.includes(params.id)) {
      setIsFollower(true);
    }
  }, [usersData, params]);

  useEffect(() => {
    if (usersData._id === params.id) {
      navigate('/account');
    }
  }, [usersData, params]);

  useEffect(() => {
    setIsLoading(true);
    fetchPosts({ setPosts, setReels, setIsLoading, isAuth });
  }, [setPosts, setReels, setIsLoading, isAuth]);

  useEffect(() => {
    fetchUsers({ setUser, params });
  }, [setUser, params]);

  useEffect(() => {
    followData();
  }, [user]);

  // function to handle Follow and Unfollow events
  const followandUnfollowUsers = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_SOCKET_URL}/api/user/follow/${params.id}`,

        {},
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        setIsFollower(!isFollower);
        fetchUsers({ setUser, params });
        fetchUser({ setUsersData, setIsAuth });
        toast.dismiss();
        toast.success(res.data.message);
      }
    } catch (err) {
      //console.log(err);
    }
  };

  const followData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SOCKET_URL}/api/user/followData/${user?._id || params.id}`,
        {
        withCredentials: true,

        }
      );
      if (res.status === 200) {
        setFollowersData(res.data.user.followers);
        setFollowingsData(res.data.user.followings);
      }
    } catch (err) {
      //console.log(err);
    }
  };

  // Filter posts and reels by the param user
  let myPosts, myReels;
  if (posts) {
    myPosts = posts.filter((post) => post.owner._id === params.id);
  }
  if (reels) {
    myReels = reels.filter((reel) => reel.owner._id === params.id);
  }
  const totalPosts = myPosts?.length + myReels?.length;

  // Render
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
                      onClick={followandUnfollowUsers}
                      onMouseEnter={() => setText('Unfollow')}
                      onMouseLeave={() => setText('Following')}>
                      {usersData.followings.includes(params.id) &&
                      isFollower ? (
                        <>
                          <FiUserCheck size={20} /> <span>{text}</span>
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
              <SwitchTabs myPosts={myPosts} myReels={myReels} />
            </div>
          </div>
        )
      )}
    </>
  );
};

export default UserAccount;
