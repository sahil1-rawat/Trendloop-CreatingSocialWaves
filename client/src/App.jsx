import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Account from './pages/Account.jsx';
import Reels from './pages/Reels.jsx';
import UserAccount from './components/UserAccount.jsx';
import NewPost from './components/NewPost.jsx';
import NewReel from './components/NewReel.jsx';
import SharePost from './components/SharePost.jsx';
import Header from './components/Header.jsx';
import NavigationBar from './components/NavigationBar.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';

import { useUserStore } from '../store/index.jsx';
import { fetchUser } from './utills/FetchPost.js';
import Chat from './pages/Chat.jsx';
import AdminDashboard from './pages/AdminDashBoard.jsx';
import AdminUsersPage from './components/AdminUser.jsx';
import AdminPostsPage from './components/AdminPost.jsx';

// import { SocketData } from './context/SocketContext.jsx';

const App = () => {
  const { isAuth, setUsersData, setIsAuth, setIsLoading, usersData } =
    useUserStore();

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuth');
    if (storedAuth === 'true') {
      setIsAuth(true);
      fetchUser({ setUsersData, setIsAuth });
    } else {
      setIsAuth(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  
  return (
    <div>
      <Router>
        {isAuth && <Header />}
        <Routes>
          {
usersData && usersData.isAdmin? <Route
            path='/'
            element={
              <PrivateRoute isAuth={isAuth} redirectPath='/login'>
                <AdminDashboard />
              </PrivateRoute>
            }
          />:<Route
            path='/'
            element={
              <PrivateRoute isAuth={isAuth} redirectPath='/login'>
                <Home />
              </PrivateRoute>
            }
          />
          }

          <Route
            path='/admin-dashboard'
            element={
              <PrivateRoute isAuth={isAuth} redirectPath='/login'>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {
            usersData && usersData.isAdmin ? <Route
            path='/users'
            element={
              <PrivateRoute isAuth={isAuth} redirectPath='/login'>
                <AdminUsersPage />
              </PrivateRoute>
            }
          />
             : <Route
            path='/reels'
            element={
              <PrivateRoute isAuth={isAuth} redirectPath='/login'>
                <Reels />
              </PrivateRoute>
            }
          />
          }
          {
            usersData && usersData.isAdmin ? null : <>
            <Route
            path='/new-post'
            element={
              <PrivateRoute isAuth={isAuth} redirectPath='/login'>
                <NewPost />
              </PrivateRoute>
            }
          />
          <Route
            path='/new-reel'
            element={
              <PrivateRoute isAuth={isAuth} redirectPath='/login'>
                <NewReel />
              </PrivateRoute>
            }
          />
            </>
          }
          
          <Route
            path='/account'
            element={
              <PrivateRoute isAuth={isAuth} redirectPath='/login'>
                <Account />
              </PrivateRoute>
            }
          />
          {
            usersData && usersData.isAdmin ?  <Route
            path='/manage-posts'
            element={
              <PrivateRoute isAuth={isAuth} redirectPath='/login'>
                <AdminPostsPage />
              </PrivateRoute>
            }
          /> : 
             <Route
            path='/chat'
            element={
              <PrivateRoute isAuth={isAuth} redirectPath='/login'>
                <Chat />
              </PrivateRoute>
            }
          />
          }
           
          {
            usersData && usersData.isAdmin ? null : <>
             <Route
            path='/user/:id'
            element={
              <PrivateRoute isAuth={isAuth} redirectPath='/login'>
                <UserAccount />
              </PrivateRoute>
            }
          />
          <Route
            path='/post/:id'
            element={
              <PrivateRoute isAuth={isAuth} redirectPath='/login'>
                <SharePost />
              </PrivateRoute>
            }
          />
            </>
          }
         
          <Route
            path='/login'
            element={
              <RedirectToHome isAuth={isAuth}>
                <Login />
              </RedirectToHome>
            }
          />
          <Route
            path='/register'
            element={
              <RedirectToHome isAuth={isAuth}>
                <Register />
              </RedirectToHome>
            }
          />
          <Route
            path='*'
            element={
              <PrivateRoute isAuth={isAuth} redirectPath='/login'>
                <NotFoundPage />
              </PrivateRoute>
            }
          />
        </Routes>
        {isAuth && <NavigationBar />}
      </Router>
    </div>
  );
};

const PrivateRoute = ({ isAuth, redirectPath = '/login', children }) => {
  const navigate = useNavigate();
  const { isLoading } = useUserStore();

  useEffect(() => {
    if (!isAuth && !isLoading) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuth, isLoading, navigate, redirectPath]);

  return isAuth ? children : null;
};

const RedirectToHome = ({ isAuth, children }) => {
  const navigate = useNavigate();
  const { pathName } = useUserStore();

  useEffect(() => {
    if (isAuth) {
      navigate(
        `${pathName !== '/login' && pathName !== '/register' ? pathName : '/'}`
      );
    }
  }, [isAuth, navigate, pathName]);

  return isAuth ? null : children;
};

export default App;
