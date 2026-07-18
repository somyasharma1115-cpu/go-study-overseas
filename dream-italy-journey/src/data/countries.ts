import countriesJson from "./countries.json";
import italyImg from "@/assets/dest-italy.jpg";
import ukImg from "@/assets/dest-uk.jpg";
import germanyImg from "@/assets/dest-germany.jpg";
import franceImg from "@/assets/dest-france.jpg";
import canadaImg from "@/assets/dest-canada.jpg";
import dubaiImg from "@/assets/dest-dubai.jpg";
import dubaiBurjImg from "@/assets/dest-dubai-burj.optimized.webp";
import maltaImg from "@/assets/dest-malta.optimized.webp";
import maltaSkylineImg from "@/assets/dest-malta-skyline.optimized.webp";
import usaImg from "@/assets/dest-usa.jpg";
import ausImg from "@/assets/dest-australia.jpg";
import franceUniversity1 from "@/assets/web/france/HEC-Paris-300x300.webp";
import franceUniversity2 from "@/assets/web/france/Sorbonne-Universite-300x300.webp";
import franceUniversity3 from "@/assets/web/france/University-of-Lorraine-300x300.webp";
import franceUniversity4 from "@/assets/web/france/University-of-Montpellier-300x300.webp";
import franceUniversity5 from "@/assets/web/france/University-de-Strasbourg-300x300.webp";
import franceUniversity6 from "@/assets/web/france/Paris-Dauphine-University-300x300.webp";
import franceUniversity7 from "@/assets/web/france/ESC-Rennes-School-of-Business-300x300.webp";
import franceUniversity8 from "@/assets/web/france/Grenoble-Institute-of-Technology-300x300.webp";
import franceUniversity9 from "@/assets/web/france/ISC-Paris-300x300.webp";
import franceUniversity10 from "@/assets/web/france/University-PSL-300x300.webp";
import uniboWordmark from "@/assets/web/logos/unibo-wordmark.webp";
import tumLogo from "@/assets/web/logos/tum-logo.svg";
import hecParisLogo from "@/assets/web/logos/hec-paris.svg";
import imperialLogo from "@/assets/web/logos/imperial-logo.svg";
import utorontoWordmark from "@/assets/web/logos/utoronto-wordmark.webp";
import northeasternWordmark from "@/assets/web/logos/northeastern-wordmark.svg";
import drexelWordmark from "@/assets/web/logos/drexel-wordmark.svg";
import melbourneArms from "@/assets/web/logos/melbourne-arms.svg";
import { countryImageSelections, universityImageSelections, type UniversityImageSet } from "./pageImages.generated";
import { mbbsStudyAbroadCountries } from "./mbbsStudyAbroad";

const logoFromDomain = (domain: string) => `https://logo.clearbit.com/${domain}`;

type CountryJson = {
  slug: string;
  name: string;
  menuNote: string;
  heroTag: string;
  heroSummary: string;
  heroStats: { label: string; value: string }[];
  highlights: { title: string; body: string }[];
  universities: { name: string; program: string; tag: string; logo: string }[];
  costs: { label: string; value: string }[];
  timeline: { label: string; value: string }[];
  requirements: string[];
  scholarships?: string[];
  faqs: { q: string; a: string }[];
  heroImageKey?: string;
};

type CountryVisuals = {
  heroImage: string;
  gallery: string[];
  featuredLogos: string[];
  budgetImage: string;
  visaImage: string;
  workImage: string;
  whyStudyImage: string;
};

export type CountryPage = CountryJson & {
  heroImage: string;
  spotlightImage: string;
  visuals: CountryVisuals;
};

const typedCountries = countriesJson as CountryJson[];
const defaultCountrySelection = countryImageSelections.italy;
const extraCountryImageSelections = {
  malta: {
    heroBackground: maltaSkylineImg,
    heroFeature: maltaImg,
    overview: maltaSkylineImg,
    admission: maltaImg,
  },
  dubai: {
    heroBackground: dubaiBurjImg,
    heroFeature: dubaiImg,
    overview: dubaiBurjImg,
    admission: dubaiImg,
  },
} as const;

