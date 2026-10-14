import { renameFile } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { Models } from "node-appwrite";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const RenameModal = ({
  file,
  setIsModalOpen,
}: {
  file: Models.DefaultRow;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [name, setName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const path = usePathname();

  const onSubmit = async () => {
    setIsLoading(true);

    let success = false;

    success = await renameFile({
      fileId: file.$id,
      name,
      extension: file.extension,
      path,
    });

    if (success) setIsModalOpen(false);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="text-gray-500">Enter the New Name:</p>
      <Input
        type="text"
        value={name.replace(/\.[^/.]+$/, "")}
        onChange={(e) => setName(e.target.value)}
      />

      <Button
        onClick={onSubmit}
        className="capitalize w-full"
        disabled={isLoading}
      >
        {isLoading ? "LOADING..." : "Rename"}
      </Button>
    </div>
  );
};

export default RenameModal;
