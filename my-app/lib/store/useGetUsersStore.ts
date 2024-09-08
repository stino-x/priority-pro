import {create} from 'zustand';
import { createAdminClient } from '../appwrite';


const useGetUsersStore = create((set) => ({
    users: [],
    getUsers: async () => {
        try {
            const adminClient = await createAdminClient();
            const database = adminClient.database;
            const users = await database.listDocuments(`${process.env.NEXT_PUBLIC_DATABASE_ID}`, `${process.env.NEXT_PUBLIC_USER_COLLECTION_ID}`);
            set({ users: users.documents });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    },
}))

export default useGetUsersStore;