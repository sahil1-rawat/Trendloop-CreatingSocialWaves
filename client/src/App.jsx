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

const pathName = window.location.pathname;
console.log(pathName);

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
