import Image from "next/image";
import { Folders, FileInput } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen ">
      {/* ***LEFT COLUMN*** */}
      <section className="flex-col space-y-10 hidden items-center justify-center bg-primary md:flex md:w-100">
        {/* Image grabs the images automatically from Public folder
          <Image
            src="/title_logo.png"
            alt="logo"
            width={224}
            height={0}
            className="h-auto"
          />*/}

        <div className="space-y-5 text-white">
          <div className="flex flex-row items-center">
            <Folders size={72} color="#fff" strokeWidth={0.5} />
            <i className="text-3xl">file storage</i>
          </div>

          <h1>Manage your Files</h1>
          <p>Store all your documents here!</p>
        </div>

        <FileInput size={200} color="#ffffff" strokeWidth={0.5} />

        {/*<Image
            src="/files_img.png"
            alt="files"
            width={320}
            height={0}
            className="h-auto transition-all hover:rotate-2 hover:scale-105"
          />*/}
      </section>

      {/* ***RIGHT COLUMN*** */}
      <section className="flex flex-1 flex-col items-center md:justify-center px-15">
        <div className="flex flex-col items-center mb-16 md:hidden bg-primary w-full p-4 rounded-b-4xl">
          {/* Image grabs the images automatically from Public folder
          <Image
            src="/title_logo.png"
            alt="logo"
            width={224}
            height={0}
            className="h-auto"
          />*/}
          <section className="flex flex-row items-center">
            <Folders size={72} color="#fff" strokeWidth={0.5} />
            <i className="text-white text-3xl">file storage</i>
          </section>
        </div>

        {children}
      </section>
    </div>
  );
};

export default Layout;
