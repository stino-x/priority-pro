export const createTasks = async (task: CreateTasksProps) => {
  try {
    const { database } = await createAdminClient();

    const currentUser = await getLoggedInUser();
    const { userid } = currentUser;
    const restaurantId = currentUser.restaurant.$id;

    // Fetch existing tasks to determine the next taskId
    const tasks = await database.listDocuments(
      DATABASE_ID!,
      TASKS_COLLECTION_ID!,
      [Query.equal('restaurant', restaurantId)]
    );

    // Find the max taskId to determine the next taskId
    const maxTaskId = tasks.documents.reduce(
      (maxId, currentTask) => Math.max(maxId, currentTask.taskId || 0),
      0
    );

    // Set the new taskId as maxTaskId + 1
    const newTaskId = maxTaskId + 1;

    // Create a new task with the determined taskId
    const newTask = await database.createDocument(
      DATABASE_ID!,
      TASKS_COLLECTION_ID!,
      ID.unique(),
      {
        ...task,
        taskId: newTaskId,
        is_verified: false,
        restaurant: restaurantId,
        assigned_by: userid,
      }
    );

    console.log('Task created successfully:', newTask);

    return parseStringify(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
  }
};
