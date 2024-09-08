import {create} from 'zustand';
import { createAdminClient } from '../appwrite';


const useRestaurantStore = create((set) => ({
    Restaurants: [],
    getRestaurants: async () => {
        try {
            const adminClient = await createAdminClient();
            const database = adminClient.database;
            const Restaurants = await database.listDocuments(`${process.env.NEXT_PUBLIC_DATABASE_ID}`, `${process.env.NEXT_PUBLIC_RESTAURANT_COLLECTION_ID}`);
            set({ Restaurants: Restaurants.documents });
        } catch (error) {
            console.error('Error fetching Restaurants:', error);
        }
    },
}))

export default useRestaurantStore;