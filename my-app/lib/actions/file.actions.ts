"use server";

import { createAdminClient } from "../appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { appwriteConfig } from "../appwrite/config";
import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { revalidatePath } from "next/cache";

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
