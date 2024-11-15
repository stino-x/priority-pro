// function base64ToFile(base64String, fileName) {
//   // Split the base64 string to remove the data type prefix
//   const [mimeInfo, base64Data] = base64String.split(',');
//   const mimeType = mimeInfo.match(/:(.*?);/)[1]; // Extract MIME type (e.g., "image/jpeg")

//   // Decode the base64 string to binary data
//   const binary = atob(base64Data);
//   const binaryLength = binary.length;
//   const binaryArray = new Uint8Array(binaryLength);

//   for (let i = 0; i < binaryLength; i++) {
//     binaryArray[i] = binary.charCodeAt(i);
//   }

//   // Create a Blob object
//   const blob = new Blob([binaryArray], { type: mimeType });

//   // Optionally convert Blob to File
//   return new File([blob], fileName, { type: mimeType });
// }

// // Example usage
// const base64String = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD…AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z";
// const fileName = "image.jpg";
// const file = base64ToFile(base64String, fileName);

// console.log(file); // Output: File object


/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { getUserInfo, getProfilePic, getLoggedInUser } from "@/lib/actions/user.action";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getChats } from '@/lib/actions/chat.action';

export default function Home() {
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

            // Fetch profile picture for the other user
            let profilePicUrl = null;
            if (otherUserInfo?.profile_pic_id) {
              profilePicUrl = await getProfilePic(otherUserInfo.profile_pic_id);
            }

            return {
              ...chat,
              title: otherUserInfo ? otherUserInfo.name : 'Unknown User',
              profilePicUrl, // Store the profile picture URL with each chat
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
            <Link href={`/chat/${chat.chat_id}`} key={chat.chat_id}>
              <div className="chat-title flex items-center space-x-2">
                <h1>{chat.title}</h1>
                {chat.profilePicUrl && (
                  <Image src={chat.profilePicUrl} alt="User profile pic" width={50} height={50} />
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
      <Link href='/start'>Start a new Chat</Link>
    </div>
  );
}