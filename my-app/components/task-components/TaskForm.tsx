"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
// import CustomInput from "@/components/authcomponents/CustomInput";
import { taskFormSchema } from "@/lib/utils";
import CustomInput from "@/components/task-components/CustomInput";



const TaskForm = () => {
  const router = useRouter();
  const formSchema = taskFormSchema();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: 3,
      due_date: "",
    //   user: "",
    //   restaurant: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Here, you would call an API to save the task
      console.log("Task created:", data);
      router.push("/tasks");  // Redirect after successful task creation
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full h-full flex flex-col justify-center items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[80vw] sm:w-[40vw] rounded shadow-md p-12 bg-[#fff]">
          
          {/* Title Field */}
          <CustomInput control={form.control} name="title" label="Title" placeholder="Enter task title" />
          
          {/* Description Field */}
          <CustomInput control={form.control} name="description" label="Description" placeholder="Enter task description" />

          {/* Priority Field */}
          <CustomInput control={form.control} name="priority" label="Priority (1-5)" placeholder="Enter priority (1-5)" type="number" />

          {/* Due Date Field */}
          <CustomInput control={form.control} name="due_date" label="Due Date" type="datetime-local" />

          {/* Assigned User Dropdown */}
          {/* <CustomInput control={form.control} name="user" label="Assign to User" placeholder="Enter user ID" /> */}

          {/* Restaurant Dropdown */}
          {/* <CustomInput control={form.control} name="restaurant" label="Restaurant" placeholder="Enter restaurant ID" /> */}

          {/* Submit Button */}
          <Button type="submit" className="mt-4 w-full" disabled={isLoading}>
            {isLoading ? "Creating Task..." : "Create Task"}
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default TaskForm;
