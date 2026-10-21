import Link from "next/link";
import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import { convertFileSize, formatDate } from "@/lib/utils";
import CardActionsDropdown from "./CardActionsDropdown";

const Card = ({ file }: { file: Models.DefaultRow }) => {
  // 'target' opens the file URL in a new browser tab.
  return (
    <Link
      href={file.url}
      target="_blank"
      className="bg-white rounded-4xl p-5 shadow-gray-200 shadow-md"
    >
      {/* Display the file thumbnail and its available actions. */}
      <div className="flex justify-between">
        <Thumbnail type={file.type} extension={file.extension} url={file.url} />
        <div className="flex flex-col items-end justify-between">
          <CardActionsDropdown file={file} />
        </div>
      </div>

      {/* Display the file name without its extension. */}
      <h5 className="line-clamp-1 pt-2 pb-1">
        {file.name.replace(/\.[^/.]+$/, "")}
      </h5>

      {/* Show the upload date, owner, file type, and file size. */}
      <div className="flex flex-row w-full">
        <span className="mr-auto flex flex-col gap-1">
          <small>{formatDate(file.$createdAt)}</small>
          <small className="line-clamp-1">By: {file.owner.fullName}</small>
        </span>
        <span className="ml-auto flex flex-col text-right gap-1">
          <small className="uppercase">{file.extension}</small>
          <small>{convertFileSize(file.size)}</small>
        </span>
      </div>
    </Link>
  );
};

export default Card;
