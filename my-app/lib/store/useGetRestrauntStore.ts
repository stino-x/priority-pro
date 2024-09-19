'use client';

import { create } from 'zustand';
import { getRestaurants } from '../actions/user.action';

const useRestaurantStore = create((set) => ({
  restaurants: [],
  fetchRestaurants: async () => {
    const restaurants = await getRestaurants();
    set({ restaurants });
  },
}));

export default useRestaurantStore;