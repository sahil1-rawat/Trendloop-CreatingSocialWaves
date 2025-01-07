import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Toaster } from 'react-hot-toast';
// import { UserContextProvider } from './context/userContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <UserContextProvider> */}
    <App />
    <Toaster />
    {/* </UserContextProvider> */}
  </StrictMode>
);
