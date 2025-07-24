import React, { useEffect, useRef, useState } from 'react';
// import { apiClient } from '@/lib/api-client';

import moment from 'moment';
import { AiOutlineDownload } from 'react-icons/ai';
import { IoCloseSharp } from 'react-icons/io5';
import {
  MdCopyAll,
  MdDelete,
  MdFolderZip,
  MdOutlineFolderZip,
  MdSaveAs,
  MdUndo,
} from 'react-icons/md';
import {
  FaFile,
  FaFileAlt,
  FaFileExcel,
  FaFilePdf,
  FaFileWord,
  FaMusic,
  FaPause,
  FaPlay,
  FaUserCircle,
  FaVolumeMute,
  FaVolumeOff,
  FaVolumeUp,
} from 'react-icons/fa';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { useChatStore, useUserStore } from '../../../../../../../store';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSocket } from '../../../../../../context/SocketContext';

const MessageContainer = () => {
  const scrollRef = useRef(null);
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
    setIsDownloading,
    setFileDownloadProgress,
    directMessagesContacts,
    setIsMessageSent,
    isMessageSent,
  } = useChatStore();
  const { usersData}=useUserStore();
  const videoRef = useRef(null);
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  // Download file function
    const socket = useSocket();

  const downloadFile = async (url) => {
  try {
    setIsDownloading(true);
    setFileDownloadProgress(0);

    const res = await axios.get(url, {
     
      responseType: 'blob', // Important for binary files (PDF, DOCX, etc.)
      onDownloadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setFileDownloadProgress(percentCompleted);
      },
    });
  
 console.log(url);
    // Extract filename from URL or Content-Disposition header
    let filename = url.split('/').pop();
    const contentDisposition = res.headers['content-disposition'];
    
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?(.+?)"?$/);
      if (match) filename = match[1];
    }

    // Create a download link
    const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
    console.log("Blob URL:", blobUrl);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    link.remove();
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
    
    setIsDownloading(false);
    setFileDownloadProgress(0);
    toast.success('Download completed!');
  } catch (error) {
    setIsDownloading(false);
    console.error('Download failed:', error);
    toast.error('Download failed.');
  }
};
  useEffect(() => {
    const updateDirectMessages = () => {
      const msg = selectedChatMessages[selectedChatMessages.length - 1];
      if (!msg || !msg.content) return; // Safety check to ensure msg exists and has content

      useChatStore.setState((state) => {
        const existingContact = state.directMessagesContacts.find(
          (contact) => contact._id === selectedChatData._id
        );

        if (existingContact) {
          // If the contact already exists, update it
          return {
            directMessagesContacts: state.directMessagesContacts.map(
              (contact) =>
                contact._id === selectedChatData._id
                  ? {
                      ...contact,
                      lastMessage: msg.content,
                      messageType: msg.messageType,
                      lastMessageTime: msg.timestamp,
                    }
                  : contact
            ),
          };
        } else if (isMessageSent) {
          // If the contact does not exist, add it only if a new message is sent
          const newContact = {
            _id: selectedChatData._id,
            email: selectedChatData.email,
            name: selectedChatData.name,
            lastMessage: msg.content,
            messageType: msg.messageType,
            lastMessageTime: msg.timestamp,
            profilePic: selectedChatData.profilePic || null,
          };

          return {
            directMessagesContacts: [
              ...state.directMessagesContacts,
              newContact,
            ],
          };
        }

        // Return the existing state if no conditions are met
        return state;
      });
    };

    // Update direct messages only if there are selected chat messages and a new message is sent
    if (selectedChatMessages.length > 0) {
      updateDirectMessages();
    }

    // Reset the isMessageSent flag when selectedChatData changes
    setIsMessageSent(false);
  }, [selectedChatMessages, selectedChatData._id]);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };
