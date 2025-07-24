import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { usePostStore, useUserStore } from '../../store';
import { fetchPosts } from '../utills/FetchPost';
import { LoadingAnimation } from './Loading';

const Addpost = ({ type }) => {
  const { setPosts, setReels } = usePostStore();
  const { setIsLoading, addLoading, setAddLoading, isAuth } = useUserStore();
  const [caption, setCaption] = useState('');
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const videoRefs = useRef([]);

  const navigate = useNavigate();
  const isFormValid = files.length > 0;

  // Function to clear file previews
  const closeFilePrev = () => {
    setFiles([]);
    setFilePreviews([]);
  };

  // Function to handle file input change
  const changeFileHandler = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const filePreviews = selectedFiles.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
      });
    });

    Promise.all(filePreviews).then((previews) => {
      setFilePreviews(previews.slice(0, 10));
      setFiles(selectedFiles.slice(0, 10));
    });
  };

  // Function to handle slide change in Swiper
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

  // Function to handle video click (play/pause)
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

  // Function to handle Swiper initialization
  const handleSwiperInit = (swiper) => {
    const firstVideo = videoRefs.current[0];
    if (firstVideo) firstVideo.play();
  };

  // Function to handle add new post or reels
  const addPost = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    const newPost = new FormData();
    newPost.append('caption', caption);
    Array.from(files).forEach((file) => {
      newPost.append('file', file);
    });

    try {
      const res = await axios.post(`/api/post/new?type=${type}`, newPost, {
        withCredentials: true,
      });

      if (res.status === 201) {
        setCaption('');
        setFiles([]);
        setFilePreviews([]);
        setAddLoading(false);
        fetchPosts({ setPosts, setReels, setIsLoading, isAuth });
        type === 'post' ? navigate('/') : navigate('/reels');
        toast.dismiss();
        toast.success(res.data.message);
      }
    } catch (err) {
      //console.log(err);
      setAddLoading(false);
    }
  };

  return (
    <div className=' flex items-center justify-center min-h-[40vh] px-4 py-4'>
      <div className='bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-md w-full'>
        <h2 className='text-lg font-semibold text-gray-700 mb-4 text-center'>
          {type === 'post' ? 'Create New Post' : 'Create New Reel'}
        </h2>
        <form
          className='flex flex-col gap-4 items-center'
          onSubmit={(e) => e.preventDefault()}>
          <input
            type='text'
            className='custom-input border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Enter a caption'
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          {files.length === 0 && (
            <input
              type='file'
              className='custom-input'
              {...(type === 'post'
                ? { accept: 'image/*', multiple: true }
                : { accept: 'video/*', multiple: false })}
              onChange={changeFileHandler}
              required
            />
          )}

          {filePreviews.length > 0 && (
            <div className='w-full mt-4'>
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={20}
                slidesPerView={1}
                className='rounded-lg shadow-md'
                onSlideChange={handleSlideChange}
                onSwiper={handleSwiperInit}>
                {filePreviews.map((preview, index) => (
                  <SwiperSlide
                    key={index}
                    className='flex justify-center items-center'>
                    {type === 'post' ? (
                      <div className='relative'>
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className='h-[300px] w-[500px] rounded-lg object-scale-down'
                        />
                        {/* Close button */}
                        <button
                          className='absolute top-2 right-2 bg-gray-500 text-white p-2 rounded-full shadow-md hover:bg-red-500 transition-all duration-200'
                          aria-label='Close'
                          title='Close'
                          onClick={closeFilePrev}>
                          <FaTimes size={20} />
                        </button>
                      </div>
                    ) : (
                      <div className='relative'>
                        <video
                          ref={(el) => (videoRefs.current[index] = el)}
                          controlsList='nodownload'
                          src={preview}
                          className='h-[300px] w-[500px] rounded-lg object-fill'
                          playsInline
                          onClick={() => handleVideoClick(index)}
                        />
                        <button
                          className='absolute top-2 right-2 bg-gray-500 text-white p-2 rounded-full shadow-md hover:bg-red-500 transition-all duration-200'
                          aria-label='Close'
                          title='Close'
                          onClick={closeFilePrev}>
                          <FaTimes size={20} />
                        </button>
                      </div>
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          <button
            type='submit'
            className={`bg-blue-500 text-white px-4 py-2 rounded-md w-full ${
              !isFormValid && 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!isFormValid || addLoading}
            onClick={addPost}>
            {addLoading ? (
              <LoadingAnimation />
            ) : type === 'post' ? (
              '+ Add New Post'
            ) : (
              '+ Add New Reel'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addpost;
