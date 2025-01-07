export const createAuthSlice = (set) => ({
  isAuth: false,
  setIsAuth: (isAuth) => set({ isAuth }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
  usersData: [],
  setUsersData: (usersData) => set({ usersData }),
});
