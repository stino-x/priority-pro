'use server';

import { createAdminClient, createSessionClient } from "../appwrite";
import { ID, Query } from "node-appwrite";
import { parseStringify, taskFormSchema } from "../utils";
import { getLoggedInUser, getUserInfo } from "./user.action";
import axios from 'axios';
import { Task } from "../interfaces/interface";

const {
  NEXT_PUBLIC_DATABASE_ID: DATABASE_ID,
  NEXT_PUBLIC_USER_COLLECTION_ID: USER_COLLECTION_ID,
  NEXT_PUBLIC_TASKS_COLLECTION_ID: TASKS_COLLECTION_ID,
  NEXT_PUBLIC_SEND_IN_BLUE_API_KEY: BREVO_API_KEY,
  NEXT_PUBLIC_TEMPLATE_ID: TEMPLATE_ID,
} = process.env;

interface CreateTasksProps {
  title: string;
  description: string;
  priority: number;
  due_date: string;
  created_at: string;
  user: string
}

export const sendEmail = async (recipientEmail: string, assignername: string, firstName: string, description: string, restaurant: string, address: string) => {

  const emailData = {
    sender: { email: 'your_email@example.com' },  // Replace with your sender email
    to: [{ email: recipientEmail }],  // Recipient email
    templateId: TEMPLATE_ID,  // Template ID for the email template
    params: {
      FIRSTNAME: firstName,  // Dynamic content for personalization
      ASSIGNERNAME: assignername, 
      DESCRIPTION: description, //
      ADDRESS: address, //
      RESTAURANT: restaurant, //
    },
  };

  try {
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', emailData, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,  // Add your Brevo API key in the header
      },
    });

    console.log('Email sent successfully:', response.data);
    return response.data;  // Optional: return the API response
  } catch (error: any) {
    console.error('Error sending email:', error.message);
    throw error;  // Throw error to be handled by caller if necessary
  }
};

export async function createTask(data: any) {
  try {
    const parsedData = taskFormSchema.parse(data);

    const { database } = await createAdminClient();
    const { account } = await createSessionClient();

    // Get the current user
    const currentUser = await account.get();
    const userId = currentUser.$id; //id of assigner

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

    // Send email after task is created
    if (createdTask) {
      // Pass required parameters to sendEmail
      const userInfo = await getUserInfo(userId); // get user info using user ID
      const assignername = userInfo.name
      const recipient = await getUserInfo(parsedData.user);
      const Email = recipient.email; // Ensure the email exists in user info
      const taskDescription = parsedData.description;
      const restaurantName = restaurantQuery.documents[0].restaurant.name; // Assuming the restaurant name is in the restaurant object
      const userFirstName = recipient.name; // Assuming first name is part of the user object

      // Call the sendEmail function with dynamic content
      await sendEmail(
        Email,
        assignername,
        userFirstName, // Use the user's first name
        taskDescription, // Pass task description
        restaurantName, // Pass restaurant name
        restaurantQuery.documents[0].restaurant.address // Assuming address is in parsedData.restaurant object
      );
    }

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

export const getTaskById = async ($id: string) => {
  try {
    const { database } = await createAdminClient();

    const fetchTasks = await database.listDocuments(
      DATABASE_ID!,
      TASKS_COLLECTION_ID!,
      [Query.equal('$id', $id)]
    )

    // const tasks = {
    //   documents: [
    //     ...fetchTasks.documents.reverse()
    //   ]
    // }

    return parseStringify(fetchTasks.documents[0]);
  } catch (error) {
    console.error('Failed to fetch tasks', error)
  }
}

export const getVerifiedTasks = async () => {
  try {
    const { database } = await createAdminClient();

    const currentUser = await getLoggedInUser();
    const { $id } = currentUser;

    const fetchTasks = await database.listDocuments(
      DATABASE_ID!,
      TASKS_COLLECTION_ID!,
      [Query.equal('is_verified', true),
        Query.equal('user', $id)
      ]
    )

    //console.log(currentUser)

    const tasks = {
      documents: [
        ...fetchTasks.documents.reverse()
      ]
    }

    // console.log(tasks)

    return parseStringify(tasks);
  } catch (error) {
    console.error('Failed to fetch tasks', error)
  }
}

export const getCurrentDate = (): string => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

  export const getDailyTasks = async () => {
    try {
      const { database } = await createAdminClient();

      const currentUser = await getLoggedInUser();
      const { $id } = currentUser;
  
      const date = await getCurrentDate();
  
      const fetchTasks = await database.listDocuments(
        DATABASE_ID!,
        TASKS_COLLECTION_ID!,
        [
          Query.equal('due_date', date),
          Query.equal('user', $id)
        ]
      )
  
      const tasks = {
        documents: [
          ...fetchTasks.documents.reverse()
        ]
      }
  
      console.log(tasks)
  
      return parseStringify(tasks.documents);
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


