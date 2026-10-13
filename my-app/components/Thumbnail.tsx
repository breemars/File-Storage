import { Headset, CircleQuestionMark, StickyNote, Video } from "lucide-react";
import Image from "next/image";

interface Props {
  type: string;
  extension: string;
  url?: string;
}

const Thumbnail = ({ type, extension, url = "" }: Props) => {
  return (
    <figure>
      {type === "image" && extension !== "svg" && (
        <Image
          src={url}
          alt={`thumbnail`}
          width={200}
          height={200}
          className="size-15 object-fill rounded-4xl"
        />
      )}

      {type === "document" && (
        <div className="bg-blue-100 size-15 rounded-4xl flex items-center justify-center">
          <StickyNote size={40} color="#1835aa" />
        </div>
      )}

      {type === "video" && (
        <div className="bg-orange-100 size-15 rounded-4xl flex items-center justify-center">
          <Video size={40} color="#aa4418" />
        </div>
      )}

      {type === "audio" && (
        <div className="bg-green-100 size-15 rounded-4xl flex items-center justify-center">
          <Headset size={40} color="#18aa49" />
        </div>
      )}

      {type === "other" && (
        <div className="bg-pink-100 size-15 rounded-4xl flex items-center justify-center">
          <CircleQuestionMark size={40} color="#aa188a" />
        </div>
      )}
    </figure>
  );
};

export default Thumbnail;
