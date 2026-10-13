"use server";

import { createAdminClient } from "../appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { appwriteConfig } from "../appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.actions";

interface Props {
  file: File;
  accountId: string;
  path: string;
}

export const uploadFile = async ({ file, accountId, path }: Props) => {
  const { storage, tables } = await createAdminClient();

  try {
    const inputFile = InputFile.fromBuffer(file, file.name);
    const bucketFile = await storage.createFile({
      bucketId: appwriteConfig.bucketId,
      fileId: ID.unique(),
      file: inputFile,
    });

    //store metadata about the file in the database
    const newFile = await tables
      .createRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.filesId,
        rowId: ID.unique(),
        data: {
          name: bucketFile.name,
          url: constructFileUrl(bucketFile.$id),
          type: getFileType(bucketFile.name).type,
          bucketFileId: bucketFile.$id,
          accountId: accountId,
          owner: accountId,
          extension: getFileType(bucketFile.name).extension,
          size: bucketFile.sizeOriginal,
          sharedWith: [],
        },
      })
      .catch(async (error) => {
        await storage.deleteFile({
          bucketId: appwriteConfig.bucketId,
          fileId: bucketFile.$id,
        });
        handleError(error, "Failed to create file document in database");
      });

    console.log(newFile);

    revalidatePath(path); //revalidate the path to update the UI
    return parseStringify(newFile);
  } catch (error) {
    handleError(error, "Failed to upload file");
  }
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

////////////////////////////////////

const createQueries = (currentUser: Models.DefaultRow) => {
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("sharedWith", [currentUser.email]),
    ]),
  ];

  //search sort limits and more later

  return queries;
};

export const getFiles = async () => {
  const { tables } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    const queries = createQueries(currentUser);

    console.log({ currentUser, queries });

    const files = await tables.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.filesId,
      queries,
    });

    console.log({ files });

    return parseStringify(files);
  } catch (error) {
    handleError(error, "Failed to get files");
  }
};
