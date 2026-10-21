"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { File, Image, Play, ChartPie, LayoutDashboard } from "lucide-react";

const MenuItems = () => {
  // Get the current URL path to determine which menu item is active.
  const url = usePathname();

  //Menu navigation buttons
  //Only shows the labels on small and large screens
  //Highlights the correlating menu button based on which page the user is on
  return (
    <nav>
      <ul className="flex flex-1 flex-col gap-4 items-center">
        <Link
          href="/"
          className={cn("menu-items", url === "/" && "menu-selected")}
        >
          <LayoutDashboard />
          <p className="block md:hidden lg:block">Dashboard</p>
        </Link>
        <Link
          href="/documents"
          className={cn("menu-items", url === "/documents" && "menu-selected")}
        >
          <File />
          <p className="block md:hidden lg:block">Documents</p>
        </Link>
        <Link
          href="/images"
          className={cn("menu-items", url === "/images" && "menu-selected")}
        >
          <Image />
          <p className="block md:hidden lg:block">Images</p>
        </Link>
        <Link
          href="/media"
          className={cn("menu-items", url === "/media" && "menu-selected")}
        >
          <Play />
          <p className="block md:hidden lg:block">Media</p>
        </Link>
        <Link
          href="/other"
          className={cn("menu-items", url === "/others" && "menu-selected")}
        >
          <ChartPie />

          <p className="block md:hidden lg:block">Others</p>
        </Link>
      </ul>
    </nav>
  );
};

export default MenuItems;
