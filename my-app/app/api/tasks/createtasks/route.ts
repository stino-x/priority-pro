// pages/api/tasks/createtasks.ts

import { createTask } from "@/lib/actions/task.action";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const task = await createTask(data);

    return new Response(JSON.stringify({ message: 'Task created successfully', task }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return new Response(JSON.stringify({ message: 'Error creating task', error: (error as Error).message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
