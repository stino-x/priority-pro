// src/hooks/useGetMyImage.js
import useGetMyImageStore from '../store/useGetMyImageStore';

interface GetMyImageStore {
  imageSrc: string;
  loading: boolean;
  error: string | null;
  fetchAvatar: () => void;
}

const useGetMyImage = () => {
  const { imageSrc, loading, error, fetchAvatar } = useGetMyImageStore() as GetMyImageStore;

  // Trigger fetching the image if it hasn't been loaded yet
  if (!imageSrc) {
    fetchAvatar();
  }

  return { imageSrc, loading, error };
};

export default useGetMyImage;
