import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { scholarshipCountryOptions, scholarshipLevelOptions } from "@/data/scholarshipFinder";

import ScholarshipFinder from "./ScholarshipFinder";

describe("ScholarshipFinder", () => {
  it("renders the country and level filters from the scholarship data", () => {
    render(
      <MemoryRouter>
        <ScholarshipFinder />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: "Ireland" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "United Kingdom" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bachelors" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Masters" })).toBeInTheDocument();
    expect(scholarshipCountryOptions.length).toBeGreaterThan(1);
    expect(scholarshipLevelOptions.length).toBeGreaterThan(1);
  });

  it("filters scholarships by country", async () => {
    render(
      <MemoryRouter>
        <ScholarshipFinder />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "United Kingdom" }));

    expect(screen.getByText("University of Bath MBA Scholarships")).toBeInTheDocument();
    expect(screen.queryByText("Young Future Leaders Programme Scholarship")).not.toBeInTheDocument();
  });
});