const countryImageSelectionLookup = {
  ...countryImageSelections,
  ...extraCountryImageSelections,
} as const;

const countrySpotlightImages = {
  italy: italyImg,
  germany: germanyImg,
  france: franceImg,
  uk: ukImg,
  canada: canadaImg,
  usa: usaImg,
  australia: ausImg,
  malta: maltaImg,
  dubai: dubaiBurjImg,
} as const;

const countryVisuals: Record<string, CountryVisuals> = {
  italy: {
    heroImage: countryImageSelections.italy.overview,
    gallery: [countryImageSelections.italy.heroFeature],
    featuredLogos: [uniboWordmark],
    budgetImage: countryImageSelections.italy.overview,
    visaImage: countryImageSelections.italy.admission,
    workImage: countryImageSelections.italy.heroFeature,
    whyStudyImage: countryImageSelections.italy.heroBackground,
  },
  germany: {
    heroImage: countryImageSelections.germany.overview,
    gallery: [countryImageSelections.germany.heroFeature],
    featuredLogos: [tumLogo],
    budgetImage: countryImageSelections.germany.overview,
    visaImage: countryImageSelections.germany.admission,
    workImage: countryImageSelections.germany.heroFeature,
    whyStudyImage: countryImageSelections.germany.heroBackground,
  },
  france: {
    heroImage: countryImageSelections.france.overview,
    gallery: [countryImageSelections.france.heroFeature],
    featuredLogos: [
      hecParisLogo,
      franceUniversity1,
      franceUniversity2,
      franceUniversity3,
      franceUniversity4,
      franceUniversity5,
      franceUniversity6,
      franceUniversity7,
      franceUniversity8,
      franceUniversity9,
      franceUniversity10,
    ],
    budgetImage: countryImageSelections.france.overview,
    visaImage: countryImageSelections.france.admission,
    workImage: countryImageSelections.france.heroFeature,
    whyStudyImage: countryImageSelections.france.heroBackground,
  },
  uk: {
    heroImage: countryImageSelections.uk.overview,
    gallery: [countryImageSelections.uk.heroFeature],
    featuredLogos: [imperialLogo],
    budgetImage: countryImageSelections.uk.overview,
    visaImage: countryImageSelections.uk.admission,
    workImage: countryImageSelections.uk.heroFeature,
    whyStudyImage: countryImageSelections.uk.heroBackground,
  },
  canada: {
    heroImage: countryImageSelections.canada.overview,
    gallery: [countryImageSelections.canada.heroFeature],
    featuredLogos: [utorontoWordmark],
    budgetImage: countryImageSelections.canada.overview,
    visaImage: countryImageSelections.canada.admission,
    workImage: countryImageSelections.canada.heroFeature,
    whyStudyImage: countryImageSelections.canada.heroBackground,
  },
  usa: {
    heroImage: countryImageSelections.usa.overview,
    gallery: [countryImageSelections.usa.heroFeature],
    featuredLogos: [northeasternWordmark, drexelWordmark],
    budgetImage: countryImageSelections.usa.overview,
    visaImage: countryImageSelections.usa.admission,
    workImage: countryImageSelections.usa.heroFeature,
    whyStudyImage: countryImageSelections.usa.heroBackground,
  },
  australia: {
    heroImage: countryImageSelections.australia.overview,
    gallery: [countryImageSelections.australia.heroFeature],
    featuredLogos: [melbourneArms],
    budgetImage: countryImageSelections.australia.overview,
    visaImage: countryImageSelections.australia.admission,
    workImage: countryImageSelections.australia.heroFeature,
    whyStudyImage: countryImageSelections.australia.heroBackground,
  },
  malta: {
    heroImage: countryImageSelectionLookup.malta.overview,
    gallery: [countryImageSelectionLookup.malta.heroFeature],
    featuredLogos: [logoFromDomain("gbs.edu.mt")],
    budgetImage: countryImageSelectionLookup.malta.overview,
    visaImage: countryImageSelectionLookup.malta.admission,
    workImage: countryImageSelectionLookup.malta.heroFeature,
    whyStudyImage: countryImageSelectionLookup.malta.heroBackground,
  },
  dubai: {
    heroImage: countryImageSelectionLookup.dubai.overview,
    gallery: [countryImageSelectionLookup.dubai.heroFeature],
    featuredLogos: [logoFromDomain("gbs.ac.ae")],
    budgetImage: countryImageSelectionLookup.dubai.overview,
    visaImage: countryImageSelectionLookup.dubai.admission,
    workImage: countryImageSelectionLookup.dubai.heroFeature,
    whyStudyImage: countryImageSelectionLookup.dubai.heroBackground,
  },
};

