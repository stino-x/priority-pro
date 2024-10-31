'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react';
import { MessageCircleMore } from 'lucide-react';
import { getUserInfo, getLoggedInUser } from "@/lib/actions/user.action";
import { getChats } from '@/lib/actions/chat.action';

export default function Messages() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const loggedUser = await getLoggedInUser();
        if (!loggedUser) throw new Error('No logged-in user found');
        setUser(loggedUser);

        const fetchedChats = await getChats();

        const chatWithTitles = await Promise.all(
          fetchedChats.map(async (chat: Chat) => {
            const otherUserId = chat.user1_id === loggedUser.user_id ? chat.user2_id : chat.user1_id;
            const otherUserInfo = await getUserInfo({ userid: otherUserId });

            // let profilePicUrl = null;
            // if (otherUserInfo?.profile_pic_id) {
            //   profilePicUrl = await getProfilePic(otherUserInfo.profile_pic_id);
            // }

            return {
              ...chat,
              title: otherUserInfo ? otherUserInfo.name : 'Unknown User',
              // profilePicUrl,
            };
          })
        );

        setChats(chatWithTitles);
      } catch (error) {
        console.error('Failed to fetch logged-in user or chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          {chats.map((chat: Chat) => (
            <Link href={`/messages/chat/${chat.chat_id}`} key={chat.chat_id}>
              <div className="chat-title flex items-center space-x-2">
                <h1>{chat.title}</h1>
              </div>
            </Link>
          ))}
        </div>
      )}
      <Link href='/messages/start'>
        <MessageCircleMore className="w-[3rem] h-[3rem] text-[#ffadff]" />
      </Link>
    </div>
  );
}