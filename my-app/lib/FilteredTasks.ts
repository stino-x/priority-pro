// // FilteredTasks.ts

// import useTabState from "@/lib/hooks/useTabState";
// import { getData } from '@/app/(demo)/my-tasks/data';
// import { Task } from '@/lib/interfaces/interface';

// export const getFilteredTasks = async (): Promise<Task[]> => {
//   const { activeTab } = useTabState();

//   // Fetch tasks from your data source
//   const allTasks = await getData();

//   // Filter the tasks based on activeTab
//   const filteredTasks = allTasks.filter(task => {
//     switch (activeTab) {
//       case 'All':
//         return true;
//       case 'Verified':
//         return task.is_verified === true;
//       case 'Completed':
//         return task.completed === true;
//       case 'Overdue':
//         const dueDate = new Date(task.due_date);
//         const today = new Date();
//         return dueDate < today;
//       default:
//         return true;
//     }
//   });

//   return filteredTasks;
// }
