import { Button } from "@base-ui/react";
import { LogOut } from "lucide-react";
import Search from "./Search";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/lib/actions/user.actions";

// Display the search bar, file uploader, and sign-out button.
const Header = ({ accountId }: { accountId: string }) => {
  return (
    <header className="w-full flex flex-row justify-between p-3">
      <Search />
      <div className="flex flex-row items-center gap-5 mr-5">
        <FileUploader accountId={accountId} />

        {/* Run the sign-out action on the server. */}
        <form
          className="mt-1"
          action={async () => {
            "use server";
            await signOutUser();
          }}
        >
          <Button type="submit">
            <LogOut color="#b0b0b0" />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
