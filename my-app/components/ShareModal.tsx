import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateFileSharedWith } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { CircleX } from "lucide-react";

const ShareModal = ({ file }: { file: Models.DefaultRow }) => {
  const [addEmails, setAddEmails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const path = usePathname();

  const onSubmit = async () => {
    setIsLoading(true);

    //Creates a new string array of the current emails plus any emails the user entered. unique values only.
    const allEmails = [...new Set([...file.sharedWith, ...addEmails])];

    await updateFileSharedWith({
      fileId: file.$id,
      emails: allEmails,
      path,
    });

    setIsLoading(false);
  };

  const onRemove = async (email: string) => {
    setIsLoading(true);
    const currentEmails = file.sharedWith;
    const updatedEmails = currentEmails.filter((e: string) => e !== email);
    await updateFileSharedWith({
      fileId: file.$id,
      emails: updatedEmails,
      path,
    });

    setIsLoading(false);

    return;
  };

  return (
    <>
      <div className="flex flex-row gap-3 p-2 border rounded-2xl my-2">
        <Thumbnail type={file.type} extension={file.extension} url={file.url} />
        <div className="flex flex-col gap-2 justify-center">
          <h4>{file.name}</h4>
        </div>
      </div>

      <div>
        <div className="flex justify-between">
          <p>Shared with {file.sharedWith.length} users</p>
        </div>

        <ul className="flex flex-col pt-2 max-h-60 overflow-y-auto">
          {file.sharedWith.map((email: string) => (
            <li
              key={email}
              className="flex justify-between border-b-4 rounded-4xl px-4 pb-2 pt-3"
            >
              {email}
              <Button
                onClick={() => onRemove(email)}
                className="text-gray-400 hover:text-red-700 bg-transparent hover:bg-transparent w-5 h-6"
              >
                <CircleX />
              </Button>
            </li>
          ))}
        </ul>

        <p className="mt-5">Share file with other users:</p>
        <small>
          Seperate email addresses by a comma to share with multiple users
        </small>
        <Input
          type="email"
          placeholder="Enter Email Addresses"
          className="mt-2"
          onChange={(e) =>
            setAddEmails(e.target.value.split(",").map((email) => email.trim()))
          }
        />
        {/* Splits the emails into an array based on , and also removes the whitespace from each individual email */}

        <Button
          onClick={onSubmit}
          className="capitalize mt-5 w-full"
          disabled={isLoading}
        >
          {isLoading ? "LOADING..." : "Share"}
        </Button>
      </div>
    </>
  );
};

export default ShareModal;