const universityLogoLookup: Record<string, Record<string, string>> = {
  italy: {
    "Sapienza University of Rome": logoFromDomain("uniroma1.it"),
    "University of Bologna": uniboWordmark,
    "Politecnico di Milano": logoFromDomain("polimi.it"),
    "University of Milan": logoFromDomain("unimi.it"),
    "University of Padua": logoFromDomain("unipd.it"),
    "Politecnico di Torino": logoFromDomain("polito.it"),
    "University of Pisa": logoFromDomain("unipi.it"),
    "University of Naples Federico II": logoFromDomain("unina.it"),
    "University of Florence": logoFromDomain("unifi.it"),
    "University of Turin": logoFromDomain("unito.it"),
    "University of Siena": logoFromDomain("unisi.it"),
    "University of Trento": logoFromDomain("unitn.it"),
    "University of Genoa": logoFromDomain("unige.it"),
    "University of Palermo": logoFromDomain("unipa.it"),
    "University of Messina": logoFromDomain("unime.it"),
    "University of Parma": logoFromDomain("unipr.it"),
    "University of Cassino & Southern Lazio": logoFromDomain("unicas.it"),
    "University of Macerata": logoFromDomain("unimc.it"),
    "University of Camerino": logoFromDomain("unicam.it"),
    "University of Trieste": logoFromDomain("units.it"),
    "University of Calabria": logoFromDomain("unical.it"),
    "University of Catania": logoFromDomain("unict.it"),
    "University of Sassari": logoFromDomain("uniss.it"),
    "University of Tuscia": logoFromDomain("unitus.it"),
  },
  germany: {
    "Technical University of Munich": tumLogo,
    "RWTH Aachen": logoFromDomain("rwth-aachen.de"),
    "LMU Munich": logoFromDomain("lmu.de"),
    "University of Heidelberg": logoFromDomain("uni-heidelberg.de"),
    "Schiller University": logoFromDomain("schiller.edu"),
    "Constructor University Bremen": logoFromDomain("constructor.university"),
    "Steinbeis University Berlin": logoFromDomain("steinbeis-hochschule.de"),
    "SRH University": logoFromDomain("srh-university.de"),
    "Hamburg University of Technology (TUHH)": logoFromDomain("tuhh.de"),
    "FOM Hochschule": logoFromDomain("fom.de"),
    "IU International University of Applied Sciences": logoFromDomain("iu.org"),
    "Arden University Berlin": logoFromDomain("arden.ac.uk"),
    "GISMA University of Applied Sciences": logoFromDomain("gisma.com"),
  },
  france: {
    "Sciences Po": logoFromDomain("sciencespo.fr"),
    "HEC Paris": hecParisLogo,
    "ESSEC Business School": logoFromDomain("essec.edu"),
    "KEDGE Business School": logoFromDomain("kedge.edu"),
  },
  uk: {
    "Imperial College London": imperialLogo,
    "King's College London": logoFromDomain("kcl.ac.uk"),
    "University of Manchester": logoFromDomain("manchester.ac.uk"),
    "University of Birmingham": logoFromDomain("birmingham.ac.uk"),
    "University of Hertfordshire": logoFromDomain("herts.ac.uk"),
  },
  canada: {
    "University of Toronto": utorontoWordmark,
    "University of British Columbia": logoFromDomain("ubc.ca"),
    "McGill University": logoFromDomain("mcgill.ca"),
    "University of Waterloo": logoFromDomain("uwaterloo.ca"),
  },
  usa: {
    "Northeastern University": northeasternWordmark,
    "Drexel University": drexelWordmark,
    "University of Southern California": logoFromDomain("usc.edu"),
    "Arizona State University": logoFromDomain("asu.edu"),
  },
  australia: {
    "University of Melbourne": melbourneArms,
    "UNSW Sydney": logoFromDomain("unsw.edu.au"),
    "Monash University": logoFromDomain("monash.edu"),
    "University of Sydney": logoFromDomain("sydney.edu.au"),
  },
  malta: {
    "GBS Malta": logoFromDomain("gbs.edu.mt"),
  },
  dubai: {
    "GBS Dubai": logoFromDomain("gbs.ac.ae"),
    "Middlesex University Dubai": logoFromDomain("mdx.ac.ae"),
    "Manipal Academy of Higher Education Dubai": logoFromDomain("manipal.edu"),
    "De Montfort University Dubai": logoFromDomain("dmu.ac.uk"),
  },
};

