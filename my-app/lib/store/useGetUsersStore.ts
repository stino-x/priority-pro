import { create } from 'zustand';
import { createAdminClient } from '../appwrite';
import { Query } from 'appwrite';

const useGetUsersStore = create((set) => ({
    users: [], // You could type this based on the user structure if needed
    getUsers: async () => {
        try {
            const { database, account } = await createAdminClient();

            // Get the current user
            const currentUser = await account.get();
            const clientId = currentUser.$id;

            // Query to fetch the current user document
            const user = await database.listDocuments(
                `${process.env.NEXT_PUBLIC_DATABASE_ID}`,
                `${process.env.NEXT_PUBLIC_USER_COLLECTION_ID}`,
                [
                    Query.equal('$id', clientId)
                ]
            );

            if (user.documents.length === 0) {
                throw new Error('User not found');
            }

            // Extract restaurant ID from the user document
            const restaurantId = user.documents[0].restaurant.$id;

            // Fetch all users related to the same restaurant
            const users = await database.listDocuments(
                `${process.env.NEXT_PUBLIC_DATABASE_ID}`,
                `${process.env.NEXT_PUBLIC_USER_COLLECTION_ID}`,
                [
                    Query.equal('restaurant.$id', restaurantId)
                ]
            );

            // Update Zustand state with the fetched users
            set({ users: users.documents });

        } catch (error) {
            console.error('Error fetching users:', error);
        }
    },
}));

export default useGetUsersStore;
