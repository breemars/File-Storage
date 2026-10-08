export const appwriteConfig = {
  endpointUrl: process.env.NEXT_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_APPWRITE_PROJECT_ID!,
  databaseId: process.env.NEXT_APPWRITE_DATABASE!,
  usersId: process.env.NEXT_APPWRITE_USERS!,
  filesId: process.env.NEXT_APPWRITE_FILES!,
  bucketId: process.env.NEXT_APPWRITE_BUCKET!,
  secretKey: process.env.NEXT_APPWRITE_KEY!,
};
