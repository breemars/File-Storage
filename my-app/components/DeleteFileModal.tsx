import { deleteFile } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { Models } from "node-appwrite";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const DeleteFileModal = ({
  file,
  setIsModalOpen,
}: {
  file: Models.DefaultRow;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const path = usePathname();

  // Delete the selected file and close the modal if successful.
  const onSubmit = async () => {
    setIsLoading(true);

    let success = false;

    success = await deleteFile({
      fileId: file.$id,
      bucketFileId: file.bucketFileId,
      path,
    });

    if (success) setIsModalOpen(false);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-5 mt-2">
      {/* Prompt the user to confirm deletion of the selected file. */}
      <p className="text-center">
        Are you sure you want to delete <b>{file.name}</b>?
      </p>

      {/* Close the modal without deleting the file. */}
      <Button
        onClick={() => setIsModalOpen(false)}
        className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300"
        disabled={isLoading}
      >
        Cancel
      </Button>

      {/* Confirm deletion and show a loading message while processing. */}
      <Button
        onClick={onSubmit}
        className="capitalize w-full hover:bg-red-700"
        disabled={isLoading}
      >
        {isLoading ? "LOADING..." : "Delete"}
      </Button>
    </div>
  );
};

export default DeleteFileModal;
