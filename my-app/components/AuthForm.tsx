"use client";

import { useState } from "react";
import Link from 'next/link'
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
import { useRouter } from 'next/navigation';
import { register, handleOAuthLogin, signIn } from '@/lib/actions/user.action';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }).optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const AuthForm = ({ type }: { type: 'signin' | 'register' }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      if(type === 'register') {
        const userData = {
          name: data.name!,
          email: data.email,
          password: data.password
        }

        await register(userData);
        router.push('/');
      }

      if(type === 'signin') {
        const response = await signIn({
          email: data.email,
          password: data.password,
        })

        if(response) router.push('/');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await handleOAuthLogin('google', '/dashboard', '/auth/error');
    } catch (error) {
      console.error('Google login error:', error);
    }
  }

  return (
    <main className="w-[100vw] h-[100vh] bg-slate-100 flex flex-col justify-center items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[80vw] sm:w-[40vw] rounded shadow-md shadow-slate-950 p-12 bg-[#fff]">
          {type === 'register' && (
            <>
              <FormField
                control={form.control}
                name="name"
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
            </>
          )}

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

          <Button type="submit" className="mt-4 w-full" disabled={isLoading}>
            {isLoading ? 'Loading...' : (type === 'signin' ? 'Sign In' : 'Register')}
          </Button>
        </form>
      </Form>

      <Button type="button" onClick={handleGoogleLogin} className="mt-4 w-[80vw] sm:w-[40vw]">
        Login with Google
      </Button>

      <footer className="flex justify-center gap-1 mt-4">
        <p className="text-14 font-normal text-gray-600">
          {type === 'signin'
          ? "Don't have an account?"
          : "Already have an account?"}
        </p>
        <Link href={type === 'signin' ? '/signup' : '/signin'} className="form-link">
          {type === 'signin' ? 'Register' : 'Sign in'}
        </Link>
      </footer>
    </main>
  );
};

export default AuthForm;