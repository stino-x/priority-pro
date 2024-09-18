import { useEffect, useState } from 'react';
import { getAccount } from './path_to_getAccount_function'; // Import the getAccount function

const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]);

  // Fetch restaurants when the component mounts
  useEffect(() => {
    const fetchRestaurants = async () => {
      const data = await getAccount(); // Call the function to get restaurant data
      if (data) {
        setRestaurants(data); // Update the state with the restaurant data
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div>
      <h1>Restaurants List</h1>
      {restaurants.length > 0 ? (
        restaurants.map((restaurant) => (
          <div key={restaurant.$id}>
            <h2>{restaurant.name}</h2>
            <p>{restaurant.description}</p>
          </div>
        ))
      ) : (
        <p>No restaurants available.</p>
      )}
    </div>
  );
};

export default RestaurantsList;
