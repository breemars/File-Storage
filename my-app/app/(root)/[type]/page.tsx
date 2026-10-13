import Card from "@/components/Card";
import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";

//Params = access the page type from the URL
const page = async ({ params }: { params: Promise<{ type: string }> }) => {
  const type = ((await params)?.type as string) || "";
  const files = await getFiles();

  return (
    <main>
      <h1 className="capitalize">{type}</h1>
      <div className="flex justify-between mb-5">
        <p>
          Total: <b>0 MB</b>
        </p>

        <div className="flex flex-row">
          <p className="hiddem sm:block">Sort by:</p>
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
