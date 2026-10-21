"use client"; //all components that use states must be a client component

import { Search as SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "./ui/input"; //correct
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Models } from "node-appwrite";
import { getFiles } from "@/lib/actions/file.actions";
import Thumbnail from "./Thumbnail";
import { useDebounce } from "use-debounce";

const Search = () => {
  // Tracks the search input, matching files, dropdown visibility, and debounced query.
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Models.DefaultRow[]>([]);
  const [open, setOpen] = useState(false);
  const [debouncedQuery] = useDebounce(query, 300);

  // Reads the current URL query parameters
  const searchParams = useSearchParams(); //Client specific method for doing so
  const searchQuery = searchParams.get("query") || "";

  const router = useRouter();
  const path = usePathname();

  //Clears the search query if I click on a menu button (aka the URL no longer contains a search query)
  useEffect(() => {
    const clearSearch = async () => {
      if (!searchQuery) {
        setQuery(""); //ajjj
      }
    };
    clearSearch();
  }, [path]);

  //Gets the files to display in the dropdown search results
  useEffect(() => {
    const fetchFiles = async () => {
      if (!query) {
        setResults([]);
        setOpen(false);
        return router.push(path.replace(searchParams.toString(), "")); //go to the same page but with no search params
      }

      const files = await getFiles({ searchQuery: query, limit: 6 });
      setResults(files.rows);
      setOpen(true);
    };

    fetchFiles();
  }, [debouncedQuery]);

  //Displays the search results when a dropdown result is click
  const handleClickItem = (file: Models.DefaultRow) => {
    setOpen(false);
    setResults([]);

    router.push(
      `/${file.type === "video" || file.type == "audio" ? "media" : file.type}?query=${query}`,
    );
  };

  return (
    <>
      {/* Renders the search icon and controlled search input. */}
      <div className="flex flex-row pl-3 items-center bg-gray-100 border rounded-4xl">
        <SearchIcon />
        <Input
          value={query}
          placeholder="search..."
          onChange={(e) => setQuery(e.target.value)}
          className="w-70 bg-transparent border-0 focus-visible:ring-0"
        />
      </div>
      {/* Displays matching files in a dropdown, or a message when no files are found. */}
      {open && (
        <div className="absolute top-15 p-2 z-50 rounded-lg bg-white border border-t-0 shadow-lg">
          <ul>
            {results.length > 0 ? (
              results.map((file) => (
                <li
                  key={file.$id}
                  className="flex flex-row gap-3 items-center max-w-75 hover:bg-gray-200 p-2 rounded-3xl"
                  onClick={() => handleClickItem(file)}
                >
                  <Thumbnail
                    type={file.type}
                    extension={file.extension}
                    url={file.url}
                  />
                  <p className="line-clamp-2">{file.name}</p>
                </li>
              ))
            ) : (
              <li>No files found</li>
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default Search;
