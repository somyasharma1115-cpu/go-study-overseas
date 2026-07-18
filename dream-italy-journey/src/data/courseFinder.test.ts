import { describe, expect, it } from "vitest";

import { universityPages } from "./countries";
import { courseFinderCountryOptions, courseFinderResults } from "./courseFinder";

describe("course finder catalog", () => {
  it("includes every university from the canonical data set", () => {
    expect(courseFinderResults).toHaveLength(universityPages.length);
  });

  it("covers universities outside the original hand-picked sample", () => {
    expect(courseFinderResults.some((result) => result.university === "Sapienza University of Rome")).toBe(true);
    expect(courseFinderResults.some((result) => result.university === "Syktyvkar State Medical University")).toBe(true);
  });

  it("derives country filters from the full catalog", () => {
    expect(courseFinderCountryOptions).toEqual(
      expect.arrayContaining(["Italy", "Germany", "France", "United Kingdom", "Canada", "USA", "Australia", "Malta", "Dubai", "Russia", "Uzbekistan", "Kyrgyzstan", "Kazakhstan"]),
    );
  });
});
