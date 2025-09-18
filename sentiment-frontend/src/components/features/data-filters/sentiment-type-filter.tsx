"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SentimentTypeFilterProps = {
  onSentimentChange: (sentiment: string) => void;
}

export function SentimentTypeFilter({ onSentimentChange }: SentimentTypeFilterProps) {
  const handleValueChange = (value: string) => {
    onSentimentChange(value);
  };

  return (
    <Select onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Sentiment" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="positive">Positive</SelectItem>
        <SelectItem value="negative">Negative</SelectItem>
        <SelectItem value="neutral">Neutral</SelectItem>
      </SelectContent>
    </Select>
  );
}