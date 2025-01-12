import React, { useState, useEffect } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { AiOutlineFile, AiOutlineLogout } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { usePostStore, useUserStore } from '../../store';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
import { fetchPosts } from '../utills/FetchPost';
import PostCard from './../components/PostCard';
import Reels from './Reels';
import Modal from '../components/Modal';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import SwitchTabs from '../utills/SwitchTabs';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
const Account = () => {
  const {
    usersData,
    isAuth,
    setUsersData,
    setIsAuth,
    isLoading,
    setIsLoading,
  } = useUserStore();

  const { posts, reels, setPosts, setReels, setTab } = usePostStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [file, setFile] = useState('');
  const [passwordDetails, setPasswordDetails] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  let myPosts, myReels;
  myPosts = posts?.filter((post) => post.owner._id === usersData._id) || [];
  myReels = reels?.filter((reel) => reel.owner._id === usersData._id) || [];

  const totalPosts = myPosts?.length + myReels?.length;

  useEffect(() => {
    if (usersData) {
      setName(usersData.name || '');
      setProfilePic(usersData.profilePic?.url || '');
    }
  }, [usersData]);

  useEffect(() => {
    fetchPosts({ setPosts, setReels, setIsLoading });
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        setFile(file);
      };
      reader.readAsDataURL(file);
    }
  };
  const handlePassword = (e) => {
    const { name, value } = e.target;
    setPasswordDetails({
      ...passwordDetails,
      [name]: value,
    });
  };
  // Change Password
  const handlePasswordChange = async () => {
    try {
      const res = await axios.post(`/api/user/${usersData._id}`, {
        oldPassword: passwordDetails.oldPassword,
        newPassword: passwordDetails.newPassword,
        confirmPassword: passwordDetails.confirmPassword,
      });
      if (res.status === 200) {
        toast.dismiss();
        toast.success(res.data.message);
        setPasswordDetails({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setIsDialogOpen(false);
      }
    } catch (err) {
      toast.dismiss();
      toast.error(err.response.data.message);
    }
  };
  const formData = new FormData();
  formData.append('name', name);
  formData.append('file', file);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:7000/api/user/${usersData._id}`,
        {
          method: 'PUT',
          credentials: 'include',
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        setUsersData(data.user);
        setIsEditing(false);
        fetchPosts({ setPosts, setReels, setIsLoading });
        toast.dismiss();
        toast.success('Profile updated successfully');
      } else {
        toast.dismiss();
        toast.error(data.message);
      }
    } catch (err) {
      toast.dismiss();
      toast.error(err.message);
    }
  };

  const handleCancel = () => {
    setName(usersData.name);
    setProfilePic(usersData.profilePic?.url);
    setIsEditing(false);
  };

  const isSaveDisabled =
    !name.trim() ||
    (name === usersData?.name && profilePic === usersData?.profilePic?.url);

  const logoutHandler = async () => {
    try {
      const res = await fetch('http://localhost:7000/api/auth/logout', {
        method: 'get',
        credentials: 'include',
      });
      if (res.ok) {
        setIsAuth(false);
        setUsersData([]);
        setTab('/');
        setPosts([]);
        setReels([]);
        localStorage.removeItem('usersData');
        localStorage.removeItem('isAuth');
        navigate('/login');
        toast.dismiss();
        toast.success('Logged out successfully');
      }
    } catch (err) {
      toast.dismiss();
      toast.error(err.message);
    }
  };
  const [followerModal, setFollowerModal] = useState(false);
  const [followingModal, setFollowingModal] = useState(false);
  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);
  const followData = async () => {
    // console.log(usersData);

    try {
      const res = await axios.get(`/api/user/followData/${usersData._id}`);

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
  }, [usersData]);
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
                  <Link to={profilePic} target='_blank'>
                    <img
                      src={profilePic}
                      alt='Profile'
                      className='w-40 h-40 rounded-full border-4 border-indigo-600 shadow-lg cursor-pointer'
                    />
                  </Link>

                  {isEditing && (
                    <>
                      <div className='absolute bottom-14 right-70 p-2'>
                        <div
                          className='text-indigo-600  rounded-full shadow-lg cursor-pointer'
                          onClick={() =>
                            document.getElementById('profile-pic').click()
                          }>
                          <FiEdit2 size={24} title='Update Profile' />
                        </div>
                      </div>
                      <input
                        type='file'
                        className='hidden'
                        id='profile-pic'
                        onChange={handleFileChange}
                        accept='image/*'
                      />
                    </>
                  )}
                </div>

                <div className='text-center space-y-4'>
                  {isEditing ? (
                    <form
                      onSubmit={handleProfileUpdate}
                      className='flex flex-col items-center gap-4'>
                      <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='w-full bg-gray-100 border-2 border-indigo-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 max-w-md'
                        placeholder='Update your name'
                      />
                      <button
                        type='submit'
                        disabled={isSaveDisabled}
                        className={`${
                          isSaveDisabled
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        } text-white py-2 px-8 rounded-lg font-medium transition duration-200`}>
                        Save Changes
                      </button>
                    </form>
                  ) : (
                    <>
                      <h1 className='text-3xl font-bold text-gray-800'>
                        {name}
                      </h1>
                      <p className='bg-indigo-100 text-indigo-700 font-bold px-4 py-1 rounded-lg inline-block'>
                        {usersData.email}
                      </p>
                      <div className='flex justify-center gap-6 text-gray-600'>
                        <p className='text-lg'>{totalPosts} Posts</p>
                        <p
                          className='text-lg cursor-pointer'
                          onClick={() => setFollowerModal(true)}>
                          {usersData.followers?.length} Followers
                        </p>
                        <p
                          className='text-lg cursor-pointer'
                          onClick={() => setFollowingModal(true)}>
                          {usersData.followings?.length} Following
                        </p>
                      </div>
                    </>
                  )}
                  {isEditing ? (
                    <button
                      onClick={handleCancel}
                      className='bg-gray-400 hover:bg-gray-500 mt-4 text-white py-2 px-6 rounded-lg font-medium transition duration-200'>
                      Cancel
                    </button>
                  ) : (
                    <div className='flex gap-2 justify-center'>
                      <button
                        onClick={handleEditToggle}
                        className='bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium transition duration-200'>
                        Edit Profile
                      </button>
                      <Dialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}>
                        <DialogTrigger
                          asChild
                          className='bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium transition duration-200'>
                          <Button onClick={() => setIsDialogOpen(true)}>
                            Update Password
                          </Button>
                        </DialogTrigger>
                        <DialogContent
                          className='sm:max-w-[500px]'
                          aria-describedby={undefined}>
                          <DialogHeader>
                            <DialogTitle>Change password</DialogTitle>
                          </DialogHeader>
                          <div className='grid gap-4 py-4'>
                            <div className='grid grid-cols-4 items-center gap-4'>
                              <Label
                                htmlFor='oldPassword'
                                className='text-right'>
                                Old Password
                              </Label>
                              <Input
                                type='password'
                                id='oldPassword'
                                name='oldPassword'
                                placeholder='Enter Old Password'
                                className='col-span-3'
                                value={passwordDetails.oldPassword}
                                onChange={handlePassword}
                                required
                              />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                              <Label
                                htmlFor='newPassword'
                                className='text-right'>
                                New Password
                              </Label>
                              <Input
                                type='password'
                                id='newPassword'
                                name='newPassword'
                                placeholder='Enter New Password'
                                className='col-span-3'
                                value={passwordDetails.newPassword}
                                onChange={handlePassword}
                                required
                              />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                              <Label
                                htmlFor='confirmPassword'
                                className='text-right'>
                                Confirm Password
                              </Label>
                              <Input
                                type='password'
                                id='confirmPassword'
                                name='confirmPassword'
                                placeholder='Retype New Password'
                                className='col-span-3'
                                value={passwordDetails.confirmPassword}
                                onChange={handlePassword}
                                required
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              type='submit'
                              onClick={handlePasswordChange}>
                              Save changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                  <button
                    className='mt-6 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-3 px-12 rounded-lg font-semibold flex items-center justify-center gap-2 transition duration-200 shadow-lg'
                    onClick={logoutHandler}>
                    <AiOutlineLogout size={20} /> Logout
                  </button>
                </div>
              </div>
            </div>
            <div className='flex justify-center items-center p-4 gap-6 mt-6 '>
              <SwitchTabs myPosts={myPosts} myReels={myReels} />
            </div>
          </div>
        )
      )}
    </>
  );
};

export default Account;
