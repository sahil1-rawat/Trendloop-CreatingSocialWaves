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

import axios from 'axios';

import { usePostStore, useUserStore } from '../../store';
import { format } from 'date-fns';

import { Comment } from './Comment';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { fetchPosts } from '../utills/FetchPost';

const PostCard = ({ type, value }) => {
  const { setPosts, setReels, isMuted, setIsMuted } = usePostStore();
  const videoRefs = useRef([]);
  const [isLike, setIsLike] = useState(false);
  const [show, setShow] = useState(false);
  const [comment, setNewComment] = useState('');
  const { usersData, setIsLoading } = useUserStore();
  const formatDate = format(new Date(value.createdAt), 'MMMM do');
  const formatTime = format(new Date(value.createdAt), 'HH:mm');

  useEffect(() => {
    for (let i = 0; i < value.likes.length; i++) {
      if (value.likes[i] === usersData._id) {
        setIsLike(true);
      }
    }
  }, [value, usersData._id]);
  const handleSlideChange = (swiper) => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
    const activeIndex = swiper.activeIndex;

    const activeVideo = videoRefs.current[activeIndex];

    if (activeVideo) activeVideo.play();
  };

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

  // Handle adding a comment
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
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  return (
    <div className='bg-gray-100 flex items-center justify-center pt-3 pb-14'>
      <div className='bg-white rounded-lg shadow-md max-w-md w-full'>
        {/* Header */}
        <div className='flex items-center justify-between mt-3 mx-2'>
          <div className='flex items-center gap-2'>
            <Link to={`/user/${value.owner._id}`}>
              <img
                src={value.owner.profilePic.url}
                alt='Profile'
                className='w-10 h-10 rounded-full'
              />
            </Link>
            <div>
              <p className='font-semibold text-gray-700'>{value.owner.name}</p>
              <div className='text-gray-500 text-sm'>
                {formatDate} | {formatTime}
              </div>
            </div>
          </div>
          {value.owner._id === usersData._id && (
            <button className='hover:bg-gray-50 rounded-full p-2 text-gray-500'>
              <BsThreeDotsVertical />
            </button>
          )}
        </div>

        {/* Caption */}
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
                        className='h-[550px] w-[500px]   rounded-lg object-fill'
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

        {/* Actions */}
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