console.log(selectedChatData._id);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.post(
          '/api/messages/get-messages',
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        console.log(res);

        if (res.data.messages) {
          setSelectedChatMessages(res.data.messages);
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };
    console.log(selectedChatData);

    // const fetchGroupMessages = async () => {
    //   try {
    //     const res = await apiClient.get(
    //       `${GET_GROUP_MESSAGES_ROUTE}/${selectedChatData._id}`,
    //       { withCredentials: true }
    //     );

    //     if (res.data.messages) {
    //       setSelectedChatMessages(res.data.messages);
    //     }
    //   } catch (err) {
    //     console.error('Failed to fetch messages:', err);
    //   }
    // };
    if (selectedChatData._id) {
      if (selectedChatType === 'contact') {
        fetchMessages();
      } 
      // else if (selectedChatType === 'group') {
      //   fetchGroupMessages();
      // }
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) =>
    /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(filePath);

  const checkIfVideo = (filePath) => {
    const videoExtensions = /\.(mp4|webm|ogg)$/i;
    return videoExtensions.test(filePath);
  };
  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  const formatDate = (timestamp) => {
    const today = moment().startOf('day');
    const messageDate = moment(timestamp);

    if (messageDate.isSame(today, 'day')) {
      return 'Today';
    } else if (messageDate.isSame(today.clone().subtract(1, 'day'), 'day')) {
      return 'Yesterday';
    } else {
      return messageDate.format('LL');
    }
  };

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format('YYYY-MM-DD');
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className='text-center text-gray-500 my-2'>
              {formatDate(message.timestamp)}
            </div>
          )}
          {selectedChatType === 'contact' && renderDMMessages(message)}
          {selectedChatType === 'group' && renderGroupMessages(message)}
        </div>
      );
    });
  };
  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    const updateProgress = () => {
      const { currentTime, duration } = videoElement;
      if (duration > 0) {
        setProgress((currentTime / duration) * 100);
      }
      if (videoElement.ended) {
        setIsPlaying(false);
      }
    };

    videoElement.addEventListener('timeupdate', updateProgress);
    videoElement.addEventListener('loadedmetadata', updateProgress); // Ensure progress is set on load

    videoElement.currentTime = 0; // Reset the current time to the beginning

    return () => {
      videoElement.removeEventListener('timeupdate', updateProgress);
      videoElement.removeEventListener('loadedmetadata', updateProgress);
    };
  }, [videoUrl]);

  // Update video control functions to reset progress and states
  const controlVideo = () => {
    if (videoRef.current) {
      if (videoRef.current.paused || videoRef.current.ended) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  function getFileTypeIcon(fileUrl) {
    const extension = fileUrl.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf />;
      case 'doc':
      case 'docx':
        return <FaFileWord />;
      case 'xls':
      case 'xlsx':
        return <FaFileExcel />;
      case 'zip':
        return <MdFolderZip />;

      default:
        return <FaFile />;
    }
  }
  function getFileSize(fileUrl) {
    return '2.5 MB';
  }
  function getFileExtension(fileUrl) {
    return fileUrl.split('.').pop().toUpperCase();
  }

  const handleProgressClick = (e) => {
    const videoElement = videoRef.current;
    if (!videoElement) eturn;

    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickPosition = e.clientX - left;
    const newTime = (clickPosition / width) * videoElement.duration;
    videoElement.currentTime = newTime;

    setProgress((newTime / videoElement.duration) * 100);
  };

  const renderDMMessages = (message) => {
    const isSentMessage = message.sender !== selectedChatData._id;



    const handleUnsend = async () => {
      if(socket && socket.connected){
        socket.emit('unsendMessage', message._id);    
      }
      else{
        console.error('Socket is not connected');
      }  
    };
    const handleCopy = async () => {
      copyToClipboard(message.content);
    };
    return (
      <div
        className={`mb-2 relative ${
          isSentMessage ? 'text-right' : 'text-left'
        }`}>
        <ContextMenu>
          <ContextMenuTrigger>
            {message.messageType === 'text' && (
              <>
                <div
                  className={`inline-block py-3 px-4 my-2 max-w-[70%] break-words text-left ${
                    isSentMessage
                      ? 'bg-teal-500 text-white border border-teal-600 rounded-br-xl'
                      : 'bg-yellow-100 text-gray-900 border border-yellow-300 rounded-bl-xl'
                  } relative`}>
                  {isValidURL(message.content) ? (
                    <a
                      href={message.content}
                      target='_blank'
                      rel='noopener noreferrer'
                      className=' hover:underline '>
                      {message.content}
                    </a>
                  ) : (
                    <div>{message.content}</div>
                  )}
                </div>
              </>
            )}
            {message.messageType === 'file' && (
              <div
                className={`inline-block p-4 rounded-lg my-1  break-words ${
                  isSentMessage
                    ? 'bg-transparent text-white'
                    : 'bg-transparent text-white'
                } ${
                  checkIfImage(message.fileUrl.url)
                    ? 'max-w-[70%]'
                    : 'max-w-[80%] lg:max-w-[60%] xl:max-w-[40%]'
                }`}>
                {checkIfImage(message.fileUrl.url) ? (
                  <div
                    className='cursor-pointer'
                    onClick={() => {
                      setShowImage(true);
                      setImageUrl(message.fileUrl.url);
                    }}>
                    <img
                      src={`${message.fileUrl.url}`}
                      alt=''
                      height={300}
                      width={300}
                    />
                  </div>
                ) : (
                  <>
                    {checkIfVideo(message.fileUrl.url) ? (
                      <div
                        className='cursor-pointer relative max-h-[60%]'
                        onClick={() => {
                          setShowVideo(true);
                          setIsPlaying(true);
                          setVideoUrl(message.fileUrl.url);
                        }}>
                        <video width='250' className='object-cover h-[350px]'>
                          <source
                            src={`${message.fileUrl.url}`}
                            type={`video/${message.fileUrl.url
                              .split('.')
                              .pop()
                              .toLowerCase()}`}
                          />
                        </video>
                        <FaPlay className='absolute top-[50%] left-[50%]' />
                      </div>
                    ) : (
                      <div
                        className={`flex items-center gap-2 border p-4 text-left ${
                          isSentMessage
                            ? 'bg-teal-500 text-white border border-teal-600 rounded-br-xl'
                            : 'bg-yellow-100 text-gray-900 border border-yellow-300 rounded-bl-xl'
                        } `}>
                        <span className='text-white text-3xl bg-black/20 rounded-full p-3'>
                          <FaFile />
                        </span>
                        <span className='line-clamp-1'>
                          {message.fileUrl.url.split('/').pop()}
                        </span>
                        <span
                          className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
                          onClick={() => downloadFile(message.fileUrl.url)}>
                          <AiOutlineDownload />
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            <div
              className={`text-xs ${
                isSentMessage ? 'text-[#7FA1C3]' : 'text-[#636e72]'
              } mt-1`}>
              {moment(message.timestamp).format('LT')}
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className='w-48'>
            {
              usersData._id === message.sender && (
                            <ContextMenuItem onClick={handleUnsend}>
              <MdUndo className='text-xl' />
              <span>Unsend</span>
            </ContextMenuItem>
              )

            }

            {/* <ContextMenuItem>
              <MdDelete className='text-xl' />
              Delete
            </ContextMenuItem> */}

            {message.messageType === 'file' ? (
              <ContextMenuItem onClick={() => downloadFile(message.fileUrl.url)}>
                <MdSaveAs className='text-xl' />
                Save As
              </ContextMenuItem>
            ) : (
              <ContextMenuItem onClick={handleCopy}>
                <MdCopyAll className='text-xl' />
                Copy
              </ContextMenuItem>
            )}
          </ContextMenuContent>
        </ContextMenu>
      </div>
    );
  };

  const renderGroupMessages = (message) => {
    const isSentMessage = message.sender._id === usersData.id;

    const handleCopy = async () => {
      copyToClipboard(message.content);
    };
    return (
      <div
        className={`container mb-2 relative   ${
          isSentMessage ? 'text-right' : 'text-left'
        }`}>
        <ContextMenu>
          <ContextMenuTrigger>
            {message.messageType === 'text' && (
              <>
                <div
                  className={`inline-block py-3 px-4 my-2 max-w-[70%] break-words text-left ${
                    isSentMessage
                      ? 'bg-teal-500 text-white border border-teal-600 rounded-br-xl'
                      : 'bg-yellow-100 text-gray-900 border border-yellow-300 rounded-bl-xl'
                  } relative`}>
                  {isValidURL(message.content) ? (
                    <a
                      href={message.content}
                      target='_blank'
                      rel='noopener noreferrer'
                      className=' hover:underline '>
                      {message.content}
                    </a>
                  ) : (
                    <div>{message.content}</div>
                  )}
                </div>
              </>
            )}
            {message.messageType === 'file' && (
              <div
                className={`inline-block  rounded-lg my-1  break-words ${
                  isSentMessage
                    ? 'bg-transparent text-white'
                    : 'bg-transparent text-white'
                } ${
                  checkIfImage(message.fileUrl.url)
                    ? 'max-w-[70%]'
                    : 'max-w-[80%] lg:max-w-[60%] xl:max-w-[40%]'
                }`}>
                {checkIfImage(message.fileUrl.url) ? (
                  <div
                    className='cursor-pointer'
                    onClick={() => {
                      setShowImage(true);
                      setImageUrl(message.fileUrl.url);
                    }}>
                    <img
                      src={`${message.fileUrl.url}`}
                      alt=''
                      height={300}
                      width={300}
                    />
                  </div>
                ) : (
                  <>
                    {checkIfVideo(message.fileUrl.url) ? (
                      <div
                        className='cursor-pointer relative max-h-[60%]'
                        onClick={() => {
                          setShowVideo(true);
                          setIsPlaying(true);
                          setVideoUrl(message.fileUrl.url);
                        }}>
                        <video width='400' className='object-cover h-[250px]'>
                          <source
                            src={`${message.fileUrl.url}`}
                            type={`video/${message.fileUrl.url
                              .split('.')
                              .pop()
                              .toLowerCase()}`}
                          />
                        </video>
                        <FaPlay className='absolute top-[50%] left-[50%]' />
                      </div>
                    ) : (
                      <div
                        className={`flex items-center gap-2 border p-4 text-left ${
                          isSentMessage
                            ? 'bg-teal-500 text-white border border-teal-600 rounded-br-xl'
                            : 'bg-yellow-100 text-gray-900 border border-yellow-300 rounded-bl-xl'
                        } `}>
                        <span className='text-white text-3xl bg-black/20 rounded-full p-3'>
                          {getFileTypeIcon(message.fileUrl.url)}
                        </span>
                        <div>
                          <span className='line-clamp-1'>
                            {message.fileUrl.url.split('/').pop()}
                          </span>
                        </div>
                        <span
                          className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
                          onClick={() => downloadFile(message.fileUrl.url)}>
                          <AiOutlineDownload />
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            {isSentMessage ? (
              <div
                className={`text-xs ${
                  isSentMessage ? 'text-[#7FA1C3]' : 'text-[#636e72]'
                } mt-1`}>
                {moment(message.timestamp).format('LT')}
              </div>
            ) : (
              <div className='flex items-center justify-start gap-3'>
                <Avatar className='h-8 w-8 rounded-full overflow-hidden '>
                  {message.sender.image ? (
                    <AvatarImage
                      src={`${message.sender.image}`}
                      alt='profile'
                      className='object-fill h-8 w-8  rounded-full bg-black'
                    />
                  ) : (
                    <div className={`h-8 w-8 `}>
                      <FaUserCircle
                        className={`${getColor(
                          message.sender.color
                        )} h-full w-full rounded-full`}
                      />
                    </div>
                  )}
                </Avatar>
                <div className='text-xs text-gray-500'>
                  {message.sender.fullName.split(' ').shift()}
                </div>
                <div
                  className={`text-xs ${
                    isSentMessage ? 'text-[#7FA1C3]' : 'text-[#636e72]'
                  } mt-1`}>
                  {moment(message.timestamp).format('LT')}
                </div>
              </div>
            )}
          </ContextMenuTrigger>
          <ContextMenuContent className='w-48'>
            <ContextMenuItem>
              <MdUndo className='text-xl' />
              <span>Unsend</span>
            </ContextMenuItem>
            <ContextMenuItem>
              <MdDelete className='text-xl' />
              Delete
            </ContextMenuItem>

            {message.messageType === 'file' ? (
              <ContextMenuItem onClick={() => downloadFile(message.fileUrl.url)}>
                <MdSaveAs className='text-xl' />
                Save As
              </ContextMenuItem>
            ) : (
              <ContextMenuItem onClick={handleCopy}>
                <MdCopyAll className='text-xl' />
                Copy
              </ContextMenuItem>
            )}
          </ContextMenuContent>
        </ContextMenu>
      </div>
    );
  };
  return (
    <div className='flex flex-col flex-1 overflow-y-auto p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full scrollbar-hide scrollbar-thin '>
      {renderMessages()}
      <div ref={scrollRef}></div>
      {showImage && (
        <div className='fixed z-[9] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col transition-opacity duration-500'>
          <div>
            <img
              src={`${imageUrl}`}
              alt='image'
              className='h-[80vh] w-full bg-cover'
            />
          </div>
          <div className='flex gap-5 fixed top-0 mt-5'>
            <button
              className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
              onClick={() => downloadFile(imageUrl)}
              title='download'>
              <AiOutlineDownload />
            </button>
            <button
              className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
              onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}
              title='close'>
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
     {
  showVideo && (
    <div className='fixed z-[9] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col transition-opacity duration-500'>
      <div className='relative group cursor-pointer'>
        <video
          ref={videoRef}
          autoPlay
          muted={isMuted}
          className='h-[500px] w-full'
          onClick={controlVideo}
          onError={(e) => {
            console.error("Video error:", e.target.error);
            toast.error("Failed to load video.");
          }}
        >
          <source
            src={videoUrl}
            type={`video/${videoUrl.split('.').pop().toLowerCase()}`}
          />
          Your browser does not support the video tag.
        </video>

        {/* Play/Pause and Mute buttons */}
        <div className='absolute top-4 right-4 flex space-x-4'>
          <button onClick={controlVideo} title={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? (
              <FaPause className='text-white text-2xl' />
            ) : (
              <FaPlay className='text-white text-2xl' />
            )}
          </button>
          <button onClick={(e) => handleMute(e)} title={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted ? (
              <FaVolumeMute className='text-white text-2xl' />
            ) : (
              <FaVolumeUp className='text-white text-2xl' />
            )}
          </button>
        </div>

        {/* Progress bar */}
        <div
          className='absolute bottom-0 left-0 w-full h-2 bg-gray-700 cursor-pointer'
          onClick={handleProgressClick}
        >
          <div
            className='h-full bg-blue-500'
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className='flex gap-5 fixed top-0 mt-5'>
        <button
          className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
          onClick={() => downloadFile(videoUrl)}
          title='Download'
        >
          <AiOutlineDownload />
        </button>
        <button
          className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
          onClick={() => {
            setShowVideo(false);
            setVideoUrl(null);
            setIsPlaying(false);
            setIsMuted(false);
          }}
          title='Close'
        >
          <IoCloseSharp />
        </button>
      </div>
    </div>
  )}
    </div>
  );
};

export default MessageContainer;
