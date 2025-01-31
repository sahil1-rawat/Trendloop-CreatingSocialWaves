import { useEffect, useState } from 'react';
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
import { usePostStore, useUserStore } from '../store/index.jsx';
import axios from 'axios';
import NavigationBar from './components/NavigationBar.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';
import Reels from './pages/Reels.jsx';
import Header from './components/Header.jsx';
import UserAccount from './components/UserAccount.jsx';
import { fetchUser } from './utills/FetchPost.js';
import NewPost from './components/NewPost.jsx';
import SearchUser from './components/SearchUser.jsx';
import NewReel from './components/NewReel.jsx';
import SharePost from './components/SharePost';

const pathName = window.location.pathname;

const App = () => {
  const { isAuth, setUsersData, setIsAuth, setIsLoading, isLoading } =
    useUserStore();

  useEffect(() => {
    fetchUser({ setUsersData, setIsAuth });
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
          <Route
            path='/'
            element={
              <PrivateRoute
                isAuth={isAuth}
                redirectPath='/login'
                Component={Home}
              />
            }
          />
          <Route
            path='/reels'
            element={
              <PrivateRoute
                isAuth={isAuth}
                redirectPath='/login'
                Component={Reels}
              />
            }
          />
          <Route
            path='/search'
            element={
              <PrivateRoute
                isAuth={isAuth}
                redirectPath='/login'
                Component={SearchUser}
              />
            }
          />
          <Route
            path='/new-post'
            element={
              <PrivateRoute
                isAuth={isAuth}
                redirectPath='/login'
                Component={NewPost}
              />
            }
          />
          <Route
            path='/new-reel'
            element={
              <PrivateRoute
                isAuth={isAuth}
                redirectPath='/login'
                Component={NewReel}
              />
            }
          />

          <Route
            path='/account'
            element={
              <PrivateRoute
                isAuth={isAuth}
                redirectPath='/login'
                Component={Account}
              />
            }
          />
          <Route
            path='/user/:id'
            element={
              <PrivateRoute
                isAuth={isAuth}
                redirectPath='/login'
                Component={UserAccount}
              />
            }
          />
          <Route
            path='/post/:id'
            element={
              <PrivateRoute
                isAuth={isAuth}
                redirectPath='/login'
                Component={SharePost}
              />
            }
          />

          <Route
            path='/login'
            element={<RedirectToHome isAuth={isAuth} Component={Login} />}
          />
          <Route
            path='/register'
            element={<RedirectToHome isAuth={isAuth} Component={Register} />}
          />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
        {isAuth && <NavigationBar />}
      </Router>
    </div>
  );
};

const PrivateRoute = ({ isAuth, redirectPath, Component }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate(redirectPath);
    }
  }, [isAuth, navigate, redirectPath]);

  return isAuth ? <Component /> : null;
};

const RedirectToHome = ({ isAuth, Component }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      navigate(
        `${pathName !== '/login' && pathName !== '/register' ? pathName : '/'}`
      );
    }
  }, [isAuth, navigate]);

  return isAuth ? null : <Component />;
};

export default App;
