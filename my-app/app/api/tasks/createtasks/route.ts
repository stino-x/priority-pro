import { createAdminClient, createSessionClient } from '@/lib/appwrite';
import { taskFormSchema } from '@/lib/utils';
import { Query } from 'appwrite';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const parsedData = taskFormSchema.parse(data);

    const { database } = await createAdminClient();
    const { account } = await createSessionClient();

    const currentUser = await account.get();
    
    // Extract the user ID
    const userId = currentUser.$id;

    // Query the database to find the restaurant associated with the user
    const restaurantQuery = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!, // Assuming you have a users collection
      [
        Query.equal('$id', parsedData.user)
      ]
    );

    if (restaurantQuery.documents.length === 0) {
      throw new Error('User not found or has no associated restaurant');
    }

    const restaurantId = restaurantQuery.documents[0].restaurant.$id; // Assuming the restaurant ID is stored in this field

    // Step 1: Create the task and get its ID
    const createdTask = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TASKS_COLLECTION_ID!,
      'unique()',  // Generate a unique ID for the task
      {
        title: parsedData.title,
        description: parsedData.description,
        priority: parsedData.priority,
        user: parsedData.user,
        restaurant: restaurantId, // Use the queried restaurant ID
        due_date: parsedData.due_date,
        created_at: new Date().toISOString(),
        is_verified: false,
        assigned_by: userId
      }
    );

    const taskId = createdTask.$id; // Get the ID of the created task

    // Step 2: Fetch the current assigned tasks for the user
    const userDocument = restaurantQuery.documents[0]; // User's document
    const assignedTasks = userDocument.assigned_tasks || []; // Get existing assigned tasks

    // Step 3: Update the user's document to include the new task ID
    await database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
      parsedData.user,  // The user ID to update
      {
        assigned_tasks: [...assignedTasks, taskId], // Append the new task ID
      }
    );

    return new Response(JSON.stringify({ message: 'Task created successfully' }), {
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
