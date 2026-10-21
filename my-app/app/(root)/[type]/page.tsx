import Card from "@/components/Card";
import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";

// Get the file type from the URL and read the search and sort parameters.
const page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ query?: string; sort?: string }>;
}) => {
  // Await the URL parameters to get the file type, search query, and sort order.
  const type = ((await params)?.type as string) || "";
  const { query, sort } = await searchParams;

  // Uses default values when no search query or sort order is provided.
  const searchQuery = query ?? "";
  const sortQuery = sort ?? "$createdAt-desc";

  // Fetch files matching the selected type, search query, and sort order.
  const files = await getFiles({ type, searchQuery, sortQuery });

  return (
    <main>
      <h1 className="capitalize">{type}</h1>
      <div className="flex justify-between mb-5">
        {/* Display the total storage space used by the files. */}
        <p className="mt-1.5">
          Total: <b>{files.totalUsedSpace} MB</b>
        </p>

        <div className="flex flex-row">
          {/* Provide controls for sorting the file results. */}
          <p className="mr-2 mt-1.5 text-gray-500 sm:block">Sort by:</p>
          <Sort />
        </div>
      </div>
      {/* Display a card for each file, or a message if no files exist. */}
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
