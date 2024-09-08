import useGetUsersStore from "../store/useGetUsersStore";

interface getUsersHook {
    users: Array<any>; 
    getUsers: () => Promise<void>;
}
  

const useGetUsers = (): getUsersHook => {
  const { getUsers, users } =  useGetUsersStore() as getUsersHook;

  return {
    getUsers,
    users
  };
};

export default useGetUsers;