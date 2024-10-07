'use server';

import { createAdminClient, createSessionClient } from "../appwrite";
import { ID, Query } from "node-appwrite";
import { parseStringify, taskFormSchema } from "../utils";
import { getLoggedInUser } from "./user.action";
import { Task } from "../interfaces/interface";

const {
  NEXT_PUBLIC_DATABASE_ID: DATABASE_ID,
  NEXT_PUBLIC_USER_COLLECTION_ID: USER_COLLECTION_ID,
  NEXT_PUBLIC_TASKS_COLLECTION_ID: TASKS_COLLECTION_ID,
} = process.env;

interface CreateTasksProps {
  title: string;
  description: string;
  priority: number;
  due_date: string;
  created_at: string;
  user: string
}

export async function createTask(data: any) {
  try {
    const parsedData = taskFormSchema.parse(data);

    const { database } = await createAdminClient();
    const { account } = await createSessionClient();

    // Get the current user
    const currentUser = await account.get();
    const userId = currentUser.$id;

    if (!userId) {
      throw new Error('User ID is missing');
    }

    // Query the database to find the restaurant associated with the user
    const restaurantQuery = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal('$id', parsedData.user)]
    );

    if (restaurantQuery.documents.length === 0) {
      throw new Error('User not found or has no associated restaurant');
    }

    const restaurantId = restaurantQuery.documents[0].restaurant.$id;

    // Create the task
    const createdTask = await database.createDocument(
      DATABASE_ID!,
      TASKS_COLLECTION_ID!,
      ID.unique(),
      {
        title: parsedData.title,
        description: parsedData.description,
        priority: parsedData.priority,
        user: parsedData.user,
        restaurant: restaurantId,
        due_date: parsedData.due_date,
        created_at: new Date().toISOString(),
        is_verified: false,
        assigned_by: userId
      }
    );

    const taskId = createdTask.$id;

    // Update user's assigned tasks
    const userDocument = restaurantQuery.documents[0];
    const assignedTasks = userDocument.assigned_tasks || [];

    await database.updateDocument(
     DATABASE_ID!,
      USER_COLLECTION_ID!,
      parsedData.user,
      {
        assigned_tasks: [...assignedTasks, taskId],
      }
    );

    return createdTask;
  } catch (error) {
    console.error('Error creating task:', error);
    throw new Error('Failed to create task');
  }
}

export const getMyTasks = async () => {
  try {
    const { database } = await createAdminClient();

    const currentUser = await getLoggedInUser();
    const { $id } = currentUser;

    const fetchTasks = await database.listDocuments(
      DATABASE_ID!,
      TASKS_COLLECTION_ID!,
      [Query.equal('user', $id)]
    )

    //console.log(currentUser)

    const tasks = {
      documents: [
        ...fetchTasks.documents.reverse()
      ]
    }

    //console.log(tasks)

    return parseStringify(tasks);
  } catch (error) {
    console.error('Failed to fetch tasks', error)
  }
}

export const getAllTasks = async () => {
  try {
    const { database } = await createAdminClient();

    const fetchTasks = await database.listDocuments(
      DATABASE_ID!,
      TASKS_COLLECTION_ID!,
    )

    const tasks = {
      documents: [
        ...fetchTasks.documents.reverse()
      ]
    }

    return parseStringify(tasks);
  } catch (error) {
    console.error('Failed to fetch tasks', error)
  }
}

// export const filterTasks = (tasks: Task[], activeTab: string): Task[] => {
//   return tasks.filter(task => {
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
// };

// export const getFilteredTasks = async (activeTab: string): Promise<Task[]> => {
//   // Import getData here to avoid circular dependencies
//   const { getData } = await import('@/app/(demo)/my-tasks/data');
//   const allTasks = await getData();
//   return filterTasks(allTasks, activeTab);
// };


