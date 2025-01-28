import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BsChatFill } from 'react-icons/bs';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import axios from 'axios';
import { usePostStore, useUserStore } from '../../store';

import { Comment } from './Comment';

import { fetchPosts, fetchUser, fetchUsers } from '../utills/FetchPost';
import toast from 'react-hot-toast';
import PostHeader from './PostCard/PostHeader';
import PostMedia from './PostCard/PostMedia';

const PostCard = ({ type, value }) => {
  const { setPosts, setReels, setUser, setTab } = usePostStore();

  const [isLike, setIsLike] = useState(false);
  const [show, setShow] = useState(false);
  const [comment, setNewComment] = useState('');
  const { usersData, setIsLoading, setUsersData, setIsAuth, isLoading } =
    useUserStore();

  const [isFollower, setIsFollower] = useState(false);

  const [isEdited, setIsEdited] = useState(false);
  const handleEdit = async () => {
    setIsEdited(true);
  };
  // Effect to check if the post is liked by the user
  useEffect(() => {
    for (let i = 0; i < value.likes.length; i++) {
      if (value.likes[i] === usersData._id) {
        setIsLike(true);
      }
    }
  }, [value, usersData._id]);

  // Function to handle adding a comment
  const handleAddComment = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`/api/post/comment/${value._id}`, {
        comment,
        withCredentials: true,
      });
      if (res.status === 201) {
        fetchPosts({ setPosts, setReels, setIsLoading });
        setNewComment('');
        setShow(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Function to like/unlike a post
  const [likesData, setLikesData] = useState([]);
  const [totalLikes, setTotalLikes] = useState(value.likes.length);

  const likeUnlikePost = async () => {
    try {
      const res = await axios.post(`/api/post/likeunlike/${value._id}`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setIsLike(!isLike);

        const updatedLikes = res.data.totalLikes;
        setTotalLikes(updatedLikes);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // follow unfollow users

  const [isFollowing, setIsFollowing] = useState({});
  useEffect(() => {
    if (usersData.followings.includes(value.owner._id)) {
      setIsFollower(true);
    }
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
        setIsFollower(!isFollower);

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
      console.log(err);
    }
  };

  const postsLikesData = async () => {
    try {
      const res = await axios.post(`/api/post/likes/${value._id}`);
      if (res.status === 200) {
        setLikesData(res.data.posts.likes);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    postsLikesData();
  }, [value]);

  return (
    <div className='bg-gray-100 flex items-center justify-center pt-3 pb-14'>
      <div className='bg-white rounded-lg shadow-md max-w-md w-full'>
        {/* Post Header */}
        <PostHeader value={value} />

        {/* Post Media */}
        <PostMedia value={value} type={type} />
        <div className='flex items-center justify-between text-gray-500 px-4'>
          <div className='flex items-center space-x-2'>
            <span
              onClick={likeUnlikePost}
              title={isLike ? 'Unlike' : 'Like'}
              className='text-red-500 text-2xl cursor-pointer'>
              {isLike ? <FaHeart /> : <FaRegHeart />}
            </span>
            <Dialog>
              <DialogTrigger asChild>
                <button className='hover:bg-gray-50 rounded-full p-2 cursor-pointer'>
                  {totalLikes} likes
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
          </div>
          <button
            className='flex items-center justify-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1'
            onClick={() => setShow(!show)}>
            <BsChatFill />
            <span>{value.comments.length} comments</span>
          </button>
        </div>

        {/* Add Comment */}
        {show && (
          <form className='flex gap-3 p-4 border-t' onSubmit={handleAddComment}>
            <input
              type='text'
              className='custom-input flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter Comment'
              value={comment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type='submit'
              className='bg-blue-500 text-white rounded-md px-4 py-2'>
              Add
            </button>
          </form>
        )}

        <hr className='mt-2 mb-2' />
        <div className='px-4'>
          <p className='text-gray-800 font-semibold'>Comments</p>
          <hr className='mt-2 mb-2' />
          <div className='mt-4 max-h-56 overflow-y-auto'>
            {value.comments && value.comments.length > 0 ? (
              value.comments.map((comment, index) => (
                <Comment
                  key={index}
                  value={comment}
                  postOwner={value.owner}
                  postId={value._id}
                  Click={handleEdit}
                  isEdited={isEdited}
                  setIsEdited={setIsEdited}
                />
              ))
            ) : (
              <p className='text-gray-500 text-sm mb-4'>No Comments</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
