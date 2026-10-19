import Card from "@/components/Card";
import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";

//Params = access the page type from the URL
//type?query=searchQuery&sort=sortQuery
//MUST be called params and searchParams as that is what Next.JS needs
const page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ query?: string; sort?: string }>;
}) => {
  const type = ((await params)?.type as string) || "";
  const { query, sort } = await searchParams;
  const searchQuery = query ?? "";
  const sortQuery = sort ?? "$createdAt-desc";

  const files = await getFiles({ type, searchQuery, sortQuery });

  return (
    <main>
      <h1 className="capitalize">{type}</h1>
      <div className="flex justify-between mb-5">
        <p className="mt-1.5">
          Total: <b>{files.totalUsedSpace} MB</b>
        </p>

        <div className="flex flex-row">
          <p className="mr-2 mt-1.5 text-gray-500 sm:block">Sort by:</p>
          <Sort />
        </div>
      </div>
      {files.total > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {files.rows.map((file: Models.DefaultRow) => (
            <Card key={file.$id} file={file} />
          ))}
        </div>
      ) : (
        <p>No Files Uploaded</p>
      )}
    </main>
  );
};

export default page;
