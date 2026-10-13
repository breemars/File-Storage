import Link from "next/link";
import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import { convertFileSize, formatDate } from "@/lib/utils";

const Card = ({ file }: { file: Models.DefaultRow }) => {
  //target will open it up in a new screen
  return (
    <Link
      href={file.url}
      target="_blank"
      className="bg-white rounded-4xl p-5 shadow-gray-200 shadow-md"
    >
      <div className="flex justify-between">
        <Thumbnail type={file.type} extension={file.extension} url={file.url} />
        <div className="flex flex-col items-end justify-between">
          ||
          <small className="uppercase">{file.extension}</small>
          <small>{convertFileSize(file.size)}</small>
        </div>
      </div>

      <div>
        <h5 className="line-clamp-1 mt-3">
          {file.name.replace(/\.[^/.]+$/, "")}
        </h5>
        <small>{formatDate(file.$createdAt)}</small>
        <small className="line-clamp-1">By: ??? {file.owner.fullName}</small>
      </div>
    </Link>
  );
};

export default Card;
