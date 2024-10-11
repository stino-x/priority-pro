'use client';

import { useEffect, useState } from 'react';
import PlaceholderContent from '@/components/demo/placeholder-content';
import { ContentLayout } from '@/components/admin-panel/content-layout';
import { getLoggedInUser } from '@/lib/actions/user.action';

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getLoggedInUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <ContentLayout title="Dashboard">
      <div>
        <h2 className="font-light text-xl">Hi,</h2>
        <h1 className="font-semibold text-2xl"> {currentUser ? currentUser.name : 'Loading...'}</h1>

        <div className="w-[80vw] bg-slate-100 h-[12rem] dark:bg-red-300"></div>
      </div>
    </ContentLayout>
  );
}
