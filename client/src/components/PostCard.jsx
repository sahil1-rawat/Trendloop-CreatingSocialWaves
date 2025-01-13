import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { fetchPosts } from '../utills/FetchPost';
import toast from 'react-hot-toast';

const PostCard = ({ type, value }) => {
  const { setPosts, setReels, isMuted, setIsMuted } = usePostStore();
  const videoRefs = useRef([]);
  const [isLike, setIsLike] = useState(false);
  const [show, setShow] = useState(false);
  const [comment, setNewComment] = useState('');
  const { usersData, setIsLoading } = useUserStore();
  const formatDate = format(new Date(value.createdAt), 'MMMM do');
  const formatTime = format(new Date(value.createdAt), 'HH:mm');
  const [caption, setCaption] = useState(value.caption || '');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  return (
    <div className='bg-gray-100 flex items-center justify-center pt-3 pb-14'>
      <div className='bg-white rounded-lg shadow-md max-w-md w-full'>
        {/* Header */}
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
            <div>
              <Link
                to={`${
                  value.owner._id === usersData._id
                    ? '/account'
                    : `/user/${value.owner._id}`
                }`}
                className='text-gray-700 font-semibold text-md hover:underline'>
                {value.owner.name}
              </Link>
              <div className='text-gray-500 text-sm'>
                {formatDate} | {formatTime}
              </div>
            </div>
          </div>
          {value.owner._id === usersData._id && (
            <>
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger className='hover:bg-gray-50 rounded-full p-2 text-gray-500'>
                  <BsThreeDotsVertical />
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

        {/* Media Section */}
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
            <button className='hover:bg-gray-50 rounded-full p-1'>
              {value.likes.length} likes
            </button>
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
                  values={value}
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
