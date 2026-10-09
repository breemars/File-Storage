"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
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
  ownerId: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}

const MobileNavigation = ({
  ownerId,
  accountId,
  fullName,
  avatar,
  email,
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 flex w-full items-center justify-between px-4 py-3 md:hidden bg-white">
      <h2>File Storage</h2>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Menu size={44} color="#b0b0b0" strokeWidth={1} />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
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

            <MenuItems />

            <div className="flex flex-col justify-between gap-5 pb-5">
              <FileUploader />

              <Button
                type="submit"
                className="flex flex-row gap-3 bg-rose-100 rounded-4xl w-full justify-center p-3"
                onClick={async () => {
                  signOutUser();
                }}
              >
                <LogOut />
                <p>Logout</p>
              </Button>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
