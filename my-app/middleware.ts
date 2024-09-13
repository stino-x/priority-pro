import { NextResponse } from 'next/server';
import { Client, Account } from 'appwrite';

const client = new Client();
client
.setEndpoint(`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}`) // Use environment variable for endpoint
.setProject(`${process.env.NEXT_PUBLIC_PROJECT_ID}`); // Use environment variable for project ID

async function isAuthenticated(req: any) {
    const account = new Account(client);
    try {
        // Check if the user is authenticated by checking the session
        await account.get();
        return true;
    } catch (error) {
        // User is not authenticated
        return false;
    }
}

export async function middleware(req: any) {
    const isAuth = await isAuthenticated(req);

    if (!isAuth) {
        // Redirect to the login page if the user is not authenticated
        return NextResponse.redirect(new URL('/signin', req.url));
    }

    // If authenticated, continue with the request
    return NextResponse.next();
}

// Apply the middleware to protected routes
export const config = {
    matcher: ['/:path*', '!/signin', '!/signup', '!/public/:path*'], // Exclude certain routes
};
