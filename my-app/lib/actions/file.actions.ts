"use server";

import { createAdminClient } from "../appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { appwriteConfig } from "../appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.actions";
import { parse } from "path";

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
    Query.select(["*", "owner.*"]), //grabs all the owner information, can limit to what is needed later: Query.select(["*", "owner.$id", "owner.fullName"]) etc
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

//////////////////////////////////////

//RENAME FILE
export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: {
  fileId: string;
  name: string;
  extension: string;
  path: string;
}) => {
  const { tables } = await createAdminClient();

  try {
    const newName = `${name}.${extension}`;
    const updatedFile = await tables.updateRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.filesId,
      rowId: fileId,
      data: {
        name: newName,
      },
    });

    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to Rename File");
  }
};

//////////////////////////////////////

//SHARE A FILE
export const updateFileSharedWith = async ({
  fileId,
  emails,
  path,
}: {
  fileId: string;
  emails: string[];
  path: string;
}) => {
  const { tables } = await createAdminClient();

  try {
    const updatedFile = await tables.updateRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.filesId,
      rowId: fileId,
      data: {
        sharedWith: emails,
      },
    });

    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to Share File");
  }
};

//////////////////////////////////////

//DELETE A FILE
export const deleteFile = async ({
  fileId,
  bucketFileId,
  path,
}: {
  fileId: string;
  bucketFileId: string;
  path: string;
}) => {
  const { tables, storage } = await createAdminClient();

  try {
    //Deleting from the metadata table
    const deleted = await tables.deleteRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.filesId,
      rowId: fileId,
    });

    //Deleting from the bucket
    if (deleted) {
      await storage.deleteFile({
        bucketId: appwriteConfig.bucketId,
        fileId: bucketFileId,
      });
    }

    revalidatePath(path);
    return parseStringify({ status: "success" });
  } catch (error) {
    handleError(error, "Failed to Share File");
  }
};
