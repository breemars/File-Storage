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

//Displays a left column for the logo, menu navigation, and user info on desktop screens
const DesktopNavigation = ({ fullName, avatar, email }: Props) => {
  return (
    <aside className="hidden md:flex md:flex-col justify-between">
      {/* Link to the home page using the app logo and name. */}
      <Link href="/">
        <div className="flex flex-row items-center justify-center my-5">
          <Folders size={50} color="#56b8ff" strokeWidth={1} />
          <i className="text-3xl hidden lg:block text-blue-accent">
            file storage
          </i>
        </div>
      </Link>

      {/* Display the navigation menu */}
      <div className="block mb-30">
        <MenuItems />
      </div>

      {/* Display the user's profile image or a default icon. */}
      <div className=" flex flex-row items-center gap-2 p-1 mb-1">
        {avatar ? (
          <Image src={avatar} alt="profile image" width={44} height={44} />
        ) : (
          <CircleUserRound size={44} color="#534a5e" strokeWidth={1} />
        )}

        {/* Show the user's name and email on larger screens. */}
        <div className="hidden lg:block">
          <h3>{fullName}</h3>
          <small>{email}</small>
        </div>
      </div>
    </aside>
  );
};

export default DesktopNavigation;
