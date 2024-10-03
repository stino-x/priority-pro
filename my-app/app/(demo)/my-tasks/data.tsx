import { Payment } from "@/components/table/columns";
import { getTasks } from "@/lib/actions/task.action";

export async function getData(): Promise<Payment[]> {
  try {
    const tasksResponse = await getTasks();
    console.log("Fetched tasks:", tasksResponse);

    const tasks = tasksResponse?.documents || [];
    
    if (!Array.isArray(tasks)) {
      console.log('Expected tasks to be an array, but got:', typeof tasks);
      return [];
    }

    return tasks.map((task) => ({
      title: task.title,
      due_date: task.due_date,
      priority: task.priority,
      status: task.is_verified,
    }));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}
