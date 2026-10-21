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

// Upload a file to Appwrite and save its metadata in the database.
export const uploadFile = async ({ file, accountId, path }: Props) => {
  const { storage, tables } = await createAdminClient();

  try {
    const inputFile = InputFile.fromBuffer(file, file.name); // Convert the uploaded file into a format Appwrite can store.
    const bucketFile = await storage.createFile({
      bucketId: appwriteConfig.bucketId,
      fileId: ID.unique(),
      file: inputFile,
    });

    // Save the file's metadata, owner, and sharing details in the database.
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
        // Remove the uploaded file if saving its metadata fails.
        await storage.deleteFile({
          bucketId: appwriteConfig.bucketId,
          fileId: bucketFile.$id,
        });
        handleError(error, "Failed to create file document in database");
      });

    revalidatePath(path); // Refresh the page data so the UI reflects the changes.
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

// Build database queries based on access, filters, sorting, and limits.
const createQueries = (
  currentUser: Models.DefaultRow,
  type: string,
  searchQuery: string,
  sortQuery: string,
  limit?: number,
) => {
  // Include files owned by the user or shared with their email.
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("sharedWith", [currentUser.email]),
    ]),
    Query.select(["*", "owner.fullName"]), // Include each file's data and the owner's full name.
  ];

  // Filter files by category when a type is specified.
  if (type) {
    // Group audio and video files under the media category, everything else is as is
    if (type == "media") {
      queries.push(Query.equal("type", ["audio", "video"]));
    } else {
      queries.push(Query.equal("type", type));
    }
  }

  // Filter files by names that match the search query if given
  if (searchQuery) {
    queries.push(Query.contains("name", searchQuery));
  }

  const [sortBy, orderBy] = sortQuery.split("-"); // Extract the sort field and direction from the sort query.
  queries.push(
    orderBy == "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy),
  );

  // Limit the number of files returned when requested.
  if (limit) {
    queries.push(Query.limit(limit));
  }

  return queries;
};

// Fetch files using the selected filters and calculate storage usage.
//Default values get used when no input is given
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
    // Get the current user before retrieving their accessible files.
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    // Build the database queries from the supplied filters.
    const queries = createQueries(
      currentUser,
      type,
      searchQuery,
      sortQuery,
      limit,
    );

    // Retrieve the matching file records from the database.
    const files = await tables.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.filesId,
      queries,
    });

    // Calculate total storage usage and usage for each file category.
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

      // Count category usage only when viewing all file types.
      if (!type && file.type in typesUsedSpace) {
        typesUsedSpace[file.type as keyof typeof typesUsedSpace].size +=
          file.size;
      }
    });

    totalUsedSpace = Number((totalUsedSpace / (1024 * 1024)).toFixed(2)); //Converts to MB
    if (!type) {
      Object.entries(typesUsedSpace).forEach(([label, data]) => {
        data.size = Number((data.size / (1024 * 1024)).toFixed(2)); //Converts to MB
      });
    }

    // Combine the file results with the calculated storage totals.
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
// Rename a file by updating its database metadata.
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
    const newName = `${name}.${extension}`; // Combine the new filename with its extension.
    // Update the file's name in the database.
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
// Update the list of users who can access a shared file.
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
    // Save the updated sharing permissions in the database.
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
// Delete a file's metadata and its stored content in the bucket.
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
    //Delete from the metadata table
    const deleted = await tables.deleteRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.filesId,
      rowId: fileId,
    });

    //Delete from the bucket if the data record was successful
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
