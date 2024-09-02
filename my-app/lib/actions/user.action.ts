'use server';

import { ID, Query, OAuthProvider } from "node-appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../../lib/utils";
import { createAdminClient, createSessionClient } from "../appwrite";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

const {
  NEXT_PUBLIC_DATABASE_ID: DATABASE_ID,
  NEXT_PUBLIC_USER_COLLECTION_ID: USER_COLLECTION_ID,
} = process.env;

interface SignUpParams {
  email: string;
  password: string;
  name: string;
  [key: string]: any;
}

interface SignInParams {
  email: string;
  password: string;
}

interface getUserInfoProps {
  userId: string,
}

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal('userid', [userId])]
    )

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error)
  }
}

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    console.log(session)
    const user = await getUserInfo({ userId: session.$id })

    return parseStringify(user);
  } catch (error) {
    console.error('Error occured when siging in:', error);
  }
};

export const register = async ({ password, ...userData }: SignUpParams) => {
  const { email, name } = userData;

  let newUserAccount;

  try {
    const { account, database } = await createAdminClient();
    newUserAccount = await account.create(ID.unique(), email, password, name);

    if (!newUserAccount) throw new Error('Error creating user');

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userid: newUserAccount.$id,
        name: newUserAccount.name,
        email: newUserAccount.email,
        can_assign_tasks: false,
        assigned_tasks: [],
        created_at: new Date(newUserAccount.$createdAt).toISOString(),
        updated_at: new Date().toISOString()
      }
    );

    const session = await account.createEmailPasswordSession(email, password);
    console.log(session);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    console.error('Error during user registration:', error);
  }
};

export const getLoggedInUser = async () => {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({ userId: result.$id})

    return parseStringify(user);
  } catch (error) {
    console.log(error)
    return null;
  }
}

export const handleOAuthLogin = async () => {
  try {
    const { account } = await createAdminClient();

    const redirectUrl = await account.createOAuth2Token(
      OAuthProvider.Google,
      'http://localhost:3000',
      'http://localhost:3000/fail'
    );

    redirect(redirectUrl);
  } catch (error) {
    console.error('Error logging in with Google:', error);
  }
};

export async function GET (request: Request) {
  try {
    const url = new URL(request.url);

    const userId = url.searchParams.get("userId");
    const secret = url.searchParams.get("secret");

    if (!userId || !secret) {
      throw new Error("Missing userId or secret in the callback URL.");
    }

    const { account } = await createAdminClient();
    const session = await account.createSession(userId, secret);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return NextResponse.redirect(`/`);
  } catch (error) {
    console.error('Error during OAuth callback:', error);
    return NextResponse.redirect(`${new URL(request.url).origin}/auth-error`);
  }
};


export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();

    cookies().delete('appwrite-session');

    await account.deleteSession('current');
  } catch (error) {
    return null;
  }
}