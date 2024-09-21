'use server';

import { ID, Query, OAuthProvider } from "node-appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../../lib/utils";
import { createAdminClient, createSessionClient } from "../appwrite";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const {
  NEXT_PUBLIC_DATABASE_ID: DATABASE_ID,
  NEXT_PUBLIC_USER_COLLECTION_ID: USER_COLLECTION_ID,
  NEXT_PUBLIC_RESTAURANT_COLLECTION_ID: RESTAURANT_COLLECTION_ID,
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
  userid: string,
}

export const getUserInfo = async ({ userid }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal('userid', [userid])]
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

    const user = await getUserInfo({ userid: session.userId })

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

    const user = await getUserInfo({ userid: result.$id})

    return parseStringify(user);
  } catch (error) {
    console.log(error)
    return null;
  }
}

export const handleOAuthLogin = async () => {
    const { account } = await createAdminClient();

    const origin = headers().get("origin");

    const redirectUrl = await account.createOAuth2Token(
      OAuthProvider.Google,
      `${origin}/`,
      `${origin}/signup`,
    );

    redirect(redirectUrl);
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

export const getRestaurants = async () => { 
  try {
    const { database } = await createAdminClient();
    const restaurants = await database.listDocuments(
      DATABASE_ID!,
      RESTAURANT_COLLECTION_ID!);

    return parseStringify(restaurants.documents);
  } catch (error) {
    console.error("Error fetching the Appwrite database:", error);
    return null;
  }
};