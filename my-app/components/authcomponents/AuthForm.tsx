'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomInput from './CustomInput';
import {AuthFormProps, AuthFormSchema, signinSchema, registerSchema } from '@/lib/utils';
import { register, signIn, handleOAuthLogin, getLoggedInUser } from '@/lib/actions/user.action';
import useGetRestaurants from "@/lib/hooks/useGetRestaurants";
import { useToast } from "@/hooks/use-toast";

const AuthForm = ({ type }: AuthFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState(null);
  const { restaurants } = useGetRestaurants();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getLoggedInUser();
        if (userData) {
          setUser(userData);
          router.push('/');
        }
      } catch (error) {
        console.error('Failed to fetch logged-in user:', error);
      }
    };

    fetchUser();
  }, [router]);

  // Select schema and default values based on `type`
  const formSchema = type === 'signin' ? signinSchema : registerSchema;
  const defaultValues: Partial<AuthFormSchema> =
    type === 'register'
      ? {
          name: "",
          email: "",
          password: "",
          restaurant: "",
          picture: null,
        }
      : {
          email: "",
          password: "",
        };

  const form = useForm<AuthFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: AuthFormSchema) => {
    setIsLoading(true);
    setError(null);

    try {
      if (type === 'register' && 'picture' in data) {
        const file = (data.picture as FileList)?.[0] || null;

        let pictureBase64 = null;
        if (file) {
          pictureBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
        }

        const userData = {
          name: data.name!,
          email: data.email,
          password: data.password,
          restaurant: data.restaurant!,
          picture: pictureBase64 as string,
        };

        const newUser = await register(userData);
        if (newUser) router.push('/verification');
      }

      if (type === 'signin') {
        const userData = {
          email: data.email,
          password: data.password,
        };

        const signInResult = await signIn(userData);
        if (signInResult) router.push('/dashboard');
      }
    } catch (error) {
      console.error(`Error during ${type}:`, error);
      toast({
        title: `Error during ${type}:`,
        description: "Please try again.",
        variant: "destructive",
      });
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await handleOAuthLogin();
    } catch (error) {
      console.error('Error during Google login:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred during Google login');
    }
  };

  return (
    <main className="w-[100vw] h-[100vh] bg-slate-100 flex flex-col justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[80vw] sm:w-[40vw] rounded shadow-md shadow-slate-950 p-12 bg-[#fff]"
        >
          {type === 'register' && (
            <CustomInput control={form.control} name="name" label="Full Name" placeholder="Enter your full name" />
          )}

          <CustomInput control={form.control} name="email" label="Email" placeholder="Enter your email" />
          <CustomInput control={form.control} name="password" label="Password" placeholder="Enter your password" />

          {type === 'register' && (
            <CustomInput
              control={form.control}
              name="restaurant"
              label="Your Restaurant Name"
              isDropdown
              options={restaurants.map((restaurant: any) => ({
                label: restaurant.name,
                value: restaurant.$id,
              }))}
            />
          )}

          {type === 'register' && (
            <CustomInput
              control={form.control}
              name="picture"
              label="Picture"
              isUploadFile={true}
              type="file"
            />
          )}

          {error && <p className="text-red-500 mt-2">{error}</p>}

          <Button type="submit" className="mt-4 w-full">
            {isLoading ? 'Loading...' : type === 'signin' ? 'Sign In' : 'Register'}
          </Button>
        </form>
      </Form>

      <Button type="button" onClick={handleGoogleLogin} className="mt-4 w-[80vw] sm:w-[40vw]">
        Login with Google
      </Button>

      <footer className="flex justify-center gap-1 mt-4">
        <p className="text-14 font-normal text-gray-600">
          {type === 'signin' ? "Don't have an account?" : "Already have an account?"}
        </p>
        <Link href={type === 'signin' ? '/signup' : '/signin'} className="form-link">
          {type === 'signin' ? 'Register' : 'Sign in'}
        </Link>
      </footer>
    </main>
  );
};

export default AuthForm;