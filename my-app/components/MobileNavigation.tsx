"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CircleUserRound, Menu } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import MenuItems from "./MenuItems";
import { Button } from "@base-ui/react";
import { LogOut } from "lucide-react";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/lib/actions/user.actions";

interface Props {
  $id: string;
  fullName: string;
  avatar: string;
  email: string;
}

const MobileNavigation = ({
  $id: accountId,
  fullName,
  avatar,
  email,
}: Props) => {
  const [open, setOpen] = useState(false); // Track whether the mobile navigation menu is open.

  // Renders the mobile header and slide-out navigation menu.
  return (
    <header className="fixed top-0 left-0 flex w-full items-center justify-between px-4 py-3 md:hidden bg-white">
      <h2>File Storage</h2>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Menu size={44} color="#b0b0b0" strokeWidth={1} />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            {/* Show the user's avatar or a default icon if none exists. */}
            <div className="flex flex-row items-center gap-2 border-b-8 rounded-4xl p-3 mb-5">
              {avatar ? (
                <Image
                  src={avatar}
                  alt="profile image"
                  width={44}
                  height={44}
                />
              ) : (
                <CircleUserRound size={44} color="#534a5e" strokeWidth={1} />
              )}

              <div>
                <h2>{fullName}</h2>
                <p>{email}</p>
              </div>
            </div>

            {/* Display the navigation links. */}
            <MenuItems />

            {/* File upload and log out buttons */}
            <div className="flex flex-row justify-between items-center gap-5 pt-5">
              <FileUploader accountId={accountId} />

              <Button
                type="submit"
                className="flex flex-row gap-2 bg-rose-100 rounded-4xl justify-center p-2"
                onClick={async () => {
                  signOutUser();
                }}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </Button>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
