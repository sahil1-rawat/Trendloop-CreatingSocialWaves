export const createChatSlice = (set) => ({
  chats: [],
  setChats: (chats) => set({ chats }),
  selectedChat: null,
  setSelectedChat: (selectedChat) => set({ selectedChat }),
});
