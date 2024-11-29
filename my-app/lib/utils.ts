import { type ClassValue, clsx } from "clsx"
import { useRouter } from "next/navigation";
import qs from "query-string";
import { twMerge } from "tailwind-merge"
import { z } from "zod";


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

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

// Define schemas for 'register' and 'signin'
export const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = signinSchema.extend({
  name: z.string().min(3, "Name must be at least 3 characters"),
  restaurant: z.string().nonempty("Restaurant is required"),
  picture: z
    .any()
    .refine(
      (file) => {
        if (file instanceof FileList) {
          return file.length > 0 && file[0] instanceof File;
        }
        return true;
      },
      {
        message: "Profile picture must be a valid file or left blank",
      }
    )
    .optional(),
});

// Discriminated union for type safety
export type AuthFormProps = { type: 'signin' | 'register' };
export type AuthFormSchema = z.infer<typeof signinSchema> | z.infer<typeof registerSchema>;

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