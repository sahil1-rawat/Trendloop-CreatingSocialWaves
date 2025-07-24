import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useChatStore, useUserStore } from '../../store';

const SocketContext = createContext(null);
const HOST = 'http://localhost:7000'; // update if using deployed server

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const {
    setOnlineStatus,
    setOnlineStatuses,
    addMessage,
    selectedChatMessages,
    setSelectedChatMessages,
    selectedChatData,
    selectedChatType,
    addGroupInGroupList
  } = useChatStore();
  const { usersData } = useUserStore();

  useEffect(() => {
    if (!usersData?._id) return;

    socket.current = io(HOST, {
      withCredentials: true,
      query: { userId: usersData._id },
    });

    socket.current.on('connect', () => {
      console.log('Connected to socket server');
    });

    const handleReceiveMessage = (message) => {
      const { selectedChatData, selectedChatType } = useChatStore.getState();
      if (
        selectedChatType &&
        (selectedChatData._id === message.sender._id ||
          selectedChatData._id === message.recipient._id ||
          usersData._id === message.sender._id)
      ) {
        addMessage(message);
      }
    };

    const handleReceiveGroupMessage = (message) => {
      const {
        selectedChatData,
        selectedChatType,
        addMessage,
        addGroupInGroupList,
      } = useChatStore.getState();
      if (selectedChatType && selectedChatData._id === message.groupId) {
        addMessage(message);
      }
      addGroupInGroupList(message);
    };

    const handleUserStatusChange = ({ userId, status }) => {
      setOnlineStatus(userId, status === 'online');
    };

    const handleMultipleUserStatusChange = (statuses) => {
      setOnlineStatuses(statuses);
    };

    const handleUnsendMessage = ({ messageId }) => {
      const { selectedChatMessages, setSelectedChatMessages } = useChatStore.getState();
      const updatedMessages = selectedChatMessages.filter(
        (m) => m._id !== messageId
      );
      setSelectedChatMessages(updatedMessages);
    };

    socket.current.on('receiveMessage', handleReceiveMessage);
    socket.current.on('receive-group-message', handleReceiveGroupMessage);
    socket.current.on('senderMessage', handleReceiveMessage);
    socket.current.on('messageUnsent', handleUnsendMessage); // properly handle unsend
    socket.current.on('unsendError', ({ messageId, error }) => {
  console.error(`Failed to unsend message ${messageId}:`, error);
});
    socket.current.on('userStatusChange', handleUserStatusChange);
    socket.current.on('multipleUserStatusChange', handleMultipleUserStatusChange);

    return () => {
      socket.current.disconnect();
    };
  }, [usersData]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
