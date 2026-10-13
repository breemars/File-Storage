"use client";

import { CloudUpload, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { uploadFile } from "@/lib/actions/file.actions";

const FileUploader = ({ accountId }: { accountId: string }) => {
  const [files, setFiles] = useState<File[]>([]); // <> sets the type of the array
  const path = usePathname();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles((prev) => [...prev, ...acceptedFiles]);

      console.log(files);

      //called promises bc we can have multiple files uploading at the same time
      const uploadPromises = acceptedFiles.map((file) => {
        if (file.size > 50 * 1024 * 1024) {
          //50MB
          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name),
          );
          alert(
            `File ${file.name} exceeds the 50MB size limit and will not be uploaded.`,
          );
          return;
        }

        return uploadFile({ file, accountId, path }).then((uploadedFile) => {
          if (uploadedFile) {
            setFiles((prevFiles) =>
              prevFiles.filter((f) => f.name !== file.name),
            );
          }
        });
      });
      await Promise.all(uploadPromises);
    },
    [files, accountId, path], //it says these fields are required but idk why
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const removeFile = (fileName: string) =>
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
  //add functionality to delete the file from the database here

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Button>
        <CloudUpload />
        <span>Upload</span>
      </Button>

      {files.length > 0 && (
        <div className="fixed bottom-0 right-0 z-9999 bg-gray-100 m-5 p-5 rounded-lg shadow-lg">
          <h4>Uploading:</h4>
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
                      removeFile(file.name);
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
