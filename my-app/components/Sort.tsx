"use client"; //bc using next/navigation
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";

const Sort = () => {
  const path = usePathname();
  const router = useRouter();

  //Dependent on "Select" functionality
  const handleSort = (sort: { value: string } | null) => {
    if (!sort) return;
    router.push(`${path}?sort=${sort}`);
  };

  const sortTypes = [
    { label: "Date Created - Newest", value: "$createdAt-desc" },
    { label: "Date Created - Oldest", value: "$createdAt-asc" },
    { label: "Name (A-Z)", value: "name-asc" },
    { label: "Name (Z-A)", value: "name-desc" },
    { label: "Size (Highest)", value: "size-desc" },
    { label: "Size (Lowest)", value: "size-asc" },
  ];

  return (
    <div>
      <Select
        onValueChange={handleSort}
        defaultValue={sortTypes[0]}
        items={sortTypes}
      >
        <SelectTrigger className="w-55 bg-white">
          <SelectValue placeholder={sortTypes[0].value} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {sortTypes.map((sort) => (
              <SelectItem key={sort.label} value={sort.value}>
                {sort.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Sort;
