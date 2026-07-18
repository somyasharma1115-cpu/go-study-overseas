import { countryMeta, universityPages, type UniversityPage } from "./countries";

export type CourseFinderResult = {
  id: string;
  course: string;
  university: string;
  universitySlug: string;
  countrySlug: string;
  country: string;
  city: string;
  level: string;
  intake: string;
  stream: string;
  budget: string;
  duration: string;
  tuition: string;
  ranking: string;
  exams: string[];
  highlight: string;
  badges: string[];
  logo: string;
};

const word = (value: string) => value.toLowerCase();

const levelMatchers: Array<{ pattern: RegExp; level: string }> = [
  { pattern: /\bphd\b|doctorate|doctoral/i, level: "PhD" },
  { pattern: /\bmba\b/i, level: "MBA" },
  { pattern: /pg diploma|postgraduate diploma|diploma/i, level: "PG Diploma" },
  { pattern: /bachelor|beng|\bba\b|\bbs\b|\bllb\b|\bmbbs\b|\bug\b/i, level: "Bachelor's" },
  { pattern: /master|msc|\bms\b|\bma\b|\bmeng\b|\bmtech\b|\bmphil\b/i, level: "Master's" },
];

const streamMatchers: Array<{ pattern: RegExp; stream: CourseFinderResult["stream"] }> = [
  { pattern: /design|architecture|fashion|industrial design|product design|interior/i, stream: "Design" },
  { pattern: /law|legal|justice|jurisprud|crimin/i, stream: "Law" },
  { pattern: /medical|medicine|mbbs|health|nursing|pharmacy|clinical|dentistr/i, stream: "Healthcare" },
  { pattern: /data|analytics|artificial intelligence|\bai\b|machine learning|computer|software|informatics|cyber|robotic/i, stream: "Data & AI" },
  { pattern: /mba|business|management|finance|commerce|economics|strategy|marketing|entrepreneur|leadership/i, stream: "Management" },
  {
    pattern: /arts|humanities|history|philosophy|literature|language|linguistics|social science|psychology|sociology|media|communication|creative/i,
    stream: "Arts & Humanities",
  },
  { pattern: /engineering|stem|science|technology|\btech\b|physics|mathematics|biotech|biotechnology|applied/i, stream: "Engineering" },
];

const selfFundedCountries = new Set(["italy", "germany", "malta"]);
const partialLoanCountries = new Set(["uk", "usa", "dubai"]);
const sponsoredCountries = new Set(["france", "canada", "australia"]);

const countryCityFallbacks: Record<string, string> = {
  italy: "Italy",
  germany: "Germany",
  france: "France",
  uk: "United Kingdom",
  canada: "Canada",
  usa: "United States",
  australia: "Australia",
  malta: "Malta",
  dubai: "Dubai",
  russia: "Russia",
  uzbekistan: "Uzbekistan",
  kyrgyzstan: "Kyrgyzstan",
  kazakhstan: "Kazakhstan",
};

const cityOverrides: Record<string, string> = {
  "sapienza university of rome": "Rome",
  "university of bologna": "Bologna",
  "politecnico di milano": "Milan",
  "university of milan": "Milan",
  "university of padua": "Padua",
  "politecnico di torino": "Turin",
  "university of pisa": "Pisa",
  "university of naples federico ii": "Naples",
  "university of florence": "Florence",
  "university of turin": "Turin",
  "university of siena": "Siena",
  "university of trento": "Trento",
  "university of genoa": "Genoa",
  "university of palermo": "Palermo",
  "university of messina": "Messina",
  "university of parma": "Parma",
  "university of cassino & southern lazio": "Cassino",
  "university of macerata": "Macerata",
  "university of camerino": "Camerino",
  "university of trieste": "Trieste",
  "university of calabria": "Calabria",
  "university of catania": "Catania",
  "university of sassari": "Sassari",
  "university of tuscia": "Viterbo",
  "technical university of munich": "Munich",
  "rwth aachen": "Aachen",
  "lmu munich": "Munich",
  "university of heidelberg": "Heidelberg",
  "constructor university bremen": "Bremen",
  "steinbeis university berlin": "Berlin",
  "hamburg university of technology (tuhh)": "Hamburg",
  "arden university berlin": "Berlin",
  "iu international university of applied sciences": "Berlin",
  "gisma university of applied sciences": "Berlin",
  "imperial college london": "London",
  "king's college london": "London",
  "university of manchester": "Manchester",
  "university of birmingham": "Birmingham",
  "university of hertfordshire": "Hatfield",
  "university of toronto": "Toronto",
  "university of british columbia": "Vancouver",
  "mcgill university": "Montreal",
  "university of waterloo": "Waterloo",
  "northeastern university": "Boston",
  "drexel university": "Philadelphia",
  "university of southern california": "Los Angeles",
  "arizona state university": "Tempe",
  "university of melbourne": "Melbourne",
  "unsw sydney": "Sydney",
  "monash university": "Melbourne",
  "university of sydney": "Sydney",
  "gbs malta": "Msida",
  "gbs dubai": "Dubai",
  "middlesex university dubai": "Dubai",
  "manipal academy of higher education dubai": "Dubai",
  "de montfort university dubai": "Dubai",
};

