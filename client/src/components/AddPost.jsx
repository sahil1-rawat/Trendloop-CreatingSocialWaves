import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { usePostStore } from '../../store';
import axios from 'axios';

const Addpost = ({ type }) => {
  const { posts, reels, setPosts, setReels } = usePostStore();
  const [caption, setCaption] = useState('');
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const videoRefs = useRef([]);
  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/post/all', {
        withCredentials: true,
      });
      if (res.status === 200) {
        setPosts(res.data.posts);
        setReels(res.data.reels);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);
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

  const handleSwiperInit = (swiper) => {
    const firstVideo = videoRefs.current[0];
    if (firstVideo) firstVideo.play();
  };

  const isFormValid = files.length > 0;

  return (
    <div className='bg-gray-100 flex items-center justify-center min-h-screen px-4 py-8'>
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

          {/* Conditionally render the file input only if no files are selected */}
          {files.length === 0 && (
            <input
              type='file'
              className='custom-input'
              multiple
              accept={type === 'post' ? 'image/*' : 'video/*'}
              onChange={changeFileHandler}
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
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className='h-[300px] w-[500px] rounded-lg object-cover'
                      />
                    ) : (
                      <video
                        ref={(el) => (videoRefs.current[index] = el)}
                        controlsList='nodownload'
                        src={preview}
                        className='h-[300px] w-[500px] rounded-lg object-cover'
                        playsInline
                        onClick={() => handleVideoClick(index)}
                      />
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
            disabled={!isFormValid}>
            + Add Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addpost;
