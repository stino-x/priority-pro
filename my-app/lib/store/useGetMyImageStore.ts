// src/store/useGetMyImageStore.js
import { create } from 'zustand';
import { getLoggedInUser, getUserInfo } from '../actions/user.action';
import { createAdminClient } from '../appwrite';

const {
    NEXT_PUBLIC_DATABASE_ID: DATABASE_ID,
    NEXT_PUBLIC_USER_COLLECTION_ID: USER_COLLECTION_ID,
    NEXT_PUBLIC_RESTAURANT_COLLECTION_ID: RESTAURANT_COLLECTION_ID,
    NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
  } = process.env;

const useGetMyImageStore = create((set) => ({
  imageSrc: null,
  loading: false,
  error: null,

  fetchAvatar: async () => {
    set({ loading: true, error: null });
    try {
      const { storage } = await createAdminClient();
      const userInfo = await getLoggedInUser();
      
      if (userInfo && userInfo.picture_id) {
        const fileURL = storage.getFileView(`${BUCKET_ID}`, userInfo.picture_id).toString();
        set({ imageSrc: fileURL, loading: false });
      } else {
        throw new Error("User avatar not found.");
      }
    } catch (error) {
      console.error("Error fetching avatar:", error);
      set({ error: "Failed to load avatar", loading: false });
    }
  },
}));

export default useGetMyImageStore;
