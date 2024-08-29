"use client";
import { useState } from 'react'
import { account, ID } from "./appwrite";

export default function Home() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const logout = async () => {
    await account.deleteSession("current");
    setLoggedInUser(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <button type="button" onClick={logout}>
          Logout
        </button>
    </main>
  );
}
