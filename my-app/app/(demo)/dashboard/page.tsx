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
        <h2>Hi, {currentUser ? currentUser.name : 'Loading...'}<br /></h2>
      </div>
    </ContentLayout>
  );
}
