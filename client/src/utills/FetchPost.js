import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_URL } from '../../common';

export const fetchPosts = async ({
  setPosts,
  setReels,
  setIsLoading,
  isAuth,
}) => {
  if (!isAuth) {
    setIsLoading(true);
  }
  try {
    const res = await axios.get(`${import.meta.env.VITE_SOCKET_URL}/api/post/all`, {
      withCredentials: true,
    });
    if (res.status === 200) {
      //console.log('response Data', res.data);
      setPosts(res.data.posts);
      setReels(res.data.reels);
      // setIsLoading(false);
    }
   
  } catch (err) {
     if (err.response?.status === 403 && err.response.data.message === 'User is banned') {
       toast.dismiss();
        toast.error('Your account has been banned.');
        localStorage.clear();
      }
    console.error('Failed to fetch posts:', err);
  } finally {
    setIsLoading(false);
  }
};

export const fetchUsers = async ({ setUser, params }) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_SOCKET_URL}/api/user/${params.id}`,
      {
        withCredentials: true,

        }


    );
    if (res.status === 200) {
      setUser(res.data);
    }
  } catch (err) {
    if (err.response?.status === 403 && err.response.data.message === 'User is banned') {
        toast.error('Your account has been banned.');
        toast.dismiss();
  
      }
    //console.log(err);
  }
};

export const fetchUser = async ({ setUsersData, setIsAuth }) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_SOCKET_URL}/api/user/me`, {
      withCredentials: true,
    });

    if (res.status === 200) {
      setUsersData(res.data);
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
   
  } catch (error) {
    if (error.response?.status === 403 && error.response.data.message === 'User is banned') {
      toast.dismiss();
        toast.error('Your account has been banned.');
        localStorage.clear();
        window.location.href = '/login';
  
      }
    setIsAuth(false);
  }
};
export const sharePost = async ({ setValue, setType, params }) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_SOCKET_URL}/api/post/share/${params.id}`,
      {},
      {
      withCredentials: true,
    });

    if (res.status === 200) {
      setValue(res.data.post);
      setType(res.data.post.type);
    }
  } catch (e) {
    toast.dismiss();
    toast.error(e.response.data.message);
  }
};
