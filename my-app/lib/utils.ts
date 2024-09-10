import { type ClassValue, clsx } from "clsx"
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge"
import { z } from "zod";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const authFormSchema = (type: string) => z.object({
  // sign up
  name: type === 'signin' ? z.string().optional() : z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  restaurant: z.string().nonempty("Restaurant is required"),
})

export const taskFormSchema = () =>  z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  priority: z.number().min(1).max(5, "Priority must be between 1 and 5"),
  due_date: z.string().nonempty("Due date is required"),
  user: z.string().nonempty("User is required"),
//   restaurant: z.string().nonempty("Restaurant is required"),
});