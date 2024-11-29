'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react';
import { MessageCircleMore } from 'lucide-react';
import { getUserInfo, getLoggedInUser, getProfilePic } from "@/lib/actions/user.action";
import { getChats } from '@/lib/actions/chat.action';
import MessageCard from '@/components/message/MessageCard'
import { Chat } from '@/lib/interfaces/interface';

export default function Messages() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const loggedUser = await getLoggedInUser();
        console.log(loggedUser)
        if (!loggedUser) throw new Error('No logged-in user found');
        setUser(loggedUser);

        const fetchedChats = await getChats(loggedUser.userid);

        const chatWithTitles = await Promise.all(
          fetchedChats.map(async (chat: Chat) => {
            const otherUserId = chat.user1_id === loggedUser.userid ? chat.user2_id : chat.user1_id;
            const otherUserInfo = await getUserInfo( otherUserId );
            let profilePicUrl = await getProfilePic(otherUserInfo.picture);

            return {
              ...chat,
              title: otherUserInfo ? otherUserInfo.name : 'Unknown User',
              profilePicUrl,
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
    <div className="h-[100dvh">
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="flex flex-col">
          {chats.map((chat: Chat) => (
            <Link href={`/chat/${chat.chat_id}`} key={chat.chat_id}>
              <MessageCard 
              title={chat.title} 
              text="start chatting..." 
              pic={chat.profilePicUrl} 
              />
          </Link>
          
          ))}
        </div>
      )}
      <Link href='/messages/start' className="fixed bottom-[4rem] right-[1rem] p-4 flex gap-2 bg-red-800 w-[3rem] h-[3rem] rounded justify-center items-center">
        <MessageCircleMore className="w-[3rem] h-[3rem] text-[#ffadff]" />
      </Link>
    </div>
  );
}