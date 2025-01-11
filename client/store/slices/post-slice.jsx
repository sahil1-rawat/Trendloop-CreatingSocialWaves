export const createPostSlice = (set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  reels: [],
  setReels: (reels) => set({ reels }),
  tab: window.location.pathname,
  setTab: (tab) => set({ tab }),
  isMuted: false,
  setIsMuted: (isMuted) => set({ isMuted }),
  user: '',
  setUser: (user) => set({ user }),
});
