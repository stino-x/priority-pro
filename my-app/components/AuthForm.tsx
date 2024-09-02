"use client";

import { useState } from "react";
import Link from 'next/link'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomInput from './CustomInput';
import { useRouter } from 'next/navigation';
import { authFormSchema } from '@/lib/utils';
import { register, signIn } from '@/lib/actions/user.action';

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authFormSchema(type)

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

        const newUser = await register(userData);
        setUser(newUser);
        if(newUser) router.push('/');
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

  // const handleGoogleLogin = async () => {
  //   try {
  //     await handleOAuthLogin('google', '/dashboard', '/auth/error');
  //   } catch (error) {
  //     console.error('Google login error:', error);
  //   }
  // }

  return (
    <main className="w-[100vw] h-[100vh] bg-slate-100 flex flex-col justify-center items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[80vw] sm:w-[40vw] rounded shadow-md shadow-slate-950 p-12 bg-[#fff]">
          {type === 'register' && (
            <>
              <CustomInput control={form.control} name='name' label="Full Name" placeholder='Enter your full name' />
            </>
          )}

          <CustomInput control={form.control} name='email' label="Email" placeholder='Enter your email' />

          <CustomInput control={form.control} name='password' label="Password" placeholder='Enter your password' />

          <Button type="submit" className="mt-4 w-full" disabled={isLoading}>
            {isLoading ? 'Loading...' : (type === 'signin' ? 'Sign In' : 'Register')}
          </Button>
        </form>
      </Form>

      <Button type="button" className="mt-4 w-[80vw] sm:w-[40vw]">
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