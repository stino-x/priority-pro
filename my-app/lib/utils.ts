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
})