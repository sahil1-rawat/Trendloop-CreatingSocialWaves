import React, { useEffect, useRef, useState } from 'react';
import { AiOutlinePaperClip, AiOutlineSend } from 'react-icons/ai';
import { RiEmojiStickerFill } from 'react-icons/ri';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useChatStore, useUserStore } from '../../../../../../../store';
import { useSocket } from '@/context/SocketContext';
import axios from 'axios';
import { BASE_URL } from '../../../../../../../common';

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const textareaRef = useRef(null);
    const socket = useSocket();

   const {
selectedChatType,
    selectedChatData,
    setDirectMessgesContacts,
    setIsUploading,
    setFileUploadProgress,
    isMessageSent,
    setIsMessageSent,
    selectedChatMessages,
  } = useChatStore();
  const {usersData}=useUserStore();

  const [message, setMessage] = useState('');
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
const lastTranscriptRef = useRef('');

  const {
    transcript,
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

useEffect(() => {
  if (finalTranscript && finalTranscript.trim() !== '') {
    setMessage((prevMessage) => {
      return `${prevMessage} ${finalTranscript}`.trim();
    });

    SpeechRecognition.stopListening();
    resetTranscript();
  }
}, [finalTranscript]);




  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddEmoji = (emoji) => {
    if (emojiPickerOpen) {
      setMessage((msg) => msg + emoji.emoji);
    }
  };
  const handleSendMessage = async () => {
    if (message.trim() !== '') {
      if (selectedChatType === 'contact') {
        socket.emit('sendMessage', {
          sender: usersData._id,
          content: message,
          recipient: selectedChatData._id,
          messageType: 'text',
          fileUrl: undefined,
        });
              setMessage('');
      resetTranscript();
        setIsMessageSent(true);
      } else if (selectedChatType === 'group') {
        socket.emit('send-group-message', {
          sender: usersData._id,
          content: message,
          messageType: 'text',
          fileUrl: undefined,
          groupId: selectedChatData._id,
        });
      }

    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();

    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 3 * 24)}px`;
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleAttachmentChange = async (event) => {
  try {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      setIsUploading(true);

      const res = await axios.post(`${BASE_URL}/api/messages/upload-file`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (data) => {
          setFileUploadProgress(
            Math.floor((data.loaded * 100) / data.total)
          );
        },
      });

      if (res.status === 200 && res.data) {
        const { filePath, id } = res.data;

        setIsUploading(false);

        const fileUrl = {
          id,
          url: filePath,
        };

        const messagePayload = {
          sender: usersData._id,
          content: undefined,
          messageType: 'file',
          fileUrl,
        };

        if (selectedChatType === 'contact') {
          messagePayload.recipient = selectedChatData._id;
          socket.emit('sendMessage', messagePayload);
        } else if (selectedChatType === 'group') {
          messagePayload.groupId = selectedChatData._id;
          socket.emit('send-group-message', messagePayload);
        }

        setIsMessageSent(true);
      }
    }
  } catch (err) {
    setIsUploading(false);
    setIsMessageSent(false);
    //console.log(err);
  }
};

  const handleEmojiButtonClick = () => {
    setEmojiPickerOpen((prev) => !prev);
  };


  return (
    <div className='h-[10vh] min-h-[70px] bg-[#1c1d25] flex items-center justify-between px-4 sm:px-8 mb-6 gap-2 sm:gap-6'>
      <div className='flex-1 flex bg-[#2a2b33] rounded-md items-center gap-2 sm:gap-5 pr-2 sm:pr-5'>
        <textarea
          ref={textareaRef}
          className='flex-1 p-2 sm:p-5 bg-transparent rounded-md text-[17px] sm:text-xl focus:border-none outline-none resize-none overflow-y-hidden'
          placeholder='Type a message'
          value={message}
          autoComplete='off'
          rows={1}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          style={{ lineHeight: '24px' }}
        />
        <button
          className='text-white hover:text-gray-400 focus:outline-none transition-all'
          onClick={handleAttachmentClick}>
          <AiOutlinePaperClip className='text-lg sm:text-2xl' />
        </button>
        <input
          type='file'
          className='hidden'
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
        <div className='flex items-center gap-2 relative'>
          {/* Emoji Picker */}
          <button
            className='text-white hover:text-gray-400 focus:outline-none transition-all'
            onClick={handleEmojiButtonClick}>
            <RiEmojiStickerFill className='text-lg sm:text-2xl' />
          </button>
          <div
            className={`absolute bottom-16 right-10 emoji-picker-container ${
              emojiPickerOpen ? 'open' : 'hidden'
            }`}
            ref={emojiRef}>
            <EmojiPicker
              theme='dark'
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>

          {/* Microphone */}
          <button
            onClick={() =>
              listening
                ? SpeechRecognition.stopListening()
                : SpeechRecognition.startListening({ continuous: true, language: 'hi-IN' })
            }
            className={`text-white hover:text-gray-400 focus:outline-none transition-all ${
              listening ? 'text-red-500 animate-pulse' : ''
            }`}>
            {listening ? (
              <FaMicrophoneSlash className='text-lg sm:text-2xl' />
            ) : (
              <FaMicrophone className='text-lg sm:text-2xl' />
            )}
          </button>
        </div>
      </div>

      <button
        className='bg-[#0984e3] hover:bg-[#2f87cb] rounded-md flex items-center justify-center p-3 sm:p-5 focus:outline-none transition-all'
        onClick={handleSendMessage}>
        <AiOutlineSend className='text-lg sm:text-2xl' />
      </button>
    </div>
  );
};

export default MessageBar;
