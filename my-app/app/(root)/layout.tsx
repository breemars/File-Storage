import Sidebar from "@/components/DesktopNavigation";
import Header from "@/components/DesktopHeader";
import MobileNavigation from "@/components/MobileNavigation";
import React from "react";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  //console.log(currentUser);
  if (!currentUser) return redirect("/sign-in");

  return (
    <main className="flex h-screen overflow-hidden">
      <Sidebar {...currentUser} />
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation {...currentUser} />{" "}
        <Header accountId={currentUser.$id} />
        <div className="overflow-y-auto w-full bg-gray-100 rounded-4xl p-10 shadow-inner">
          {children}
        </div>
      </section>
    </main>
  );
};

export default layout;
