"use client";
import { logoutAccount } from '@/lib/actions/user.action';
import { useState } from 'react'
import { useRouter } from 'next/navigation'


export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    const loggedOut = await logoutAccount();
    router.push('/signin');
    console.log('Logged out finish');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
    </main>
  );
}
