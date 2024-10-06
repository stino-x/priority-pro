import React, { useEffect, useState } from 'react';
// import { Payment } from "@/components/table/columns";
import useTabState from "@/lib/hooks/useTabState";
import { getData } from '@/app/(demo)/my-tasks/data';
import { Task } from '@/lib/interfaces/interface';


export function FilteredTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { activeTab } = useTabState();

  useEffect(() => {
    async function fetchData() {
      const allTasks = await getData();
      setTasks(allTasks);
    }
    fetchData();
  }, []);

  const filteredTasks = tasks.filter(task => {
    switch (activeTab) {
      case 'All':
        return true;
      case 'Verified':
        return task.is_verified === true;
      case 'Completed':
        return task.completed === true;
      case 'Overdue':
        const dueDate = new Date(task.due_date);
        const today = new Date();
        return dueDate < today;
      default:
        return true;
    }
  });

  return filteredTasks
}