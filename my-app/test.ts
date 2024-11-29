

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





