import useGetUsersStore from "../store/useGetUsersStore";

interface getUsersHook {
    users: Array<any>; 
    //getUsers: () => Promise<void>;
}
  

const useGetUsers = (): getUsersHook => {
  const { users } =  useGetUsersStore() as getUsersHook;

  return {
    //getUsers,
    users
  };
};

export default useGetUsers;