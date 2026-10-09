import { Button } from "@base-ui/react";
import { LogOut } from "lucide-react";
import Search from "./Search";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/lib/actions/user.actions";

const Header = () => {
  return (
    <header className="flex flex-row justify-between">
      <Search />
      <div className="flex flex-row">
        <FileUploader />

        <form
          className="mx-5"
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
