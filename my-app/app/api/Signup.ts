import { Client, Account, ID } from "appwrite";
import { databases } from "../../lib/appwrite";


export default async function Signup(req: any, res: any) {

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { username, email, password } = req.body;
    const client = new Client()
    .setProject(process.env.NEXT_PROJECT_ID ?? ''); // Your project ID

    const account = new Account(client);
    
    const uniqueid = ID.unique();
    try {
        const response = await account.create(uniqueid, email, password);
        res.status(201).json({ success: true, user: response });
        const userDocument = {
            userId: response.$id,             // User ID from Appwrite
            name: username,                    // User name from form, default to empty string if not provided
            email: response.email,            // User's email
            can_assign_tasks: false,              // Default value, adjust as needed
            assigned_tasks: [],                  // Default empty array, adjust as needed
            created_at: new Date(response.$createdAt).toISOString(), // Date when user was created
            updated_at: new Date().toISOString()  // Current date and time
        };

        // Save the custom user model to your Appwrite database
        const result = await databases.createDocument(
            process.env.NEXT_PROJECT_ID ?? '',            // Replace with your database ID
            process.env.NEXT_USER_COLLECTION_ID ?? '',     // Replace with your User collection ID
            ID.unique(),                   // Generate a unique ID for the document
            userDocument                   // The custom user model object
        );

        console.log('Custom user model saved:', result);
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }

// const promise = account.create(uniqueid, 'email@example.com', 'PASSWORD');

// promise.then(function (response) {
//     console.log(response); // Success
// }, function (error: any) {
//     console.log(error); // Failure
// });
}

