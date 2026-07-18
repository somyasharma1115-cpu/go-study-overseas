import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { courseFinderCountryOptions } from "@/data/courseFinder";

import CourseFinder from "./CourseFinder";

describe("CourseFinder", () => {
  it("renders the full country filter list from the catalog", () => {
    render(
      <MemoryRouter>
        <CourseFinder />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: "Italy" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Germany" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "France" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "United Kingdom" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Canada" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "USA" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Australia" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Malta" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dubai" })).toBeInTheDocument();
    expect(courseFinderCountryOptions.length).toBeGreaterThan(1);
  });

  it("filters the visible results when a non-default country is selected", async () => {
    render(
      <MemoryRouter>
        <CourseFinder />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Germany" }));

    expect(screen.getByText("Technical University of Munich")).toBeInTheDocument();
    expect(screen.queryByText("Sapienza University of Rome")).not.toBeInTheDocument();
  });
});
