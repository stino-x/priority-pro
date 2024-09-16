import {create} from 'zustand';
import { createAdminClient } from '../appwrite';

const {
    NEXT_PUBLIC_DATABASE_ID: DATABASE_ID,
    NEXT_PUBLIC_RESTAURANT_COLLECTION_ID: RESTAURANT_COLLECTION_ID,
  } = process.env;

const useRestaurantStore = create((set) => ({
    Restaurants: [],
    getRestaurants: async () => {
        try {
            // const adminClient = await createAdminClient();
            const { database } = await createAdminClient();
            const Restaurants = await database.listDocuments(
                DATABASE_ID!,
                RESTAURANT_COLLECTION_ID!);
            set({ Restaurants: Restaurants.documents });
            return Restaurants.documents;
        } catch (error) {
            console.error('Error fetching Restaurants:', error);
        }
    },
}))

export default useRestaurantStore;