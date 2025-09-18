"use client";

import { Search } from "lucide-react";
import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  onSearch: (query: string) => void;
} & React.HTMLAttributes<HTMLDivElement>

export function SearchBar({ className, onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSearch} className={cn("relative", className)}>
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search posts..."
        value={searchQuery}
        onChange={handleInputChange}
        className="pl-8"
      />
    </form>
  );
}