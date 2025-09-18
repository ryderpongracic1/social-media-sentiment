import { render, screen } from "@testing-library/react";
import React from "react";

import { SentimentBarChart } from "../BarChart";

const mockData = [
  { platform: "Twitter", positive: 45, negative: 25, neutral: 30 },
  { platform: "Facebook", positive: 35, negative: 30, neutral: 35 },
  { platform: "Instagram", positive: 50, negative: 20, neutral: 30 },
];

describe("SentimentBarChart", () => {
  it("renders without crashing", () => {
    render(
      <SentimentBarChart
        data={mockData}
        title="Test Chart"
        description="Test Description"
      />
    );
    expect(screen.getByText("Test Chart")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("renders with provided title and description", () => {
    render(
      <SentimentBarChart
        data={mockData}
        title="Sentiment Distribution"
        description="Platform sentiment analysis"
      />
    );
    expect(screen.getByText("Sentiment Distribution")).toBeInTheDocument();
    expect(screen.getByText("Platform sentiment analysis")).toBeInTheDocument();
  });

  it("handles empty data gracefully", () => {
    render(
      <SentimentBarChart
        data={[]}
        title="Empty Chart"
        description="No data available"
      />
    );
    expect(screen.getByText("Empty Chart")).toBeInTheDocument();
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });
});