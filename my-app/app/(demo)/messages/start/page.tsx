'use client'

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { fetchUsers, getLoggedInUser } from "@/lib/actions/user.action";
import { createChat } from "@/lib/actions/chat.action";


export default function Start() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true)
        const fetchedUsers = await fetchUsers();
        if(Array.isArray(fetchedUsers)) {
          setUsers(fetchedUsers);
        } else {
          console.error('Fetched users is not an array:', fetchedUsers);
          setUsers([]);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
      setLoading(false)
    };
    

    getUsers();
  }, []);

  const handleClick = async (otherUserId: string, chatTitle: string) => {
    try {
      const currentUser = await getLoggedInUser();
      const userId = currentUser.userid;

      const chat = await createChat(userId, otherUserId, chatTitle);

      if (chat) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  }

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          {users.map((user: User) => (
            <button type="button" key={user.userid} onClick={() => handleClick(user.userid, user.name)}>
              <h1>{user.name}</h1>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}