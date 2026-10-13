import Image from "next/image";
import { getFileIcon } from "@/lib/utils";

//might not use

interface Props {
  type: string;
  extension: string;
  url?: string;
}

const Thumbnail = ({ type, extension, url = "" }: Props) => {
  const isImage = type === "image" && extension !== "svg";
  return (
    <figure>
      <Image
        src={isImage ? url : getFileIcon(extension, type)}
        alt={`thumbnail`}
        width={100}
        height={100}
        className="size-8 object-contain"
      />
    </figure>
  );
};

export default Thumbnail;
