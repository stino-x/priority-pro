import useLogoutStore from "../store/useLogoutStore";

interface LogoutHook {
  isLoggedIn: boolean;
  logout: () => void;
}

const useLogout = (): LogoutHook => {
  const { logout, isLoggedIn } = useLogoutStore() as LogoutHook;

  return {
    logout,
    isLoggedIn
  };
};

export default useLogout;
