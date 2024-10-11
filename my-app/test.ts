'use client';

import { useEffect, useState } from 'react';
import PlaceholderContent from '@/components/demo/placeholder-content';
import { ContentLayout } from '@/components/admin-panel/content-layout';
import { getLoggedInUser } from '@/lib/actions/user.action';
import { getDailyTasks } from '@/lib/actions/task.action';
import { Task } from "@/lib/interfaces/interface";

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);  // Updated to ensure tasks is an array

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

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const fetchedTasks = await getDailyTasks();
        if (Array.isArray(fetchedTasks)) {  // Ensure the fetched tasks are an array
          setTasks(fetchedTasks);
        } else {
          console.error('Fetched tasks are not an array:', fetchedTasks);
          setTasks([]);  // Reset tasks to an empty array if not an array
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]);  // Set empty array in case of error
      }
    };

    fetchTask();
  }, []);

  return (
    <ContentLayout title="Dashboard">
      <div>
        <h2 className="font-light text-xl text-[#26262f] dark:text-[#d9d9d9]">Hi,</h2>
        <h1 className="font-semibold text-2xl text-[#26262f] dark:text-[#d9d9d9]"> {currentUser ? currentUser.name : 'Loading...'}</h1>

        <div className="w-[80vw] bg-slate-100 h-[12rem] dark:bg-red-300"></div>
        <div className="flex flex-col items-center w-full mt-8">
          <h1>All Tasks</h1>
          <div className="flex flex-row w-[100%] justify-around">
            <div className="w-[35vw] h-[7rem] bg-[#D3E0EA] dark:bg-[#404258] rounded-xl">date</div>
            <div className="w-[35vw] h-[7rem] bg-[#D3E0EA] dark:bg-[#404258] rounded-xl">notification</div>
          </div>
          <div className="flex flex-around w-[100%] justify-around">
            {tasks.length > 0 ? (
              tasks.map((t: Task) => (
                <div key={t.task_id} className="w-[80%] h-[4rem]">{t.title}</div>
              ))
            ) : (
              <div>No tasks available</div>
            )}
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
