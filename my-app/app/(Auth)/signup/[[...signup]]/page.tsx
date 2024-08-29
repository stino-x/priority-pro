"use client";

import { useState } from "react";
import { account, ID } from "../../../appwrite";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  full_name: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const LoginPage = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
    },
  })

  const logout = async () => {
    await account.deleteSession("current");
    setLoggedInUser(null);
  };

  const login = async (email: string, password: string) => {
    const session = await account.createEmailPasswordSession(email, password);
    setLoggedInUser(await account.get());
  };

  const register = async (values: z.infer<typeof formSchema>) => {
    await account.create(ID.unique(), values.email, values.password, values.full_name);
    login(values.email, values.password);
  };

  const handleLogin = async () => {
    account.createOAuth2Session(
      'google',
      'http://localhost:3000',
      'http://localhost:3000/fail'
    )
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    register(values);
  }

  return (
    <main className="w-[100vw] h-[100vh] bg-slate-100 flex justify-center items-center">
      {loggedInUser ? (
        <p>Logged in as: {loggedInUser.name}</p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-[80vw] sm:w-[40vw] rounded shadow-md shadow-slate-950 p-12 bg-[#fff]">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input className="border-slate-600 bg-[transparent] border-2 rounded" placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input className="border-slate-600 bg-[transparent] border-2 rounded" placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input className="border-slate-600 bg-[transparent] border-2 rounded" type="password" placeholder="*********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-4">Register</Button>
            <Button type="button" onClick={handleLogin} className="mt-4 ml-4">Login with Google</Button>
            <button type="button" onClick={logout}>
              Logout
            </button>
          </form>
        </Form>
      )}
    </main>
  );
};

export default LoginPage;