import React, { useEffect, useRef, useState } from 'react';
import { BsVolumeMute, BsVolumeUp } from 'react-icons/bs';
import { usePostStore } from '../../store'; // Update path as needed

const AdminPostVideo = ({ src, postId }) => {
  const { isMuted, setIsMuted } = usePostStore();
  const videoRef = useRef(null);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const pauseOtherVideos = (currentVideo) => {
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach((video) => {
      if (video !== currentVideo) {
        video.pause();
        video.currentTime = 0;
      }
    });
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasPlayedOnce) {
              // Skip first auto-play
              setHasPlayedOnce(true);
              return;
            }

            pauseOtherVideos(video);
            video.play().catch((e) => console.warn('Autoplay error:', e));
          } else {
            video.pause();
            video.currentTime = 0;
          }
        });
      },
      { threshold: 0.7 }
    );

    observer.observe(video);

    return () => {
      observer.unobserve(video);
    };
  }, [hasPlayedOnce]);

  const handleManualPlay = () => {
    pauseOtherVideos(videoRef.current);
    videoRef.current.play();
  };

  return (
    <div className="relative">
      <video
        src={src}
        className="w-full h-80 object-fill rounded-md"
        playsInline
        muted={isMuted}
        controls
        ref={videoRef}
      />

      <button
        onClick={toggleMute}
        className="absolute bottom-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70">
        {isMuted ? <BsVolumeMute title="Unmute" /> : <BsVolumeUp title="Mute" />}
      </button>
    </div>
  );
};

export default AdminPostVideo;
