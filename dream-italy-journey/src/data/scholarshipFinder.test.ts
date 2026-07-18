import { describe, expect, it } from "vitest";

import {
  scholarshipCountryOptions,
  scholarshipLevelOptions,
  scholarshipResults,
  scholarshipStreamOptions,
} from "./scholarshipFinder";

describe("scholarship finder catalog", () => {
  it("derives country filters from every scholarship result", () => {
    expect(scholarshipCountryOptions).toEqual(expect.arrayContaining(["All", "Ireland", "United Kingdom"]));
  });

  it("keeps level filters aligned with the data set", () => {
    expect(scholarshipLevelOptions).toEqual(expect.arrayContaining(["All", "Bachelors", "Bachelors & Masters", "Masters"]));
  });

  it("keeps stream filters aligned with the data set", () => {
    expect(scholarshipStreamOptions).toEqual(["All", ...Array.from(new Set(scholarshipResults.map((result) => result.stream))).sort((left, right) => left.localeCompare(right))]);
  });
});
