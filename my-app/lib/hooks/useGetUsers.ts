import { useEffect } from "react";
import useGetUsersStore from "../store/useGetUsersStore";
import { User } from "../interfaces/interface";

interface GetUsersHook {
    users: User[];
    getUsers: () => Promise<void>;
}
  

const useGetUsers = (): GetUsersHook => {
  const { users, getUsers } =  useGetUsersStore() as GetUsersHook;
  useEffect(() => {
    getUsers();
  },  [getUsers]);

  return {
    getUsers,
    users
  };
};

export default useGetUsers;