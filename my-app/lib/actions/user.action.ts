'use server';

import { ID, Query } from "node-appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../../lib/utils";
import { clientSideAccount, createAdminClient, createSessionClient } from "../appwrite";

const {
  NEXT_PUBLIC_DATABASE_ID: DATABASE_ID,
  NEXT_PUBLIC_USER_COLLECTION_ID: USER_COLLECTION_ID,
} = process.env;

if (!DATABASE_ID || !USER_COLLECTION_ID) {
  throw new Error("Database or Collection ID is missing");
}

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

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try{
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!
      [Query.equal('userid', [userId])]
    )

    return parseStringify(user.documents[0]);
  } catch(error) {
    console.error(error)
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

    const user = await getUserInfo({ userId: session.$id })

    return parseStringify(user);
  } catch (error) {
    console.error('Error occured when siging in:', error);
  }
};

// export const handleOAuthLogin = async (provider: string, successUrl: string, failureUrl: string) => {
//   return await handleOAuthLogin(provider, successUrl, failureUrl);
// };

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();

    cookies().delete('appwrite-session');

    await account.deleteSession('current');
  } catch (error) {
    console.error('Error logging user out', error)
  }
}