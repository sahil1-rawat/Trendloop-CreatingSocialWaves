import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BsChatFill, BsThreeDotsVertical } from 'react-icons/bs';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useUserStore } from '../../store';
import { format } from 'date-fns';

import { Comment } from './Comment';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const PostCard = ({ type, value }) => {
  const [isLike, setIsLike] = useState(false);
  const [show, setShow] = useState(false);
  const [comment, setNewComment] = useState('');
  const [comments, setComments] = useState(value.comments.length);
  const { usersData } = useUserStore();
  const formatDate = format(new Date(value.createdAt), 'MMMM do');
  const formatTime = format(new Date(value.createdAt), 'HH:mm');
  useEffect(() => {
    for (let i = 0; i < value.likes.length; i++) {
      if (value.likes[i] === usersData._id) {
        setIsLike(true);
      }
    }
  }, [value, usersData._id]);
  // Handle adding a comment
  const handleAddComment = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`/api/post/comment/${value._id}`, {
        comment,
        withCredentials: true,
      });
      if (res.status === 201) {
        const updatedComments = res.data.totalComments;
        setComments(updatedComments);
        value.comments.push({
          comment,
          profilePic: usersData.profilePic.url,
          name: usersData.name,
          user: usersData._id,
        });
        setNewComment('');
        setShow(false);
        toast.success(res.data.message);
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

        toast.dismiss();
        toast.success(res.data.message);
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
                      className='w-[500px] h-[300px] object-fill rounded-md'
                    />
                  ) : (
                    <video
                      src={media.url}
                      className='w-full h-56 object-cover rounded-md'
                      autoPlay
                      controls
                    />
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
            <span>{comments} comments</span>
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
                <Comment key={index} value={comment} />
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
