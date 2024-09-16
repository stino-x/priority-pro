// Zustand store
import { create } from "zustand";

// Zustand store definition
const useStore = create((set) => ({
  bears: 0,
  restaurants: [], // Add restaurants to the store
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears })),
  setRestaurants: (newRestaurants) => set({ restaurants: newRestaurants }), // Action to update restaurants
}));

// Function to get restaurants from Appwrite database and update the Zustand store
import { createAdminClient } from "./appwrite"; // Assuming appwrite.ts is in the same directory
import { parseStringify } from "../../lib/utils"; // Assuming parseStringify is in the utils directory

const {
  NEXT_PUBLIC_DATABASE_ID: DATABASE_ID,
  NEXT_PUBLIC_RESTAURANT_COLLECTION_ID: RESTAURANT_COLLECTION_ID,
} = process.env;

export const getAccount = async () => {
  try {
    // Get the admin client which includes the database
    const { database } = await createAdminClient();

    // Fetch all restaurant documents from the Appwrite database
    const restaurants = await database.listDocuments(
      DATABASE_ID!,
      RESTAURANT_COLLECTION_ID!
    );

    // Parse the response to ensure it's JSON compatible
    const parsedRestaurants = parseStringify(restaurants);

    // Update Zustand store with fetched restaurants
    const { setRestaurants } = useStore.getState(); // Access Zustand's action to set restaurants
    setRestaurants(parsedRestaurants.documents); // Pass the documents to update the store

    return parsedRestaurants; // Return restaurants as well
  } catch (error) {
    console.error("Error fetching the Appwrite database:", error);
    return null;
  }
};