const inferLevel = (page: UniversityPage): string => {
  const haystack = `${page.program} ${page.tag} ${page.name}`;

  if (page.isMbbs) {
    return "Bachelor's";
  }

  for (const matcher of levelMatchers) {
    if (matcher.pattern.test(haystack)) {
      return matcher.level;
    }
  }

  return "Master's";
};

const inferStream = (page: UniversityPage): CourseFinderResult["stream"] => {
  const haystack = `${page.program} ${page.tag} ${page.name}`;

  for (const matcher of streamMatchers) {
    if (matcher.pattern.test(haystack)) {
      return matcher.stream;
    }
  }

  if (/research|scientific|public|international|applied|practice-based|professional|flexible|career-focused/i.test(haystack)) {
    return "Engineering";
  }

  return page.countrySlug === "malta" || page.countrySlug === "dubai" ? "Management" : "Engineering";
};

const inferCity = (page: UniversityPage): string => {
  const override = cityOverrides[word(page.name)];
  if (override) {
    return override;
  }

  const capital = countryMeta[page.countrySlug]?.capital;
  if (capital) {
    return capital;
  }

  return countryCityFallbacks[page.countrySlug] ?? page.countryName;
};

const inferIntake = (page: UniversityPage): string => {
  if (page.isMbbs) {
    return "Rolling / Flexible";
  }

  if (page.countrySlug === "germany") {
    return "Spring 2027";
  }

  if (page.countrySlug === "australia") {
    return "Summer 2027";
  }

  if (page.countrySlug === "malta") {
    return "Rolling / Flexible";
  }

  return "Fall 2026";
};

const inferBudget = (page: UniversityPage): string => {
  if (page.isMbbs || selfFundedCountries.has(page.countrySlug)) {
    return "Self-funded";
  }

  if (sponsoredCountries.has(page.countrySlug)) {
    return "Sponsored";
  }

  if (partialLoanCountries.has(page.countrySlug)) {
    return "Partial loan";
  }

  return "Self-funded";
};

const inferDuration = (page: UniversityPage, level: string): string => {
  if (page.isMbbs) {
    return "5-6 years";
  }

  if (level === "PhD") {
    return "36-48 months";
  }

  if (level === "MBA") {
    return "12 months";
  }

  if (level === "PG Diploma") {
    return "12 months";
  }

  if (level === "Bachelor's") {
    return "36-48 months";
  }

  return "12-24 months";
};

const inferExams = (page: UniversityPage, level: string, stream: CourseFinderResult["stream"]): string[] => {
  if (level === "MBA" || stream === "Management") {
    return ["IELTS", "GMAT", "GRE"];
  }

  if (level === "PhD") {
    return ["IELTS", "TOEFL", "GRE"];
  }

  if (page.isMbbs || stream === "Healthcare") {
    return ["IELTS", "TOEFL", "PTE"];
  }

  return ["IELTS", "TOEFL", "PTE", "Duolingo"];
};

const inferRanking = (page: UniversityPage): string => {
  if (page.isMbbs) {
    return "MBBS shortlist";
  }

  return page.tag || `${page.countryName} shortlist`;
};

const buildBadges = (page: UniversityPage, level: string, stream: CourseFinderResult["stream"]): string[] => {
  const badges = new Set<string>();

  if (page.isMbbs) {
    badges.add("MBBS");
  }

  badges.add(page.tag);
  badges.add(level === "PhD" ? "Research route" : level === "MBA" ? "Career switch" : "English taught");

  if (stream === "Engineering") {
    badges.add("STEM");
  }

  if (stream === "Management") {
    badges.add("Career focused");
  }

  if (page.countrySlug === "italy" || page.countrySlug === "germany" || page.countrySlug === "malta") {
    badges.add("Value pick");
  }

  return Array.from(badges).filter(Boolean).slice(0, 3);
};

export const buildCourseFinderResults = (pages: UniversityPage[]): CourseFinderResult[] =>
  pages.map((page) => {
    const level = inferLevel(page);
    const stream = inferStream(page);
    const tuition = page.costs.find((item) => /tuition/i.test(item.label))?.value ?? "Varies by university";
    const highlight =
      page.highlights[0]?.body ??
      `Shortlisted from the ${page.countryName} university catalog with country guidance, applications, and planning support.`;

    return {
      id: `${page.countrySlug}-${page.slug}`,
      course: page.program,
      university: page.name,
      universitySlug: page.slug,
      countrySlug: page.countrySlug,
      country: page.countryName,
      city: inferCity(page),
      level,
      intake: inferIntake(page),
      stream,
      budget: inferBudget(page),
      duration: inferDuration(page, level),
      tuition,
      ranking: inferRanking(page),
      exams: inferExams(page, level, stream),
      highlight,
      badges: buildBadges(page, level, stream),
      logo: page.logo,
    };
  });

export const courseFinderResults = buildCourseFinderResults(universityPages);

export const courseFinderCountryOptions = Array.from(new Set(courseFinderResults.map((result) => result.country)));
