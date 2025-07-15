import EmojiPicker from 'emoji-picker-react';
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlinePaperClip, AiOutlineSend } from 'react-icons/ai';
import { RiEmojiStickerFill } from 'react-icons/ri';

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();

  const [message, setMessage] = useState('');
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const textareaRef = useRef(null);

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
          sender: userInfo.id,
          content: message,
          recipient: selectedChatData._id,
          messageType: 'text',
          fileUrl: undefined,
        });
        setIsMessageSent(true);
      } else if (selectedChatType === 'group') {
        socket.emit('send-group-message', {
          sender: userInfo.id,
          content: message,
          messageType: 'text',
          fileUrl: undefined,
          groupId: selectedChatData._id,
        });
      }

      setMessage('');
    }
  };

  const handleEmojiButtonClick = () => {
    setEmojiPickerOpen((prev) => !prev);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    // Dynamically adjust the height of the textarea based on content
    const textarea = textareaRef.current;
    textarea.style.height = 'auto'; // Reset the height first
    textarea.style.height = `${Math.min(textarea.scrollHeight, 3 * 24)}px`; // Limit height to 3 rows
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  /* const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        setIsUploading(true);
        const res = await apiClient.post(UPLOAD_FILES_ROUTE, formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (data) => {
            setFileUploadProgress(
              Math.floor(Math.round(100 * data.loaded) / data.total)
            );
          },
        });

        if (res.status === 200 && res.data) {
          setIsUploading(false);
          if (selectedChatType === 'contact') {
            socket.emit('sendMessage', {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: 'file',
              fileUrl: res.data.filePath,
            });
            setIsMessageSent(true);
          } else if (selectedChatType === 'group') {
            socket.emit('send-group-message', {
              sender: userInfo.id,
              content: undefined,
              messageType: 'file',
              fileUrl: res.data.filePath,
              groupId: selectedChatData._id,
            });
            setIsMessageSent(true);
          }
        }
      }

      // console.log(file);
    } catch (err) {
      setIsUploading(false);
      setIsMessageSent(false);
      console.log(err);
    }
  }; */
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
          //   onChange={handleAttachmentChange}
        />
        <div className='relative'>
          <button
            className='text-white hover:text-gray-400 focus:outline-none transition-all'
            onClick={handleEmojiButtonClick}>
            <RiEmojiStickerFill className='text-lg sm:text-2xl' />
          </button>
          <div
            className={`absolute bottom-16 right-0 emoji-picker-container ${
              emojiPickerOpen ? 'open' : 'hidden'
            }`}
            ref={emojiRef}>
            <EmojiPicker
              theme='dark'
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
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
