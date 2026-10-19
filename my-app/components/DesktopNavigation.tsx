"use client";

import { Folders, CircleUserRound } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import MenuItems from "./MenuItems";

interface Props {
  fullName: string;
  avatar: string;
  email: string;
}

const DesktopNavigation = ({ fullName, avatar, email }: Props) => {
  return (
    <aside className="flex flex-col justify-between">
      <Link href="/">
        <div className="flex flex-row items-center justify-center my-5">
          <Folders size={60} color="#000" strokeWidth={0.5} />
          <i className="text-3xl hidden lg:block">file storage</i>
        </div>
      </Link>

      <div className="hidden md:block mb-30">
        <MenuItems />
      </div>

      <div className=" md:flex flex-row items-center gap-2 p-1 hidden mb-1">
        {avatar ? (
          <Image src={avatar} alt="profile image" width={44} height={44} />
        ) : (
          <CircleUserRound size={44} color="#534a5e" strokeWidth={1} />
        )}

        <div className="hidden lg:block">
          <h3>{fullName}</h3>
          <small>{email}</small>
        </div>
      </div>
    </aside>
  );
};

export default DesktopNavigation;
