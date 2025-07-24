import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Toaster } from 'react-hot-toast';
import {  SocketProvider } from './context/SocketContext.jsx';
// import { UserContextProvider } from './context/userContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <UserContextProvider> */}
    <SocketProvider>
      <App />
      <Toaster />
      {/* </UserContextProvider> */}
    </SocketProvider>
  </StrictMode>
);
