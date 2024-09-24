'use server';

import { createAdminClient } from "../appwrite";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";

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

    const newTask = await database.createDocument(
      DATABASE_ID!,
      TASKS_COLLECTION_ID!,
      ID.unique(),
      {
        ...task
      }
    )

    console.log('Task created successfully:', newTask);

    return parseStringify(newTask)
  } catch (error) {
    console.error('Error creating task:', error);
  }
}