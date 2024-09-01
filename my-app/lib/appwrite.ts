"use server";

import { Databases, Users, Client, Account, OAuthProvider } from "node-appwrite";
import { cookies } from "next/headers";

async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!);

  const session = cookies().get("appwrite-session");
  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
    get users() {
      return new Users(client);
    }
  };
}

// async function clientSideAccount() {
//   const client = new Client()
//     .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? '')
//     .setProject(process.env.NEXT_PUBLIC_PROJECT_ID ?? '');
//     .setKey(process.env.NEXT_APPWRITE_KEY!);

//   return new Account(client);
// }

// export const handleOAuthLogin = async (provider: string, successUrl: string, failureUrl: string) => {
//   try {
//     const account = await clientSideAccount();
//     const result = account.createOAuth2Session(provider, successUrl, failureUrl);
//     return result;
//   } catch (error) {
//     console.error('OAuth Login Error', error);
//     throw error;
//   }
// };

export { createSessionClient, createAdminClient };