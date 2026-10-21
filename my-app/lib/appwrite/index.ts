"use server"; //Mark this file to always run on the server in order to keep the secret key hidden

import { Client, Account, TablesDB, Storage, Avatars } from "node-appwrite";
import { appwriteConfig } from "./config";
import { cookies } from "next/headers";

// Create a client authenticated with the current user's session.
//links to a specific user session, lets users make changes that they are allowed to
//each user gets their own session to keep their data secure
export const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

  const session = (await cookies()).get("appwrite-session");

  if (!session || !session.value) {
    console.log("No session found.");
    throw Error("No session found");
  }

  client.setSession(session.value);

  // Expose account and database access using the user's permissions.
  return {
    get account() {
      return new Account(client);
    },
    get tables() {
      return new TablesDB(client);
    },
  };
};

// Create an admin client with elevated permissions using the secret API key.
//to create users, manage database, etc
export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.secretKey);

  // Expose account, database, storage, and avatar services with admin access.
  return {
    get account() {
      return new Account(client);
    },
    get tables() {
      return new TablesDB(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
};