export const countryPages: CountryPage[] = typedCountries.map((country) => ({
  ...country,
  universities: country.universities.map((university) => ({
    ...university,
    logo: universityLogoLookup[country.slug]?.[university.name] ?? "",
  })),
  spotlightImage: countrySpotlightImages[country.slug as keyof typeof countrySpotlightImages] ?? italyImg,
  heroImage: countryImageSelectionLookup[country.slug as keyof typeof countryImageSelectionLookup]?.heroBackground ?? defaultCountrySelection.heroBackground,
  visuals: countryVisuals[country.slug] ?? {
    heroImage: defaultCountrySelection.overview,
    gallery: [defaultCountrySelection.heroFeature],
    featuredLogos: [],
    budgetImage: defaultCountrySelection.overview,
    visaImage: defaultCountrySelection.admission,
    workImage: defaultCountrySelection.heroFeature,
    whyStudyImage: defaultCountrySelection.heroBackground,
  },
}));

export const countryMenuItems = countryPages.map((page) => ({
  slug: page.slug,
  name: page.name,
  note: page.menuNote,
  href: `/study-in/${page.slug}`,
}));

export const destinationCards = countryPages.map((page) => ({
  slug: page.slug,
  country: page.name,
  tag: page.menuNote,
  img: page.spotlightImage,
  unis: page.universities.length,
}));

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export type UniversityPage = {
  slug: string;
  name: string;
  countrySlug: string;
  countryName: string;
  countryHeroImage: string;
  menuNote: string;
  heroTag: string;
  program: string;
  tag: string;
  logo: string;
  timeline: { label: string; value: string }[];
  requirements: string[];
  scholarships?: string[];
  costs: { label: string; value: string }[];
  highlights: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  visuals: UniversityImageSet;
  isMbbs?: boolean;
};

const standardUniversityPages: UniversityPage[] = countryPages.flatMap((country) =>
  country.universities.map((university) => ({
    slug: slugify(university.name),
    name: university.name,
    countrySlug: country.slug,
    countryName: country.name,
    countryHeroImage: country.heroImage,
    menuNote: country.menuNote,
    heroTag: country.heroTag,
    program: university.program,
    tag: university.tag,
    logo: university.logo,
    timeline: country.timeline,
    requirements: country.requirements,
    scholarships: country.scholarships,
    costs: country.costs,
    highlights: country.highlights,
    faqs: country.faqs,
    visuals:
      universityImageSelections[`${country.slug}/${slugify(university.name)}`] ?? {
        heroBackground: country.heroImage,
        heroFeature: country.visuals.gallery[0] ?? country.heroImage,
        overview: country.visuals.budgetImage,
      },
  })),
);

