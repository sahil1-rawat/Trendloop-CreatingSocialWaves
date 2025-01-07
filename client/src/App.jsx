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
import { useUserStore } from '../store/index.jsx';
import axios from 'axios';
import NavigationBar from './components/NavigationBar.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';
import Reels from './pages/Reels.jsx';

const App = () => {
  const { isAuth, setUsersData, setIsAuth } = useUserStore();
  const [loading, setLoading] = useState(true);
  async function fetchUser() {
    try {
      const { data } = await axios.get('/api/user/me', {
        withCredentials: true,
      });

      setUsersData(data);
      setIsAuth(true);
    } catch (error) {
      console.log(error.message);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-100'>
        <div className='w-16 h-16 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent'></div>
      </div>
    );
  }

  return (
    <Router>
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
      navigate('/');
    }
  }, [isAuth, navigate]);

  return isAuth ? null : <Component />;
};

export default App;
