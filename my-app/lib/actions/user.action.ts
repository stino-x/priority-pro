'use server';

import { ID, Query, OAuthProvider } from "node-appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../../lib/utils";
import { createAdminClient, createSessionClient } from "../appwrite";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { User } from "../interfaces/interface";
import { useToast } from "@/hooks/use-toast";
import { Client, Account } from "appwrite";

const {
  NEXT_PUBLIC_DATABASE_ID: DATABASE_ID,
  NEXT_PUBLIC_USER_COLLECTION_ID: USER_COLLECTION_ID,
  NEXT_PUBLIC_RESTAURANT_COLLECTION_ID: RESTAURANT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
} = process.env;


interface RegisterParams {
  email: string;
  password: string;
  name: string;
  picture: string;
  [key: string]: any;
}

interface SignInParams {
  email: string;
  password: string;
}

interface getUserInfoProps {
  userid: string,
}



export const getUserInfo = async ( userid: string ) => {
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
    console.log('#######', account);
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const user = await getUserInfo( session.userId )

    return parseStringify(user);
  } catch (error) {
    console.error('Error occurred when sign in:', error);
  }
};

export const handleVerification = async () => {
  try {
    const { account, database } = await createAdminClient();
    
    // Get the current user - this will work if they're in a verification flow
    const currentUser = await account.get();
    
    // Check if the email is verified
    if (currentUser.emailVerification) {
      // Update our database to match Appwrite's verification status
      await database.updateDocument(
        DATABASE_ID!,
        USER_COLLECTION_ID!,
        currentUser.$id,
        { email_verified: true }
      );
      
      redirect('/dashboard');
    } else {
      redirect('/resend-verification');
    }
  } catch (error) {
    console.error('Verification error:', error);
    redirect('/error');
  }
};

export const getProfilePic = async (fileId: string) => {
  try {
    const { storage } = await createAdminClient();
    const result = await storage.getFilePreview(BUCKET_ID!, fileId);
    const buffer = result instanceof ArrayBuffer ? result : new ArrayBuffer(0);
    if (buffer.byteLength === 0) throw new Error("Failed to fetch profile picture buffer");
    const base64String = Buffer.from(buffer).toString('base64');
    return `data:image/jpeg;base64,${base64String}`;
  } catch (error) {
    console.error("Error fetching profile picture:", error);
  }
};


export const resendVerificationEmail = async () => {
  const { account } = await createSessionClient();
  try {
    await account.createVerification(
      `${process.env.NEXT_PUBLIC_APP_URL}/verification`
    ); // Replace with your redirect URL after verification
    return { success: true, message: 'Verification email sent successfully' };
  } catch (error) {
    console.error('Error resending verification email:', error);
    throw new Error('Failed to resend verification email');
  }
};


export const register = async ({ password, ...userData }: RegisterParams) => {
  const { email, name, picture } = userData;
  let newUserAccount;
  let pictureId = null;
  let account, database, storage;

  try {
    ({ account, database, storage } = await createAdminClient());

    // 1. Create the user account first
    newUserAccount = await account.create(ID.unique(), email, password, name);
    if (!newUserAccount) throw new Error('Error creating user');

    const  base64ToFile = (base64String: string, fileName: string) => {
      const [mimeInfo, base64Data] = base64String.split(',');
      const mimeTypeMatch = mimeInfo.match(/:(.*?);/);
      if (!mimeTypeMatch) {
        throw new Error('Invalid base64 string');
      }
      const mimeType = mimeTypeMatch[1];
      const binary = atob(base64Data);
      const binaryLength = binary.length;
      const binaryArray = new Uint8Array(binaryLength);
      for (let i = 0; i < binaryLength; i++) {
        binaryArray[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([binaryArray], { type: mimeType });
      return new File([blob], fileName, { type: mimeType });
    }

    const file = base64ToFile(picture, `image.jpg`);

    let pictureId = null;
    if (picture && BUCKET_ID) {
      const pictureResponse = storage.createFile(
        BUCKET_ID,
        ID.unique(),
        file
      );
      pictureId = (await pictureResponse).$id;
    }

    // 3. Create user document using the same ID as the account
    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      newUserAccount.$id, // Use same ID as account
      {
        ...userData,
        userid: newUserAccount.$id,
        name: newUserAccount.name,
        email: newUserAccount.email,
        picture: pictureId,
        can_assign_tasks: false,
        assigned_tasks: [],
        email_verified: false,
        created_at: new Date(newUserAccount.$createdAt).toISOString(),
        updated_at: new Date().toISOString(),
      }
    );

    // 4. Send verification email
    // try {
    //   const verification = await account.createVerification(
    //     `${process.env.NEXT_PUBLIC_APP_URL}/verification`
    //   );
    //   if (!verification) {
    //     // Log but don't throw - user can request verification email later
    //     console.warn('Verification email not sent - will need to resend');
    //   }
    // } catch (verificationError) {
    //   console.error('Error sending verification:', verificationError);
    //   // Continue registration but flag for follow-up
    // }

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });


    return parseStringify(newUser);
  } catch (error) {
    // If account was created but later steps failed, clean up
    if (newUserAccount) {

      try {
        if (account) {
          await account.deleteSession('current');
        }
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
    }
    console.error('Error during user registration:', error);
    throw error;
  }
};





export const getLoggedInUser = async () => {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo( result.$id)

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

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const { database, account } = await createAdminClient();

    const currentUser = await getLoggedInUser();
    const {userid} = currentUser;

    const user = await database.listDocuments(
      `${process.env.NEXT_PUBLIC_DATABASE_ID}`,
      `${process.env.NEXT_PUBLIC_USER_COLLECTION_ID}`,
      [Query.equal('userid', userid)]
    );

    if (user.documents.length === 0) {
      throw new Error('User not found');
    }

    const restaurantId = user.documents[0].restaurant.$id;

    const users = await database.listDocuments(
      `${process.env.NEXT_PUBLIC_DATABASE_ID}`,
      `${process.env.NEXT_PUBLIC_USER_COLLECTION_ID}`,
      [Query.equal('restaurant', restaurantId)]
    );

    return parseStringify(users.documents) as User[];

  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}