const mbbsCostLookup: Record<string, { tuition: string; living: string; visa: string }> = {
  russia: { tuition: "USD 3,500 - 6,500 / year", living: "USD 150 - 300 / month", visa: "4-8 weeks" },
  uzbekistan: { tuition: "USD 3,000 - 5,500 / year", living: "USD 180 - 320 / month", visa: "3-6 weeks" },
  kyrgyzstan: { tuition: "USD 3,000 - 5,000 / year", living: "USD 180 - 300 / month", visa: "3-6 weeks" },
  kazakhstan: { tuition: "USD 3,500 - 6,000 / year", living: "USD 200 - 350 / month", visa: "4-8 weeks" },
};

const commonsFilePath = (fileName: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;

const mbbsUniversityVisuals: Record<string, UniversityImageSet> = {
  russia: {
    heroBackground: commonsFilePath("Урологическая клиника Казанского государственного медицинского университета.jpg"),
    heroFeature: commonsFilePath("Урологическая клиника Казанского государственного медицинского университета.jpg"),
    overview: commonsFilePath("Урологическая клиника Казанского государственного медицинского университета.jpg"),
  },
  uzbekistan: {
    heroBackground: commonsFilePath("TTA campus.jpg"),
    heroFeature: commonsFilePath("TTA campus 2.jpg"),
    overview: commonsFilePath("Ректорат ТМА.jpg"),
  },
  kyrgyzstan: {
    heroBackground:
      "https://kyrgyzstatemedicalacademy.net/wp-content/uploads/2020/06/Kyrgyz-State-Medical-Academy-Bishkek-7-768x432.jpg",
    heroFeature:
      "https://kyrgyzstatemedicalacademy.net/wp-content/uploads/2020/06/Kyrgyz-State-Medical-Academy-21-500x275.jpg",
    overview:
      "https://kyrgyzstatemedicalacademy.net/wp-content/uploads/2020/07/Kyrgyz-State-Medical-Academy-Bishkek-500x275.jpg",
  },
  kazakhstan: {
    heroBackground: commonsFilePath("Main building, Kazak National Medical University.jpg"),
    heroFeature: commonsFilePath("Main building, Kazak National Medical University.jpg"),
    overview: commonsFilePath("Main building, Kazak National Medical University.jpg"),
  },
};

const mbbsCountryPages: CountryPage[] = mbbsStudyAbroadCountries.map((country) => {
  const countrySlug = slugify(country.name);
  const costs = mbbsCostLookup[countrySlug] ?? {
    tuition: "Varies by university",
    living: "Depends on city and lifestyle",
    visa: "4-8 weeks",
  };

  return {
    slug: countrySlug,
    name: country.name,
    menuNote: country.note,
    heroTag: `MBBS in ${country.name}`,
    heroSummary: `Explore MBBS in ${country.name} with a focused shortlist of universities, cost planning, and admission timing in one destination page.`,
    heroStats: [
      { label: "Typical tuition", value: costs.tuition },
      { label: "Popular intake", value: "Rolling / Autumn" },
      { label: "Best for", value: "MBBS, medicine, practical planning" },
    ],
    highlights: [
      {
        title: "MBBS-focused destination",
        body: `${country.name} offers a compact MBBS shortlist that is easier to compare at a glance.`,
      },
      {
        title: "Simple shortlist",
        body: `The ${country.universities.length} universities listed here can be compared without jumping across different pages.`,
      },
      {
        title: "Planning support",
        body: `Use tuition, living budget, and visa timing together to build a practical MBBS plan.`,
      },
    ],
    universities: country.universities.map((university) => ({
      name: university,
      program: "MBBS",
      tag: "MBBS",
      logo: "",
    })),
    costs: [
      { label: "Tuition", value: costs.tuition },
      { label: "Living budget", value: costs.living },
      { label: "Visa window", value: costs.visa },
      { label: "Course duration", value: "Usually 5 to 6 years including internship structure." },
    ],
    timeline: [
      { label: "Application window", value: "Rolling cycles work best when you shortlist early." },
      { label: "Main intake", value: "Typically September / October, depending on university." },
      { label: "Visa processing", value: costs.visa },
    ],
    requirements: [
      "10+2 with Physics, Chemistry, and Biology from a recognised board.",
      "NEET qualification as per current Indian eligibility requirements for studying MBBS abroad.",
      "Academic transcripts, passport, photographs, and university application documents.",
      "Financial documents and supporting paperwork for visa processing and student travel.",
    ],
    scholarships: [
      `${country.name} MBBS merit support`,
      `${country.name} university scholarship opportunities`,
      "External education funding options",
    ],
    faqs: [
      {
        q: `Is MBBS in ${country.name} suitable for focused planning?`,
        a: `Yes. The destination page keeps the MBBS shortlist, budget, and admission timing together.`,
      },
      {
        q: `How many universities are listed for ${country.name}?`,
        a: `There are ${country.universities.length} universities currently on the shortlist.`,
      },
      {
        q: `Can students move from this page to individual university details?`,
        a: "Yes. Each listed university links to its own dedicated page for deeper comparison.",
      },
    ],
    heroImage: country.image,
    spotlightImage: country.image,
    visuals: {
      heroImage: country.image,
      gallery: [country.image],
      featuredLogos: [],
      budgetImage: country.image,
      visaImage: country.image,
      workImage: country.image,
      whyStudyImage: country.image,
    },
  };
});

export const allCountryPages: CountryPage[] = [...countryPages, ...mbbsCountryPages];

export const countryPageMap = Object.fromEntries(allCountryPages.map((page) => [page.slug, page]));

const buildMbbsUniversityPages = (): UniversityPage[] =>
  mbbsStudyAbroadCountries.flatMap((country) => {
    const countrySlug = slugify(country.name);
    const costs = mbbsCostLookup[countrySlug] ?? {
      tuition: "Varies by university",
      living: "Depends on city and lifestyle",
      visa: "4-8 weeks",
    };

    return country.universities.map((universityName) => ({
      slug: slugify(universityName),
      name: universityName,
      countrySlug,
      countryName: country.name,
      countryHeroImage: country.image,
      menuNote: country.note,
      heroTag: `MBBS in ${country.name}`,
      program: "MBBS",
      tag: "MBBS",
      logo: "",
      timeline: [
        { label: "Application window", value: "Most universities accept applications in rolling cycles, so early shortlisting helps." },
        { label: "Typical intake", value: "Main intake usually opens around September or October, depending on the university." },
        { label: "Visa processing", value: costs.visa },
      ],
      requirements: [
        "10+2 with Physics, Chemistry, and Biology from a recognised board.",
        "NEET qualification as per current Indian eligibility requirements for studying MBBS abroad.",
        "Academic transcripts, passport, photographs, and university application documents.",
        "Financial documents and supporting paperwork for visa processing and student travel.",
      ],
      scholarships: [`${universityName} merit-based support`, `${country.name} university scholarship opportunities`, "External education funding options"],
      costs: [
        { label: "Tuition fees", value: costs.tuition },
        { label: "Living costs", value: costs.living },
        { label: "Visa processing", value: costs.visa },
        { label: "Course duration", value: "Usually 5 to 6 years including internship structure, based on university norms." },
      ],
      highlights: [
        { title: "Student-first planning", body: `A focused MBBS route in ${country.name} with university shortlisting, documents, and admission support in one flow.` },
        { title: "Clear shortlist", body: `${universityName} appears in the current ${country.name} MBBS shortlist for students comparing practical options abroad.` },
        { title: "End-to-end support", body: "The journey typically covers admissions, visa preparation, pre-departure guidance, and next-step planning." },
      ],
      faqs: [
        { q: `Why choose ${universityName} for MBBS?`, a: `${universityName} is part of the ${country.name} MBBS shortlist and can be evaluated for academics, budget, and student fit.` },
        { q: `What should students check before applying to ${universityName}?`, a: "Review eligibility, total costs, hostel or living arrangements, visa requirements, and the latest admission process." },
        { q: `Can students compare ${universityName} with other MBBS options in ${country.name}?`, a: "Yes. The page is designed to help families compare universities within the same destination before applying." },
      ],
      visuals: {
        heroBackground: mbbsUniversityVisuals[countrySlug]?.heroBackground ?? country.image,
        heroFeature: mbbsUniversityVisuals[countrySlug]?.heroFeature ?? country.image,
        overview: mbbsUniversityVisuals[countrySlug]?.overview ?? country.image,
      },
      isMbbs: true,
    }));
  });

export const universityPages: UniversityPage[] = [...standardUniversityPages, ...buildMbbsUniversityPages()];

export const universityPageMap = Object.fromEntries(
  universityPages.map((page) => [`${page.countrySlug}/${page.slug}`, page]),
);

export const getUniversityPageHref = (countrySlug: string, universityName: string) =>
  `/study-in/${countrySlug}/universities/${slugify(universityName)}`;

export const getUniversityPageHrefBySlug = (countrySlug: string, universitySlug: string) =>
  `/study-in/${countrySlug}/universities/${universitySlug}`;

export const countryMeta: Record<string, {
  capital: string;
  language: string;
  internationalStudents: string;
  climate: string;
  population: string;
  currency: string;
  gdp: string;
  universities: string;
  workPermit: string;
}> = {
  italy: {
    capital: "Rome",
    language: "Italian",
    internationalStudents: "100,000+",
    climate: "Mediterranean",
    population: "58.9 million",
    currency: "Euro (EUR)",
    gdp: "$2.2 Trillion",
    universities: "Around 90",
    workPermit: "12 months",
  },
  germany: {
    capital: "Berlin",
    language: "German",
    internationalStudents: "400,000+",
    climate: "Temperate seasonal",
    population: "84.4 million",
    currency: "Euro (EUR)",
    gdp: "$4.5 Trillion",
    universities: "Around 400",
    workPermit: "18 months",
  },
  france: {
    capital: "Paris",
    language: "French",
    internationalStudents: "430,000+",
    climate: "Oceanic and continental",
    population: "68.0 million",
    currency: "Euro (EUR)",
    gdp: "$3.1 Trillion",
    universities: "Around 350",
    workPermit: "12 months",
  },
  uk: {
    capital: "London",
    language: "English",
    internationalStudents: "680,000+",
    climate: "Temperate maritime",
    population: "67.7 million",
    currency: "Pound sterling (GBP)",
    gdp: "$3.3 Trillion",
    universities: "Around 160",
    workPermit: "2 years",
  },
  canada: {
    capital: "Ottawa",
    language: "English and French",
    internationalStudents: "1,000,000+",
    climate: "Varies by province",
    population: "41.3 million",
    currency: "Canadian Dollar (CAD)",
    gdp: "$2.1 Trillion",
    universities: "Around 100",
    workPermit: "Up to 3 years",
  },
  usa: {
    capital: "Washington, D.C.",
    language: "English",
    internationalStudents: "1,000,000+",
    climate: "Varies by state",
    population: "335.8 million",
    currency: "US Dollar (USD)",
    gdp: "$27.4 Trillion",
    universities: "4,000+",
    workPermit: "1 year OPT",
  },
  australia: {
    capital: "Canberra",
    language: "English",
    internationalStudents: "700,000+",
    climate: "Mostly temperate",
    population: "27.1 million",
    currency: "Australian Dollar (AUD)",
    gdp: "$1.7 Trillion",
    universities: "Around 43",
    workPermit: "2-4 years",
  },
  malta: {
    capital: "Valletta",
    language: "Maltese and English",
    internationalStudents: "13,000+",
    climate: "Mediterranean",
    population: "0.56 million",
    currency: "Euro (EUR)",
    gdp: "$20 Billion",
    universities: "Around 2",
    workPermit: "12 months",
  },
  dubai: {
    capital: "Dubai",
    language: "Arabic and English",
    internationalStudents: "200,000+",
    climate: "Desert",
    population: "3.6 million",
    currency: "UAE Dirham (AED)",
    gdp: "$100+ Billion",
    universities: "20+",
    workPermit: "Varies",
  },
};
