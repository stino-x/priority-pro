'use client'

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { fetchUsers, getLoggedInUser, getProfilePic } from "@/lib/actions/user.action";
import { createChat } from "@/lib/actions/chat.action";
import MessageCard from '@/components/message/MessageCard'


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
          const usersWithPic = await Promise.all(
            fetchedUsers.map(async (user) => {
              let profilePicUrl = await getProfilePic(user.picture);
              return {
                ...user,
                profilePicUrl,
              };
            })
          );

          setUsers(usersWithPic);
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
        router.push('/messages');
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  }

  return (
    <div className="h-[100dvh]">
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="flex flex-col">
          <h2 className="text-slate-600 font-semibold text-[22px] mb-4">Restautrants Users</h2>
          {users.map((user: User) => (
            <button type="button" key={user.userid} onClick={() => handleClick(user.userid, user.name)}>
              <MessageCard title={user.name} text="start chatting..." pic={user.profilePicUrl} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}