import useRestaurantStore from "../store/useGetRestrauntStore";

interface getUsersHook {
  Restaurants: Array<any>; 
    //getUsers: () => Promise<void>;
}
  

const useGetRestaurants = (): getUsersHook => {
  const { Restaurants } =  useRestaurantStore() as getUsersHook;

  return {
    //getUsers,
    Restaurants
  };
};

export default useGetRestaurants;