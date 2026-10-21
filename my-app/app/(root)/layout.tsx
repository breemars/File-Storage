import DesktopNavigation from "@/components/DesktopNavigation";
import Header from "@/components/DesktopHeader";
import MobileNavigation from "@/components/MobileNavigation";
import React from "react";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

// Force dynamic rendering because the layout relies on cookies.
export const dynamic = "force-dynamic";

const layout = async ({ children }: { children: React.ReactNode }) => {
  // Retrieve the currently signed-in user.
  // Redirect to the sign-in page if no user is found.
  const currentUser = await getCurrentUser();
  if (!currentUser) return redirect("/sign-in");

  // Set up the main layout with navigation and a scrollable content area.
  return (
    <main className="flex h-screen overflow-hidden">
      <DesktopNavigation
        fullName={currentUser.fullName}
        avatar={currentUser.avatar}
        email={currentUser.email}
      />
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation
          $id={currentUser.$id}
          fullName={currentUser.fullName}
          avatar={currentUser.avatar}
          email={currentUser.email}
        />
        <Header accountId={currentUser.$id} />
        <div className="overflow-y-auto w-full bg-gray-100 rounded-4xl p-10 shadow-inner">
          {children}
        </div>
      </section>
    </main>
  );
};

export default layout;
