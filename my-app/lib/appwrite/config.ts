export const appwriteConfig = {
  endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
  usersId: process.env.NEXT_PUBLIC_APPWRITE_USERS!,
  filesId: process.env.NEXT_PUBLIC_APPWRITE_FILES!,
  bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET!,
  secretKey: process.env.NEXT_APPWRITE_KEY!,
};

//The 'public' keyword is necessary for the env vars to be available on the frontend
//secret key does not have 'public' as it will only be used on the backend
