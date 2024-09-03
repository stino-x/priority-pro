// src/store/useAuthStore.js
import {create} from 'zustand';
import { logoutAccount } from '../actions/user.action';

const useLogoutStore = create((set) => ({
  isLoggedIn: true,
  logout: async () => {
    const loggedOut = await logoutAccount();
    if (loggedOut) {
      set({ isLoggedIn: false });
    }
    return loggedOut;
  },
}));

export default useLogoutStore;
