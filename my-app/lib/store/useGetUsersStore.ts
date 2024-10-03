import { create } from 'zustand';
import { createAdminClient } from '../appwrite';
import { Query } from 'appwrite';
import { fetchUsers } from '../actions/user.action';

const useGetUsersStore = create((set) => ({
    users: [], // You could type this based on the user structure if needed
    getUsers: async () => {
        const Users  = await fetchUsers()
        set({ users: Users });
    },
}));

export default useGetUsersStore;
