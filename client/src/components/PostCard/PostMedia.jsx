import React, { useEffect, useRef } from 'react';
import { BsVolumeMute, BsVolumeUp } from 'react-icons/bs';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { usePostStore, useUserStore } from '../../../store';

const PostMedia = ({ value, type }) => {
  const { isMuted, setIsMuted } = usePostStore();
  const { isLoading } = useUserStore();
  const videoRefs = useRef([]);

  // Function to toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
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

  // Effect to handle video play/pause based on visibility and page load
  useEffect(() => {
    setIsMuted(true);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;

          if (entry.isIntersecting && !isLoading) {
            // Play video if in view and not loading
            video.play().catch((error) => {
              //console.log('Autoplay failed', error); // Handle autoplay failures
            });
          } else {
            // Pause and reset video if out of view
            video.pause();
            video.currentTime = 0;
          }
        });
      },
      { threshold: 0.7 } // Trigger when 70% of the video is in view
    );

    // Attach observer to each video
    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [isLoading]);

  // Effect to trigger autoplay when page loads, especially for muted videos
  useEffect(() => {
    if (!isLoading) {
      videoRefs.current.forEach((video) => {
        if (video && !video.paused) {
          video.play().catch((error) => {
            //console.log('Autoplay failed on load', error);
          });
        }
      });
    }
  }, [isLoading]);

  return (
    <div className='mb-4'>
      {value.post.length > 0 && (
        // Carousel for multiple posts
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={10}
          slidesPerView={1}
          className=' overflow-hidden bg-white'>
          {value.post.map((media, index) => (
            <SwiperSlide
              key={index}
              className='flex justify-center items-center'>
              {type === 'post' ? (
                <img
                  src={media.url}
                  alt={`Slide ${index + 1}`}
                  className='w-[500px] h-[500px] object-scale-down   '
                />
              ) : (
                <div className='relative bg-black/20  overflow-hidden flex justify-center items-center'>
                  <video
                    src={media.url}
                    ref={(el) => (videoRefs.current[index] = el)}
                    controlsList='nodownload'
                    className='h-[550px] w-[500px] rounded-lg object-scale-down'
                    playsInline
                    muted={isMuted}
                    loop
                    onClick={() => handleVideoClick(index)}
                  />
                  {/* Mute/Unmute Button */}
                  <button
                    onClick={toggleMute}
                    className='absolute bottom-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 flex items-center justify-center w-10 h-10 hover:bg-opacity-75 transition'>
                    {isMuted ? (
                      <BsVolumeMute className='text-lg' title='Unmute' />
                    ) : (
                      <BsVolumeUp className='text-lg' title='Mute' />
                    )}
                  </button>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default PostMedia;
