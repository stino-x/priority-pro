// DataTable.tsx
'use client'; // Ensure this component is a client component

import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Task } from "@/lib/interfaces/interface";
import useTabState from "@/lib/hooks/useTabState"; // Import your tab state hook

interface TasksProps {
  tasks: Task[];
}

const DataTable = ({ tasks }: TasksProps) => {
  const { activeTab } = useTabState(); // Access Zustand state here

  // Filter tasks based on activeTab
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

  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader className="bg-[#f9fafb]">
          <TableRow className="justify-around">
            <TableHead className="px-2 font-bold">Title</TableHead>
            <TableHead className="px-2 font-bold">Due Date</TableHead>
            <TableHead className="px-2 font-bold">Status</TableHead>
            <TableHead className="px-2 font-bold">Priority</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredTasks.map((t: Task) => (
            <TableRow key={t.task_id} className="!hover:bg-none !border-b-default">
              <TableCell className="max-w-[250px] pl-2 pr-10">
                <div className="flex items-center">
                  <h1>{t.title}</h1>
                </div>
              </TableCell>

              <TableCell className="pl-2 pr-10 min-w-32">
                {new Date(t.due_date).toLocaleDateString()} {/* Ensure due_date is properly formatted */}
              </TableCell>

              <TableCell className="pl-2 pr-10">
                <div className={`text-center px-2 rounded-8 ${t.is_verified ? "bg-green-100" : "bg-gray-100"}`}>
                  {t.is_verified ? "Completed" : "Not Started"}
                </div>
              </TableCell>

              <TableCell className="pl-2 pr-10 capitalize min-w-24">
                <div 
                  className={`text-center w-12 h-12 rounded-full text-xl flex items-center justify-center 
                    ${t.priority < 33 ? "bg-red-500" : "bg-green-500"} text-white`}
                >
                  {t.priority}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
