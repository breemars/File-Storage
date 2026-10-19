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

const createQueries = (
  currentUser: Models.DefaultRow,
  type: string,
  searchQuery: string,
  sortQuery: string,
  limit?: number,
) => {
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("sharedWith", [currentUser.email]),
    ]),
    Query.select(["*", "owner.*"]), //grabs all the owner information, can limit to what is needed later: Query.select(["*", "owner.$id", "owner.fullName"]) etc
  ];

  //If a type is given, add an additional query to the array
  if (type) {
    //type audio or video should be sorted into 'media', everything else is as is
    if (type == "media") {
      queries.push(Query.equal("type", ["audio", "video"]));
    } else {
      queries.push(Query.equal("type", type));
    }
  }

  if (searchQuery) {
    queries.push(Query.contains("name", searchQuery));
  }

  const [sortBy, orderBy] = sortQuery.split("-");
  queries.push(
    orderBy == "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy),
  );

  if (limit) {
    queries.push(Query.limit(limit));
  }

  return queries;
};

//input = default value
//but we also set default values in page.tsx too... two places?
//def need them here tho
//defaults get used when no input is given
export const getFiles = async ({
  type = "",
  searchQuery = "",
  sortQuery = "$createdAt-desc",
  limit,
}: {
  type?: string;
  searchQuery?: string;
  sortQuery?: string;
  limit?: number;
}) => {
  const { tables } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    const queries = createQueries(
      currentUser,
      type,
      searchQuery,
      sortQuery,
      limit,
    );

    const files = await tables.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.filesId,
      queries,
    });

    let totalUsedSpace = 0;

    const typesUsedSpace = {
      images: { size: 0 },
      documents: { size: 0 },
      video: { size: 0 },
      audio: { size: 0 },
      other: { size: 0 },
    };

    files.rows.forEach((file) => {
      totalUsedSpace += file.size;

      if (!type && file.type in typesUsedSpace) {
        typesUsedSpace[file.type as keyof typeof typesUsedSpace].size +=
          file.size;
      }
    });

    totalUsedSpace = Number((totalUsedSpace / (1024 * 1024)).toFixed(2)); //Converts to MB
    if (!type) {
      Object.entries(typesUsedSpace).forEach(([label, data]) => {
        data.size = Number((data.size / (1024 * 1024)).toFixed(2));
      });
    }

    const allFiles = {
      ...files,
      totalUsedSpace,
      typesUsedSpace,
    };

    return parseStringify(allFiles);
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
