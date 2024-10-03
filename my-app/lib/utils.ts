import { type ClassValue, clsx } from "clsx"
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge"
import { z } from "zod";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseStringify = (value: any) => {
  try {
    if (value === undefined) {
      throw new Error("Value is undefined");
    }
    return JSON.parse(JSON.stringify(value));
  } catch (error) {
    console.error("Failed to parse and stringify value:", error);
    return null;
  }
};

export const authFormSchema = (type: string) => z.object({
  name: type === 'signin' ? z.string().optional() : z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  restaurant: type === 'register' 
    ? z.string().nonempty("Restaurant is required")
    : z.string().optional(),
});

export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  priority: z.number().min(1).max(5, "Priority must be between 1 and 5"),
  due_date: z.string().min(1, "Due date is required"),
  created_at: z.string().min(1, "Created at is required"),
  user: z.string().min(1, "User is required"),
  //restaurant: z.string().min(1, "Restaurant is required"),
});