import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen ">
      {/* ***LEFT COLUMN*** */}
      <section className="hidden w-2/5 items-center justify-center bg-primary lg:flex xl:w-3/10">
        <div className="flex max-h-200 max-w-108 flex-col justify-center space-y-10">
          {/* Image grabs the images automatically from Public folder*/}
          <Image
            src="/title_logo.png"
            alt="logo"
            width={224}
            height={0}
            className="h-auto transition-all"
          />

          <div className=" space-y-5 text-white">
            <h1>Manage your Files</h1>
            <p>Store all your documents here!</p>
          </div>

          <Image
            src="/files_img.png"
            alt="files"
            width={320}
            height={0}
            className="h-auto hover:rotate-2 hover:scale-105"
          />
        </div>
      </section>

      {/* ***RIGHT COLUMN*** */}
      <section className="flex flex-1 flex-col items-center lg:justify-center bg-white p-4 lg:p-10 lg:py-0">
        {children}
      </section>
    </div>
  );
};

export default Layout;
