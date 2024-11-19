// src/store/useAuthStore.js
import {create} from 'zustand';
import { logoutAccount } from '../actions/user.action';

const useLogoutStore = create((set) => ({
  isLoggedIn: true,
  logout: async () => {
    try {
      const loggedOut = await logoutAccount();
      if (loggedOut) {
        set({ isLoggedIn: false });
      }
      return loggedOut;
    } catch (error) {
      console.error("Logout failed in store:", error);
      throw error;
    }
  },  
}));

export default useLogoutStore;
