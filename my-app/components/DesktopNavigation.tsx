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

const Sidebar = ({ fullName, avatar, email }: Props) => {
  return (
    <aside>
      <Link href="/">
        <div className="flex flex-row items-center">
          <Folders size={72} color="#000" strokeWidth={0.5} />
          <i className="text-3xl hidden lg:block">file storage</i>
        </div>
      </Link>

      <div className="hidden md:block">
        <MenuItems />
      </div>

      <div className="fixed bottom-4 left-4 md:flex flex-row items-center gap-2 bg-rose-50 rounded-4xl p-3 hidden">
        {avatar ? (
          <Image src={avatar} alt="profile image" width={44} height={44} />
        ) : (
          <CircleUserRound size={44} color="#534a5e" strokeWidth={1} />
        )}

        <div className="hidden lg:block">
          <h2>{fullName}</h2>
          <p>{email}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
