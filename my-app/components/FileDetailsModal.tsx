import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import { convertFileSize, formatDate } from "@/lib/utils";

const FileDetailsModal = ({ file }: { file: Models.DefaultRow }) => {
  return (
    <>
      <div className="flex flex-row gap-3 p-2 border rounded-2xl my-2">
        <Thumbnail type={file.type} extension={file.extension} url={file.url} />
        <div className="flex flex-col gap-2 justify-center">
          <h4>{file.name}</h4>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p>
          Format: <b>{file.extension}</b>
        </p>
        <p>
          Size: <b>{convertFileSize(file.size)}</b>
        </p>
        <p>
          Owner: <b>{file.owner.fullName}</b>
        </p>
        <p>
          Uploaded: <b>{formatDate(file.$createdAt)}</b>
        </p>
        <p>
          Last Edited: <b>{formatDate(file.$updatedAt)}</b>
        </p>
      </div>
    </>
  );
};

export default FileDetailsModal;
