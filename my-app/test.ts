try {
  const { account, database, storage } = await createAdminClient();
  newUserAccount = await account.create(ID.unique(), email, password, name);

  if (!newUserAccount) throw new Error('Error creating user');

  const  base64ToFile = (base64String, fileName) => {
    const [mimeInfo, base64Data] = base64String.split(',');
    const mimeType = mimeInfo.match(/:(.*?);/)[1];
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

  const newUser = await database.createDocument(
    DATABASE_ID!,
    USER_COLLECTION_ID!,
@@ -102,7 +115,7 @@ export const register = async ({ password, ...userData }: SignUpParams) => {
      userid: newUserAccount.$id,
      name: newUserAccount.name,
      email: newUserAccount.email,
      picture: pictureId,
      can_assign_tasks: false,
      assigned_tasks: [],
      created_at: new Date(newUserAccount.$createdAt).toISOString(),
@@ -122,7 +135,7 @@ export const register = async ({ password, ...userData }: SignUpParams) => {
  return parseStringify(newUser);
} catch (error) {
  console.error('Error during user registration:', error);
  throw error;
}
};









