import { Folders, FileInput } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen ">
      {/* ***LEFT COLUMN*** */}
      {/* Display a large app logo, name, and welcome message on larger screens. */}
      <section className="flex-col space-y-10 hidden items-center justify-center bg-primary md:flex md:w-100">
        <div className="space-y-5 text-white">
          <div className="flex flex-row items-center">
            <Folders size={72} color="#fff" strokeWidth={0.5} />
            <i className="text-3xl">file storage</i>
          </div>

          <h1>Manage your Files</h1>
          <p>Store all your documents here!</p>
        </div>

        <FileInput size={200} color="#ffffff" strokeWidth={0.5} />
      </section>

      {/* ***RIGHT COLUMN*** */}
      <section className="flex flex-1 flex-col items-center md:justify-center px-15">
        {/* Show a compact version of the branding on smaller screens. */}
        <div className="flex flex-col items-center mb-16 md:hidden bg-primary w-full p-4 rounded-b-4xl">
          <section className="flex flex-row items-center">
            <Folders size={72} color="#fff" strokeWidth={0.5} />
            <i className="text-white text-3xl">file storage</i>
          </section>
        </div>

        {/* Display the page content - the sign-in or registration form. */}
        {children}
      </section>
    </div>
  );
};

export default Layout;
