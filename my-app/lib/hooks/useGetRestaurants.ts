import useRestaurantStore from "../store/useGetRestrauntStore";

interface getRestaurantHook {
  Restaurants: Array<any>; 
    //getUsers: () => Promise<void>;
}
  

const useGetRestaurants = (): getRestaurantHook => {
  const { Restaurants } =  useRestaurantStore() as getRestaurantHook;

  return {
    //getUsers,
    Restaurants
  };
};

export default useGetRestaurants;