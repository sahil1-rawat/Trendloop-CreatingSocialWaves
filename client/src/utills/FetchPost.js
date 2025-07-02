import axios from 'axios';
import toast from 'react-hot-toast';

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
    const res = await axios.get('/api/post/all', {
      withCredentials: true,
    });

    if (res.status === 200) {
      console.log('response Data', res.data);
      setPosts(res.data.posts);
      setReels(res.data.reels);
      // setIsLoading(false);
    }
  } catch (err) {
    console.error('Failed to fetch posts:', err);
  } finally {
    setIsLoading(false);
  }
};

export const fetchUsers = async ({ setUser, params }) => {
  try {
    const res = await axios.get(`/api/user/${params.id}`);
    if (res.status === 200) {
      setUser(res.data);
    }
  } catch (err) {
    console.log(err);
  }
};

export const fetchUser = async ({ setUsersData, setIsAuth }) => {
  try {
    const res = await axios.get('/api/user/me', {
      withCredentials: true,
    });

    if (res.status === 200) {
      setUsersData(res.data);
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  } catch (error) {
    console.log(error.message);
    setIsAuth(false);
  }
};
export const sharePost = async ({ setValue, setType, params }) => {
  try {
    const res = await axios.post(`/api/post/share/${params.id}`, {
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
