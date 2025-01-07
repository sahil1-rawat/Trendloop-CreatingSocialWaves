import { create } from 'zustand';
import { createAuthSlice } from './slices/auth-slice';
import { createPostSlice } from './slices/post-slice';
export const useUserStore = create()((...a) => ({
  ...createAuthSlice(...a),
}));
export const usePostStore = create()((...a) => ({
  ...createPostSlice(...a),
}));
