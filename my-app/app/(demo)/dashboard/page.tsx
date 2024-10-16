'use client';

import { useEffect, useState } from 'react';
import PlaceholderContent from '@/components/demo/placeholder-content';
import { ContentLayout } from '@/components/admin-panel/content-layout';
import { getLoggedInUser } from '@/lib/actions/user.action';
import { getDailyTasks } from '@/lib/actions/task.action';
import { Task } from "@/lib/interfaces/interface";
import { MessageCircleMore } from 'lucide-react';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [task, setTask] = useState<Task[]>([]);

  const completed = [];

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

  task.map((item) => {
    if (item.completed) {
      completed.push(item);
    }
  })

  const result = (completed.length / task.length) * 100;

  const percentage = Math.floor(result);

  return (
    <ContentLayout title="Dashboard">
      <div>
        <h2 className="font-light text-xl text-[#26262f] dark:text-[#d9d9d9]">Hi,</h2>
        <h1 className="font-semibold text-2xl text-[#26262f] dark:text-[#d9d9d9]"> {currentUser ? currentUser.name : 'Loading...'}</h1>

        <div className="w-[80vw] bg-slate-100 h-[12rem] dark:bg-red-300">
          
        </div>
        <div className="flex flex-col items-center w-full mt-8">
          <h1>Todays Tasks</h1>
          <div className="flex flex-row w-[100%] justify-around">
            <div className="w-[35vw] h-[7rem] bg-[#D3E0EA] dark:bg-[#404258] rounded-xl flex flex-col justify-center items-center">
              <MessageCircleMore className="w-[3rem] h-[3rem] text-[#ffadff]" />
              <h2 className="font-semibold text-lg text-zinc-500">Chats</h2>
            </div>
            <div className="w-[35vw] h-[7rem] bg-[#D3E0EA] dark:bg-[#404258] rounded-xl flex flex-col justify-center items-center">
              <CircularProgressbar
                minValue={0}
                maxValue={100}
                value={percentage}
                text={`${percentage}%`}
                className="w-[4rem] h-[4rem] text-xs"
              />
            </div>
          </div>
          <div className="flex flex-col w-[100%] justify-around mt-4">
            {task.length > 0 ? (
              task.map((t: Task) => (
                <div key={t.task_id} className={`pl-4 py-2 my-2 w-[100%] h-[5rem] bg-[#D3E0EA] dark:bg-[#404258] rounded-xl border-l-8 ${t.completed ? "border-green-100" : "border-red-400"}`}>
                  <h3 className={`text-center w-[5rem] rounded-2xl font-semibold text-xs text-[#26262f] dark:text-[#d9d9d9] ${t.completed ? "bg-green-100" : "bg-red-400"}`}>
                  {t.completed ? "Completed" : "Not Started"}
                  </h3>
                  <h2 className="font-semibold text-lg">{t.title}</h2>
                  <div className="flex flex-row justify-between mt-2">
                    <h4 className="font-semibold text-xs text-zinc-500">{t.verified_at ? new Date(t.verified_at).toLocaleDateString() : 'N/A'}</h4>
                    <h4 className={`pb-0 text-center w-[5rem] rounded-2xl font-semibold text-xs text-[#26262f] dark:text-[#26262f] ${t.is_verified ? "bg-green-100" : "bg-gray-100"}`}>
                      {t.is_verified ? "Verified" : "Not Verified"}
                    </h4>
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
