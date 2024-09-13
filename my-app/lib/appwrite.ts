"use server";

import { Databases, Users, Client, Account } from "node-appwrite";
import { cookies } from "next/headers";

// Define a single instance of the Client object
let sessionClient: Client | null = null;
let adminClient: Client | null = null;

// Function to create or return the session client (reused)
async function createSessionClient() {
  // Only create the session client if it hasn't been instantiated already
  if (!sessionClient) {
    sessionClient = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!);
  }

  const session = cookies().get("appwrite-session");

  if (!session || !session.value) {
    throw new Error("No session");
  }

  sessionClient.setSession(session.value);

  return {
    get account() {
      return new Account(sessionClient!);
    },
  };
}

// Function to create or return the admin client (reused)
async function createAdminClient() {
  // Only create the admin client if it hasn't been instantiated already
  if (!adminClient) {
    adminClient = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!)
      .setKey(process.env.NEXT_PUBLIC_API_KEY!);
  }

  return {
    get account() {
      return new Account(adminClient!);
    },
    get database() {
      return new Databases(adminClient!);
    },
    get user() {
      return new Users(adminClient!);
    },
  };
}

export { createSessionClient, createAdminClient };