import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useUserStore } from '../../store';

const EndPoint = 'https://trendloop.onrender.com';

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { usersData } = useUserStore();
  useEffect(() => {
    const socket = io(EndPoint, {
      query: {
        userId: usersData?._id,
      },
    });

    setSocket(socket);

    socket.on('getOnlineUser', (users) => {
      setOnlineUsers(users);
    });

    return () => socket && socket.close();
  }, [usersData?._id]);
  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const SocketData = () => useContext(SocketContext);
