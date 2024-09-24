const onSubmit = async (data: z.infer<typeof formSchema>) => {
  setIsLoading(true);
  
  try {
    const task = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      due_date: data.due_date,
    };
    
    // Log the task data to be sent
    console.log('Submitting task data:', task);

    // Make sure to await the createTasks call
    const newTask = await createTasks(task);

    if (newTask) {
      console.log('Task created successfully');
      form.reset();
      router.push("/");
    } else {
      console.error('Failed to create task');
    }
  } catch (error) {
    console.error('Error creating task:', error);
    // Display an error notification (if any notification library is used)
  } finally {
    setIsLoading(false);
  }
};
