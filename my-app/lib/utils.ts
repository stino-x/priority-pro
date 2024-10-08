import { type ClassValue, clsx } from "clsx"
import { useRouter } from "next/navigation";
import qs from "query-string";
import { twMerge } from "tailwind-merge"
import { z } from "zod";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
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

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}