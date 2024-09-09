import { createAdminClient, createSessionClient } from '@/lib/appwrite';
import { taskFormSchema } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const formSchema = taskFormSchema()
    const parsedData = formSchema.parse(data);

    const { database } = await createAdminClient();
    const { account } = await createSessionClient();

    const currentUser = await account.get();
    
    // Extract the user ID
    const userId = currentUser.$id;


    await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TASKS_COLLECTION_ID!,
      'unique()',
      {
        title: parsedData.title,
        description: parsedData.description,
        priority: parsedData.priority,
        // status: parsedData.status,
        user: parsedData.user,
        // restaurant: parsedData.restaurantId,
        due_date: parsedData.due_date,
        created_at: new Date().toISOString(),
        // updated_at: new Date().toISOString(),
        is_verified: false,
        assigned_by: userId
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
    return new Response(JSON.stringify({ message: 'Error creating task' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}