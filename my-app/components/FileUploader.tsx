"use client";

import { CloudUpload, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { deleteFile, getFiles, uploadFile } from "@/lib/actions/file.actions";

const FileUploader = ({ accountId }: { accountId: string }) => {
  // Store the files currently being uploaded.
  const [files, setFiles] = useState<File[]>([]); // <> sets the type of the array
  const path = usePathname();

  // Handle selected or dropped files and upload them.
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Add the selected files to the upload list.
      setFiles((prev) => [...prev, ...acceptedFiles]);

      //Using promises to have multiple files uploading at the same time
      //Create upload tasks so multiple files can upload concurrently.
      const uploadPromises = acceptedFiles.map((file) => {
        // Reject files larger than the 50 MB limit.
        if (file.size > 50 * 1024 * 1024) {
          // Remove the oversized file from the upload list.
          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name),
          );
          alert(
            `File ${file.name} exceeds the 50MB size limit and will not be uploaded.`,
          );
          return;
        }

        // Upload the file and remove it from the list when finished.
        return uploadFile({ file, accountId, path }).then((uploadedFile) => {
          if (uploadedFile) {
            setFiles((prevFiles) =>
              prevFiles.filter((f) => f.name !== file.name),
            );
          }
        });
      });
      // Wait for all upload tasks to finish.
      await Promise.all(uploadPromises);
    },
    [accountId, path], // Recreate the callback when the account ID or current path changes.
  );

  // Configure the dropzone to handle file selection and drag-and-drop.
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // Remove a file from the upload list and delete it from storage.
  const onRemove = async (fileName: string) => {
    // Remove the selected file from the displayed upload list.
    setFiles((prev) => prev.filter((file) => file.name !== fileName));

    // Find the uploaded file by name so it can be deleted.
    const res = await getFiles({
      searchQuery: fileName,
      sortQuery: "$createdAt-desc",
      limit: 1,
    });
    const fileToDelete = res.rows[0];

    let success = false;

    // Delete the file using its database ID and storage ID.
    success = await deleteFile({
      fileId: fileToDelete.$id,
      bucketFileId: fileToDelete.bucketFileId,
      path,
    });

    if (!success) console.log("Error removing file from upload");
  };

  return (
    <div {...getRootProps()}>
      {/* File upload button and drop-enabled upload area. */}
      <input {...getInputProps()} />
      <Button>
        <CloudUpload />
        <span>Upload</span>
      </Button>

      {files.length > 0 && (
        <div className="fixed bottom-0 right-0 z-9999 bg-gray-100 m-5 p-5 rounded-lg shadow-lg">
          <h4>Uploading:</h4>
          {/* Displays all the files currently uploading */}
          <ul>
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`}>
                <div className="flex items-center gap-3">
                  <Spinner />
                  {file.name}
                  <Button
                    className="bg-transparent p-2"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the click event from propagating to the parent elements
                      onRemove(file.name); // Removes the file if the user selects the cancel button
                    }}
                  >
                    <X color="#aa1818" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
