"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
// import CustomInput from "@/components/authcomponents/CustomInput";
import { taskFormSchema } from "@/lib/utils";
import CustomInput from "@/components/task-components/CustomInput";
import useGetRestaurants from "@/lib/hooks/useGetRestaurants";
import useGetUsers from "@/lib/hooks/useGetUsers";
import { User } from "@/lib/interfaces/interface";
//import { createTasks } from "@/lib/actions/task.action";



const TaskForm = () => {
  const router = useRouter();
  const formSchema = taskFormSchema;
  const [isLoading, setIsLoading] = useState(false);

  const { users } = useGetUsers()
  //useGetRestaurants();

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: 3,
      due_date: "",
      user: "",
      created_at: new Date().toISOString(),
    //   restaurant: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
  
    try {
      // Prepare task data
      const task = {
        title: data.title,
        description: data.description,
        priority: data.priority,
        due_date: data.due_date,
        created_at: data.created_at,
        user: data.user
      };
  
      // Make the request to the /api/tasks endpoint
      const response = await fetch('/api/tasks/createtasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
  
      // Check if the task was created successfully
      if (response.ok) {
        const newTask = await response.json();
        console.log('Task created successfully:', newTask);
  
        // Reset the form and navigate back to the main page
        form.reset();
        router.push('/');
      } else {
        const errorData = await response.json();
        console.error('Error creating task:', errorData.message);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <main className="w-full h-full flex flex-col justify-center items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[80vw] sm:w-[40vw] rounded shadow-md p-12 bg-[#fff]">
          
          <CustomInput control={form.control} name="title" label="Title" placeholder="Enter task title" />
          
          <CustomInput control={form.control} name="description" label="Description" placeholder="Enter task description" />

          <CustomInput control={form.control} name="priority" label="Priority (1-5)" placeholder="Enter priority (1-5)" type="number" />

          <CustomInput control={form.control} name="due_date" label="Due Date" type="date" />

          <CustomInput
            control={form.control}
            name="user"
            label="Assign to User"
            isDropdown
            options={users.map((user: any) => ({
              label: user.name,
              value: user.$id,
            })) || []}
          />

          <Button type="submit" className="mt-4 w-full" disabled={isLoading}>
            {isLoading ? "Creating Task..." : "Create Task"}
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default TaskForm;
