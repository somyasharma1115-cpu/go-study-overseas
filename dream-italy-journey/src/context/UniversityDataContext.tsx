import { createContext, useContext, type ReactNode } from "react";

import {
  allCountryPages as baseAllCountryPages,
  countryPages as baseCountryPages,
  getUniversityPageHrefBySlug,
  type CountryPage,
  type UniversityPage,
  universityPages as baseUniversityPages,
} from "@/data/countries";
import type { UniversitySheetOverride } from "@/lib/universitySheet";

type CountryUniversityCard = {
  name: string;
  slug: string;
  program: string;
  tag: string;
  logo: string;
};

type RuntimeCountryPage = Omit<CountryPage, "universities"> & {
  universities: CountryUniversityCard[];
};

type UniversityDataContextValue = {
  countryPages: RuntimeCountryPage[];
  allCountryPages: RuntimeCountryPage[];
  countryPageMap: Record<string, RuntimeCountryPage>;
  countryMenuItems: { slug: string; name: string; note: string; href: string }[];
  destinationCards: { slug: string; country: string; tag: string; img: string; unis: number }[];
  universityPages: UniversityPage[];
  universityPageMap: Record<string, UniversityPage>;
  isLoading: boolean;
};

const UniversityDataContext = createContext<UniversityDataContextValue | null>(null);

const cloneUniversityPage = (page: UniversityPage): UniversityPage => ({
  ...page,
  timeline: page.timeline.map((item) => ({ ...item })),
  requirements: [...page.requirements],
  scholarships: page.scholarships ? [...page.scholarships] : undefined,
  costs: page.costs.map((item) => ({ ...item })),
  highlights: page.highlights.map((item) => ({ ...item })),
  faqs: page.faqs.map((item) => ({ ...item })),
  visuals: { ...page.visuals },
});

const mergeUniversityPage = (
  fallbackCountry: CountryPage | undefined,
  existingPage: UniversityPage | undefined,
  override: UniversitySheetOverride,
): UniversityPage => {
  const basePage =
    existingPage ??
    ({
      slug: override.slug,
      name: override.name ?? override.slug,
      countrySlug: override.countrySlug,
      countryName: override.countryName ?? fallbackCountry?.name ?? override.countrySlug,
      countryHeroImage: override.countryHeroImage ?? fallbackCountry?.heroImage ?? "",
      menuNote: override.menuNote ?? fallbackCountry?.menuNote ?? "",
      heroTag: override.heroTag ?? fallbackCountry?.heroTag ?? "",
      program: override.program ?? "Program details",
      tag: override.tag ?? "University",
      logo: override.logo ?? "",
      timeline: override.timeline ?? fallbackCountry?.timeline ?? [],
      requirements: override.requirements ?? fallbackCountry?.requirements ?? [],
      scholarships: override.scholarships ?? fallbackCountry?.scholarships ?? [],
      costs: override.costs ?? fallbackCountry?.costs ?? [],
      highlights: override.highlights ?? fallbackCountry?.highlights ?? [],
      faqs: override.faqs ?? fallbackCountry?.faqs ?? [],
      visuals: override.visuals ?? {
        heroBackground: fallbackCountry?.heroImage ?? "",
        heroFeature: fallbackCountry?.visuals.gallery[0] ?? fallbackCountry?.heroImage ?? "",
        overview: fallbackCountry?.visuals.budgetImage ?? fallbackCountry?.heroImage ?? "",
      },
      isMbbs: override.isMbbs,
    } satisfies UniversityPage);

  return {
    ...basePage,
    name: override.name ?? basePage.name,
    countryName: override.countryName ?? basePage.countryName,
    countryHeroImage: override.countryHeroImage ?? basePage.countryHeroImage,
    menuNote: override.menuNote ?? basePage.menuNote,
    heroTag: override.heroTag ?? basePage.heroTag,
    program: override.program ?? basePage.program,
    tag: override.tag ?? basePage.tag,
    logo: override.logo ?? basePage.logo,
    timeline: override.timeline ?? basePage.timeline,
    requirements: override.requirements ?? basePage.requirements,
    scholarships: override.scholarships ?? basePage.scholarships,
    costs: override.costs ?? basePage.costs,
    highlights: override.highlights ?? basePage.highlights,
    faqs: override.faqs ?? basePage.faqs,
    visuals: override.visuals ?? basePage.visuals,
    isMbbs: override.isMbbs ?? basePage.isMbbs,
  };
};

const buildUniversityData = (overrides: UniversitySheetOverride[]) => {
  const countryLookup = Object.fromEntries(baseAllCountryPages.map((page) => [page.slug, page]));
  const pageOrder = baseUniversityPages.map((page) => `${page.countrySlug}/${page.slug}`);
  const pageMap = new Map(baseUniversityPages.map((page) => [`${page.countrySlug}/${page.slug}`, cloneUniversityPage(page)]));

  overrides.forEach((override) => {
    const key = `${override.countrySlug}/${override.slug}`;

    if (!override.active) {
      pageMap.delete(key);
      return;
    }

    const mergedPage = mergeUniversityPage(countryLookup[override.countrySlug], pageMap.get(key), override);
    pageMap.set(key, mergedPage);

    if (!pageOrder.includes(key)) {
      pageOrder.push(key);
    }
  });

  const universityPages = pageOrder.map((key) => pageMap.get(key)).filter((page): page is UniversityPage => Boolean(page));
  const pagesByCountry = universityPages.reduce<Record<string, CountryUniversityCard[]>>((accumulator, page) => {
    const countryPages = accumulator[page.countrySlug] ?? [];
    countryPages.push({
      name: page.name,
      slug: page.slug,
      program: page.program,
      tag: page.tag,
      logo: page.logo,
    });
    accumulator[page.countrySlug] = countryPages;
    return accumulator;
  }, {});

  const allCountryPages = baseAllCountryPages.map((page) => ({
    ...page,
    universities: pagesByCountry[page.slug] ?? page.universities.map((university) => ({ ...university, slug: "" })),
  }));
  const countryPages = baseCountryPages.map((page) => ({
    ...page,
    universities: pagesByCountry[page.slug] ?? page.universities.map((university) => ({ ...university, slug: "" })),
  }));

  return {
    allCountryPages,
    countryPages,
    countryPageMap: Object.fromEntries(allCountryPages.map((page) => [page.slug, page])),
    countryMenuItems: countryPages.map((page) => ({
      slug: page.slug,
      name: page.name,
      note: page.menuNote,
      href: `/study-in/${page.slug}`,
    })),
    destinationCards: countryPages.map((page) => ({
      slug: page.slug,
      country: page.name,
      tag: page.menuNote,
      img: page.spotlightImage,
      unis: page.universities.length,
    })),
    universityPages,
    universityPageMap: Object.fromEntries(universityPages.map((page) => [`${page.countrySlug}/${page.slug}`, page])),
  };
};

const defaultValue = buildUniversityData([]);

export const UniversityDataProvider = ({ children }: { children: ReactNode }) => {
  return (
    <UniversityDataContext.Provider
      value={{
        ...defaultValue,
        isLoading: false,
      }}
    >
      {children}
    </UniversityDataContext.Provider>
  );
};

export const useUniversityData = () => {
  const context = useContext(UniversityDataContext);

  if (!context) {
    throw new Error("useUniversityData must be used within UniversityDataProvider");
  }

  return context;
};

export const getRuntimeUniversityHref = (countrySlug: string, universitySlug: string) =>
  getUniversityPageHrefBySlug(countrySlug, universitySlug);
