"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Models } from "node-appwrite";
import {
  Download,
  EllipsisVertical,
  Info,
  Share2,
  SquarePen,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";
import FileDetailsModal from "./FileDetailsModal";
import ShareModal from "./ShareModal";
import RenameModal from "./RenameModal";
import DeleteFileModal from "./DeleteFileModal";

const CardActionsDropdown = ({ file }: { file: Models.DefaultRow }) => {
  // Track the dropdown visibility, modal visibility, and selected file action.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<string | null>(null);

  // Set the selected action and open its modal, except for downloads.
  const menuItemClicked = (actionItem: string) => {
    setAction(actionItem);
    if (actionItem !== "download") setIsModalOpen(true);
  };

  // Render the modal that matches the selected file action.
  const renderDialogContent = () => {
    if (!action) return null;

    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">{action}</DialogTitle>
          {action === "rename" && (
            <RenameModal file={file} setIsModalOpen={setIsModalOpen} />
          )}
          {action === "details" && <FileDetailsModal file={file} />}
          {action === "share" && <ShareModal file={file} />}
          {action === "delete" && (
            <DeleteFileModal file={file} setIsModalOpen={setIsModalOpen} />
          )}
        </DialogHeader>
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger
          render={
            <Button
              className="bg-transparent hover:bg-transparent w-5 py-5 hover:text-black text-gray-400"
              onClick={(e) => e.preventDefault()} //stop the Link on the card from being called
            />
          }
        >
          <EllipsisVertical className="size-8" strokeWidth={2} />
        </DropdownMenuTrigger>

        {/* Provide options to rename, view details, share, download, or delete the file. */}
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel className="max-w-200px truncate">
              {file.name}
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => menuItemClicked("rename")}>
              <SquarePen color="#18c964" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => menuItemClicked("details")}>
              <Info color="#bc55ec" />
              Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => menuItemClicked("share")}>
              <Share2 color="#f2aa0d" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => menuItemClicked("download")}>
              {/* Goes to the download URL / downloads the file. */}
              <Link
                href={constructDownloadUrl(file.bucketFileId)}
                download={file.name}
                className="flex flex-row gap-2.5"
              >
                <Download color="#0d9af2" />
                Download
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => menuItemClicked("delete")}>
              <Trash color="#f20d0d" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Display the selected action's dialog when needed. */}
      {renderDialogContent()}
    </Dialog>
  );
};
export default CardActionsDropdown;
