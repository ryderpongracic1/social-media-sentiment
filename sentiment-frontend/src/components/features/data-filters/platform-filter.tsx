"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PlatformFilterProps = {
  onPlatformChange: (platform: string) => void;
}

export function PlatformFilter({ onPlatformChange }: PlatformFilterProps) {
  const handleValueChange = (value: string) => {
    onPlatformChange(value);
  };

  return (
    <Select onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Platform" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="twitter">Twitter</SelectItem>
        <SelectItem value="reddit">Reddit</SelectItem>
        <SelectItem value="facebook">Facebook</SelectItem>
      </SelectContent>
    </Select>
  );
}