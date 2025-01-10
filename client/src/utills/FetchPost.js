import axios from 'axios';

export const fetchPosts = async ({ setPosts, setReels, setIsLoading }) => {
  try {
    const res = await axios.get('/api/post/all', {
      withCredentials: true,
    });
    console.log(res.data);

    if (res.status === 200) {
      setPosts(res.data.posts);
      setReels(res.data.reels);
    }
  } catch (err) {
    console.error('Failed to fetch posts:', err);
  } finally {
    setIsLoading(false);
  }
};
