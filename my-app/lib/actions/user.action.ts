'use server';

import { ID, Query, OAuthProvider, AppwriteException } from "node-appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../../lib/utils";
import { createAdminClient, createSessionClient } from "../appwrite";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { User } from "../interfaces/interface";
import { useToast } from "@/hooks/use-toast";

const {
  NEXT_PUBLIC_DATABASE_ID: DATABASE_ID,
  NEXT_PUBLIC_USER_COLLECTION_ID: USER_COLLECTION_ID,
  NEXT_PUBLIC_RESTAURANT_COLLECTION_ID: RESTAURANT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
  NEXT_PUBLIC_APP_URL: VERIFICATION_URL,
} = process.env;


interface RegisterParams {
  email: string;
  password: string;
  name: string;
  picture: string;
  restaurant: string;
  // [key: string]: any;
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
  } catch (error: any) {
    if (error instanceof AppwriteException) {
      switch(error.code) {
        case 401: redirect('/login'); break;
        case 404: redirect('/signup'); break;
        default: redirect('/error');
      }
    }
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


// export  const  base64ToFile = (base64String: string, fileName: string) => {
//   const [mimeInfo, base64Data] = base64String.split(',');
//   const mimeTypeMatch = mimeInfo.match(/:(.*?);/);
//   if (!mimeTypeMatch) {
//     throw new Error('Invalid base64 string');
//   }
//   const mimeType = mimeTypeMatch[1];

//   const binary = atob(base64Data);
//   const binaryLength = binary.length;
//   const binaryArray = new Uint8Array(binaryLength);

//   for (let i = 0; i < binaryLength; i++) {
//     binaryArray[i] = binary.charCodeAt(i);
//   }

//   const blob = new Blob([binaryArray], { type: mimeType });
//   return new File([blob], fileName, { type: mimeType });
// }



export const register = async ({  ...userData }: RegisterParams) => {
  const { email, name, picture, restaurant, password } = userData;
  let newUserAccount;
  let pictureId = null;
  let account, database, storage;

  const validateInput = (data: any) => {
    const errors: string[] = [];

    if (!data.email || typeof data.email !== 'string' || !data.email.includes('@')) {
      errors.push('Invalid email');
    }
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
      errors.push('Invalid name');
    }
    if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
      errors.push('Invalid password');
    }
    if (data.picture && (typeof data.picture !== 'string' || !data.picture.startsWith('data:image'))) {
      errors.push('Invalid picture format');
    }
    return errors;
  };

  try {
    // Input validation
    const validationErrors = validateInput({ email, name, password, picture });
    if (validationErrors.length > 0) {
      console.error('Validation Errors:', validationErrors);
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    // Initialize Appwrite services
    ({ account, database, storage } = await createAdminClient());

    // Verbose logging for input
    console.log('Registration Input:', {
      email,
      name,
      pictureLength: picture ? picture.length : 'No picture',
      restaurant,
    });

    // 1. Create the user account
    try {
      newUserAccount = await account.create(ID.unique(), email, password, name);
    } catch (error: any) {
      console.error('Account Creation Error:', {
        message: error.message,
        code: error.code,
        type: error.response?.type,
        response: error.response,
      });
      throw error;
    }

    // Helper function to convert Base64 to File
    const base64ToFile = (base64String: string, fileName: string) => {
      const [mimeInfo, base64Data] = base64String.split(',');
      const mimeTypeMatch = mimeInfo.match(/:(.*?);/);
      if (!mimeTypeMatch) {
        throw new Error('Invalid base64 string');
      }
      const mimeType = mimeTypeMatch[1];
      const binary = atob(base64Data);
      const binaryArray = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        binaryArray[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([binaryArray], { type: mimeType });
      return new File([blob], fileName, { type: mimeType });
    };

    const file = base64ToFile(picture, `image.jpg`);

    // 2. Picture upload if provided
    if (picture && BUCKET_ID) {
      try {
        const pictureResponse = await storage.createFile(
          BUCKET_ID!,
          ID.unique(),
          file
        );
        pictureId = pictureResponse.$id;
      } catch (error: any) {
        console.error('Picture Upload Error:', {
          message: error.message,
          code: error.code,
          response: error.response,
        });
      }
    }

    // 3. Create user document
    try {
      const newUser = await database.createDocument(
        DATABASE_ID!,
        USER_COLLECTION_ID!,
        newUserAccount.$id,
        {
          //...userData,
          userid: newUserAccount.$id,
          name: newUserAccount.name,
          email: newUserAccount.email,
          picture: pictureId,
          restaurant,
          can_assign_tasks: false,
          assigned_tasks: [],
          email_verified: false,
          created_at: new Date(newUserAccount.$createdAt).toISOString(),
          updated_at: new Date().toISOString(),
        }
      );

    } catch (error: any) {
      console.error('Document Creation Error:', {
        message: error.message,
        code: error.code,
        response: error.response,
      });
      throw error;
    }

    // 4. Send verification email
    try {
      const verification = await account.createVerification(
        `${VERIFICATION_URL}/verification`
      );
      if (!verification) {
        console.warn('Verification email not sent - user can resend later');
      }
    } catch (error: any) {
      console.error('Verification Email Error:', {
        message: error.message,
        code: error.code,
        response: error.response,
      });
    }

    // 5. Create a session for the new user
    try {
      const session = await account.createEmailPasswordSession(email, password);
      cookies().set('appwrite-session', session.secret, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
      });
    } catch (error: any) {
      console.error('Session Creation Error:', {
        message: error.message,
        code: error.code,
        response: error.response,
      });
      throw error;
    }

    return parseStringify(newUserAccount);

  } catch (error: any) {
    console.error('Complete Registration Error:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
      response: error.response,
    });

    // Cleanup if the user account was created but other steps failed
    if (newUserAccount) {
      try {
        if (account) {
          await account.deleteSession(newUserAccount.$id);
        }
      } catch (error: any) {
        console.error('Cleanup Error:', {
          message: error.message,
          code: error.code,
          response: error.response,
        });
      }
    }

    throw error;
  }
};

// Utility function for parsing objects
// function parseStringify(obj: any) {
//   return JSON.parse(JSON.stringify(obj));
// }






export const getLoggedInUser = async () => {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo( result.$id)

    return parseStringify(user);
  } catch (error: any) {
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