'use client';

import { getMyTasks } from "@/lib/actions/task.action";
import { useState, useEffect } from "react";

const TasksTable = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await getMyTasks();
        console.log(tasksData.documents)
        setTasks(tasksData.documents);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (tasks.length === 0) {
    return <div>No tasks available.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {/* {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{task.title}</td>
              <td className="py-2 px-4 border-b">{task.description}</td>
              <td className="py-2 px-4 border-b">{task.status}</td>
              <td className="py-2 px-4 border-b">{task.due_date}</td>
            </tr>
          ))} */}
        </tbody>
      </table>
    </div>
  );
}

export default TasksTable;