export const createAuthSlice = (set) => ({
  isAuth: false,
  setIsAuth: (isAuth) => set({ isAuth }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
  addLoading: false,
  setAddLoading: (addLoading) => set({ addLoading }),
  usersData: [],
  setUsersData: (usersData) => set({ usersData }),
  pathName: window.location.pathname,
  setPathName: (pathName) => set({ pathName }),
});
