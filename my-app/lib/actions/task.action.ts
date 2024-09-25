'use server';

import { createAdminClient } from "../appwrite";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { getLoggedInUser } from "./user.action";

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

export const createTasks = async (task: CreateTasksProps) => {
  try {
    const { database } = await createAdminClient();

    const currentUser = await getLoggedInUser();
    const { userid } = currentUser;
    const restaurantId = currentUser.restaurant.$id;

    const tasks = await database.listDocuments(
      DATABASE_ID!,
      TASKS_COLLECTION_ID!,
      [Query.equal('restaurant', restaurantId)]
    );

    const maxTaskId = tasks.documents.reduce(
      (maxId, currentTask) => Math.max(maxId, currentTask.taskId || 0),
      0
    );

    const newTaskId = maxTaskId + 1;
    console.log(newTaskId)

    const newTask = await database.createDocument(
      DATABASE_ID!,
      TASKS_COLLECTION_ID!,
      ID.unique(),
      {
        ...task,
        id: newTaskId,
        is_verified: false,
        restaurant: restaurantId,
        assigned_by: userid
      }
    )

    console.log('Task created successfully:', newTask);

    return parseStringify(newTask)
  } catch (error) {
    console.error('Error creating task:', error);
  }
}

export const getTasks = async () => {
  try {
    const { database } = await createAdminClient();

    const fetchTasks = await database.listDocuments(
      DATABASE_ID!,
      TASKS_COLLECTION_ID!,
    )

    const tasks = {
      documents: [
        ...fetchTasks.documents
      ]
    }

    return parseStringify(tasks);
  } catch (error) {
    console.error('Failed to fetch tasks', error)
  }
}