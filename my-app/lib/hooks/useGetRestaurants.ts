'use client'
import { useEffect } from "react";
import { Restaurant } from "../interfaces/interface";
import useRestaurantStore from "../store/useGetRestrauntStore";

interface getRestaurantHook {
  restaurants: Restaurant[]; // Updated to use the Restaurant interface
  fetchRestaurants: () => void; // Add getRestaurants method
}
  

const useGetRestaurants = (): getRestaurantHook => {
  const { restaurants, fetchRestaurants } = useRestaurantStore() as getRestaurantHook;

  useEffect(() => {
    fetchRestaurants(); // Fetch restaurants when the component mounts
  }, [fetchRestaurants]);

  return { restaurants, fetchRestaurants };
};


export default useGetRestaurants;