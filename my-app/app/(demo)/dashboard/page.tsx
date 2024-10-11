'use client';

import { useEffect, useState } from 'react';
import PlaceholderContent from '@/components/demo/placeholder-content';
import { ContentLayout } from '@/components/admin-panel/content-layout';
import { getLoggedInUser } from '@/lib/actions/user.action';
import { getDailyTasks } from '@/lib/actions/task.action';
import { Task } from "@/lib/interfaces/interface";

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [task, setTask] = useState<Task[]>([]);

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
        if(Array.isArray(fetchedTasks)) {
          setTask(fetchedTasks)
        } else {
          console.error('Fetched tasks is not an array:', fetchedTasks);
          setTask([]);
        }
        
      } catch (error) {
        console.error('Error fetching Tasks:', error);
        setTask([]);
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
          <div className="flex flex-col w-[100%] justify-around mt-4">
            {task.length > 0 ? (
              task.map((t: Task) => (
                <div key={t.task_id} className="w-[80%] h-[4rem] bg-[#D3E0EA] dark:bg-[#404258] rounded-xl">
                  <h3 className={`text-center px-2 rounded-8 ${t.completed ? "bg-green-100" : "bg-gray-100"}`}>
                  {t.completed ? "Completed" : "Not Started"}
                  </h3>
                  <h2>{t.title}</h2>
                  <div>
                    <h4 className={`text-center px-2 rounded-8 ${t.is_verified ? "bg-green-100" : "bg-gray-100"}`}>
                      {t.is_verified ? "Verified" : "Not Verified"}
                    </h4>
                    <h4>Since {t.verified_at ? new Date(t.verified_at).toLocaleDateString() : 'N/A'}</h4>
                  </div>
                  
                </div>
              ))
            ) : (
              <h2>No Tasks due today</h2>
            )}
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
