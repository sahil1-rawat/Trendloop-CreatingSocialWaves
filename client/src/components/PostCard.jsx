import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  BsChatFill,
  BsThreeDotsVertical,
  BsVolumeMute,
  BsVolumeUp,
} from 'react-icons/bs';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { usePostStore, useUserStore } from '../../store';
import { format } from 'date-fns';
import { Comment } from './Comment';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { fetchPosts, fetchUser, fetchUsers } from '../utills/FetchPost';
import toast from 'react-hot-toast';

const PostCard = ({ type, value }) => {
  const { setPosts, setReels, isMuted, setIsMuted, setUser } = usePostStore();
  const videoRefs = useRef([]);
  const [isLike, setIsLike] = useState(false);
  const [show, setShow] = useState(false);
  const [comment, setNewComment] = useState('');
  const { usersData, setIsLoading, setUsersData, setIsAuth } = useUserStore();
  const formatDate = format(new Date(value.createdAt), 'MMMM do');
  const formatTime = format(new Date(value.createdAt), 'HH:mm');
  const [caption, setCaption] = useState(value.caption || '');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFollower, setIsFollower] = useState(false);
  // Effect to check if the post is liked by the user
  useEffect(() => {
    for (let i = 0; i < value.likes.length; i++) {
      if (value.likes[i] === usersData._id) {
        setIsLike(true);
      }
    }
  }, [value, usersData._id]);

  // Function to handle edit click
  const handleEditClick = () => {
    setDropdownOpen(false);
    setDialogOpen(true);
  };

  // Function to edit caption
  const editCaption = async () => {
    try {
      const res = await axios.put(`/api/post/edit/${value._id}`, {
        newCaption: caption,
        withCredentials: true,
      });
      if (res.status === 200) {
        toast.success(res.data.message);
        fetchPosts({ setPosts, setReels, setIsLoading });
        setDialogOpen(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Function to handle video click
  const handleVideoClick = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  // Effect to handle video play/pause based on visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play();
          } else {
            video.pause();
            video.currentTime = 0;
          }
        });
      },
      { threshold: 0.7 }
    );

    // Attach observer to each video
    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    // Cleanup observer on unmount
    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, []);

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
  const likeUnlikePost = async () => {
    try {
      const res = await axios.post(`/api/post/likeunlike/${value._id}`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setIsLike(!isLike);
        const updatedLikes = res.data.totalLikes;
        value.likes.length = updatedLikes;
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Function to toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Function to delete a post
  const deletePost = async () => {
    try {
      const res = await axios.delete(`/api/post/delete/${value._id}`);
      if (res.status === 200) {
        toast.success(res.data.message);
        fetchPosts({ setPosts, setReels, setIsLoading });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const [isEdited, setIsEdited] = useState(false);
  const handleEdit = async () => {
    setIsEdited(true);
  };

  // follow unfollow users
  const params = useParams();
  const [followStatus, setFollowStatus] = useState({});
  useEffect(() => {
    if (usersData.followings.includes(value.owner._id)) {
      setIsFollower(true);
    }
    const likesSet = new Set(value.likes);
    const isUserLiked = likesSet.has(usersData._id);

    console.log(isUserLiked);
  }, [usersData, params]);
  const followandUnfollowUsers = async (id) => {
    try {
      const res = await axios.post(`/api/user/follow/${id}`);

      if (res.status === 200) {
        setIsFollower(!isFollower);
        setFollowStatus((prevStatus) => ({
          ...prevStatus,
          [id]: !prevStatus[id],
        }));
        fetchUser({ setUsersData, setIsAuth });
        toast.dismiss();
        toast.success(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  // Likes Data
  const [likesData, setLikesData] = useState([]);
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
        <div className='flex items-center justify-between mt-3 mx-2'>
          <div className='flex items-center gap-2'>
            <Link to={value.owner.profilePic.url} target='_blank'>
              <img
                src={value.owner.profilePic.url}
                alt='Profile'
                title='View Profile'
                className='w-12 h-12 rounded-full border border-gray-300 hover:ring-2 hover:ring-gray-400 transition-transform duration-200'
              />
            </Link>

            <div className='flex justify-between flex-col  bg-white rounded-lg'>
              <div className='flex'>
                <Link
                  to={`${
                    value.owner._id === usersData._id
                      ? '/account'
                      : `/user/${value.owner._id}`
                  }`}
                  className='text-gray-700 font-semibold text-md hover:underline'>
                  {value.owner.name}
                </Link>
                {value.owner._id !== usersData._id && (
                  <div>
                    <div
                      className=' text-blue-600 px-4  ml-4 rounded-lg  hover:text-blue-800 transition duration-300 cursor-pointer'
                      onClick={() => followandUnfollowUsers(value.owner._id)}>
                      {isFollower ? 'Following' : 'Follow'}
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
                      <Button type='submit' onClick={editCaption}>
                        Edit
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </DropdownMenu>
            </>
          )}
        </div>

        <div className='px-4 my-2'>
          <p className='text-gray-800'>{value.caption}</p>
        </div>

        <div className='mb-4'>
          {value.post.length > 0 && (
            // Carousel for multiple posts
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={20}
              slidesPerView={1}
              className='rounded-lg shadow-md'>
              {value.post.map((media, index) => (
                <SwiperSlide
                  key={index}
                  className='flex justify-center items-center'>
                  {type === 'post' ? (
                    <img
                      src={media.url}
                      alt={`Slide ${index + 1}`}
                      className='w-[500px] h-[300px] object-scale-down rounded-md'
                    />
                  ) : (
                    <div className='relative'>
                      <video
                        src={media.url}
                        ref={(el) => (videoRefs.current[index] = el)}
                        controlsList='nodownload'
                        className='h-[550px] w-[500px]   rounded-lg '
                        playsInline
                        muted={isMuted}
                        loop
                        onClick={() => handleVideoClick(index)}
                      />
                      <button
                        onClick={toggleMute}
                        className='absolute bottom-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2'>
                        {isMuted ? (
                          <BsVolumeMute title='Unmute' />
                        ) : (
                          <BsVolumeUp title='Mute' />
                        )}
                      </button>
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

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
                <div className='hover:bg-gray-50 rounded-full p-2 cursor-pointer'>
                  {value.likes.length} likes
                </div>
              </DialogTrigger>
              {likesData.length > 0 && (
                <DialogContent
                  className='sm:max-w-[425px] sm:w-full p-4 rounded-lg bg-white shadow-lg'
                  aria-describedby={undefined}>
                  <DialogHeader>
                    <DialogTitle className='text-xl font-semibold text-gray-800'>
                      Likes
                    </DialogTitle>
                  </DialogHeader>
                  <div className='grid gap-4 py-4 overflow-y-auto max-h-[300px]'>
                    {likesData.map((like, index) => (
                      <div
                        key={like._id}
                        className='flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-lg'>
                        <img
                          src={like.profilePic.url}
                          alt={like.name}
                          className='w-12 h-12 rounded-full object-cover shadow-sm'
                        />
                        <div className='flex-1'>
                          <p className='text-gray-800 font-medium'>
                            {like.name}
                          </p>
                          <p className='text-sm text-gray-500'>{like.email}</p>
                        </div>
                        {like._id !== usersData._id && (
                          <button
                            className='mt-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-2 px-6 rounded-lg font-semibold '
                            onClick={() => followandUnfollowUsers(like._id)}>
                            {followStatus[like._id] ? 'Following' : 'Follow'}
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
