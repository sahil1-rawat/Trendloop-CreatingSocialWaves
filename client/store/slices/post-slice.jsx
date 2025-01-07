export const createPostSlice = (set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  reels: [],
  setReels: (reels) => set({ reels }),
});
