export type ScholarshipFinderResult = {
  id: string;
  title: string;
  provider: string;
  country: string;
  countrySlug: string;
  intake: string;
  amount: string;
  type: string;
  level: string;
  stream: string;
  currency: string;
  description: string;
  badges: string[];
  applyHref: string;
};

const uniqueSortedOptions = (values: string[]) => ["All", ...Array.from(new Set(values)).sort((left, right) => left.localeCompare(right))];

export const scholarshipCurrencyOptions = ["All", "INR", "USD", "EUR", "GBP"];
export const scholarshipTypeOptions = ["All", "Merit Based", "Need Based", "Government", "Country Specific", "Program Specific"];
export const scholarshipIntakeOptions = ["All", "2025", "2026", "2027"];

export const scholarshipResults: ScholarshipFinderResult[] = [
  {
    id: "university-of-bath-mba-scholarships",
    title: "University of Bath MBA Scholarships",
    provider: "University of Bath",
    country: "United Kingdom",
    countrySlug: "uk",
    intake: "2026",
    amount: "15000",
    type: "Merit Based",
    level: "Masters",
    stream: "Commerce, Business and Administration",
    currency: "INR",
    description:
      "Merit-focused support for MBA applicants comparing tuition relief, leadership profile fit, and deadlines for the upcoming intake.",
    badges: ["MBA", "Business school", "UK"],
    applyHref: "/find-your-path",
  },
  {
    id: "excellence-and-merit-scholarships-college-of-science-and-engineering",
    title: "Excellence and Merit Scholarships",
    provider: "University of Galway",
    country: "Ireland",
    countrySlug: "ireland",
    intake: "2026",
    amount: "Rs 8,83,700/-",
    type: "Merit Based",
    level: "Masters",
    stream: "Physical Sciences, Sciences",
    currency: "INR",
    description:
      "A scholarship option for strong applicants in science and engineering who want to reduce the first-year cost of studying in Ireland.",
    badges: ["Science", "Engineering", "Ireland"],
    applyHref: "/find-your-path",
  },
  {
    id: "higher-diploma-scholarship",
    title: "Higher Diploma Scholarship",
    provider: "National College of Ireland",
    country: "Ireland",
    countrySlug: "ireland",
    intake: "2026",
    amount: "Rs 3,73,000/-",
    type: "Merit Based",
    level: "Masters",
    stream: "Commerce, Business and Administration",
    currency: "INR",
    description:
      "Funding support for higher diploma applicants looking for a practical, career-oriented route into the Irish market.",
    badges: ["Diploma", "Career-focused", "Ireland"],
    applyHref: "/find-your-path",
  },
  {
    id: "undergraduate-academic-scholarships",
    title: "Undergraduate Academic Scholarships",
    provider: "National College of Ireland",
    country: "Ireland",
    countrySlug: "ireland",
    intake: "2026",
    amount: "Rs 1,86,500/-",
    type: "Merit Based",
    level: "Bachelors",
    stream: "Commerce, Business and Administration",
    currency: "INR",
    description:
      "Academic support for undergraduate students who want an accessible way to study in Ireland without losing momentum on quality.",
    badges: ["Undergraduate", "Merit", "Ireland"],
    applyHref: "/find-your-path",
  },
  {
    id: "young-future-leaders-programme-scholarship",
    title: "Young Future Leaders Programme Scholarship",
    provider: "National College of Ireland",
    country: "Ireland",
    countrySlug: "ireland",
    intake: "2026",
    amount: "Rs 2,65,110/-",
    type: "Merit Based",
    level: "Bachelors",
    stream: "Commerce, Business and Administration",
    currency: "INR",
    description:
      "Leadership-oriented funding for undergraduates who can show promise, ambition, and a strong all-round profile.",
    badges: ["Leadership", "Undergraduate", "Ireland"],
    applyHref: "/find-your-path",
  },
  {
    id: "sllc-excellence-scholarships-masters",
    title: "SLLC Excellence Scholarships",
    provider: "University College Cork",
    country: "Ireland",
    countrySlug: "ireland",
    intake: "2026",
    amount: "Merit Based",
    type: "Merit Based",
    level: "Masters",
    stream: "Arts",
    currency: "EUR",
    description:
      "A strong fit for postgraduate applicants who want to combine academic distinction with a scholarship-backed Irish offer.",
    badges: ["Postgraduate", "Arts", "Ireland"],
    applyHref: "/find-your-path",
  },
  {
    id: "school-of-business-entrepreneurial-scholarship",
    title: "School of Business Entrepreneurial Scholarship",
    provider: "South East Technological University - Waterford",
    country: "Ireland",
    countrySlug: "ireland",
    intake: "2026",
    amount: "Rs 1,86,500/-",
    type: "Merit Based",
    level: "Bachelors",
    stream: "Commerce, Business and Administration",
    currency: "INR",
    description:
      "Built for students with entrepreneurial interests who want a business pathway with a scholarship edge.",
    badges: ["Entrepreneurship", "Business", "Ireland"],
    applyHref: "/find-your-path",
  },
  {
    id: "scholarships-for-international-students-school-of-medicine",
    title: "Scholarships for International Students",
    provider: "University of Galway",
    country: "Ireland",
    countrySlug: "ireland",
    intake: "2026",
    amount: "Merit Based",
    type: "Merit Based",
    level: "Bachelors & Masters",
    stream: "Health",
    currency: "EUR",
    description:
      "A medicine and health-oriented option for international students comparing merit support and eligibility windows.",
    badges: ["Medicine", "Health", "Ireland"],
    applyHref: "/find-your-path",
  },
];

export const scholarshipCountryOptions = uniqueSortedOptions(scholarshipResults.map((result) => result.country));
export const scholarshipLevelOptions = uniqueSortedOptions(scholarshipResults.map((result) => result.level));
export const scholarshipStreamOptions = uniqueSortedOptions(scholarshipResults.map((result) => result.stream));

export const scholarshipCountrySummaries = [
  {
    country: "United Kingdom",
    summary: "Need-aware and merit-led scholarship options for postgraduate applicants.",
  },
  {
    country: "Ireland",
    summary: "A strong mix of university awards across business, science, health, and undergraduate routes.",
  },
  {
    country: "United States",
    summary: "Prestigious fellowships and international awards with competitive profiles.",
  },
  {
    country: "Germany",
    summary: "Mostly tuition-light study pathways with targeted scholarship support.",
  },
  {
    country: "Canada",
    summary: "Destination planning that blends admission fit with practical funding strategy.",
  },
];

export const scholarshipFaqs = [
  {
    question: "How do I increase my chances of getting a scholarship?",
    answer:
      "Build a strong academic profile, shape a focused SOP, collect quality recommendations, and apply early so you are visible before funding closes.",
  },
  {
    question: "Can Indian students get fully funded scholarships abroad?",
    answer:
      "Yes. Several universities, governments, and foundations offer fully funded or near fully funded awards, especially for high-performing applicants.",
  },
  {
    question: "What documents are usually required?",
    answer:
      "Most applications ask for transcripts, a CV, a statement of purpose, recommendation letters, and proof of language proficiency.",
  },
  {
    question: "How is this different from a course finder?",
    answer:
      "The scholarship finder focuses on funding and eligibility first, while a course finder helps shortlist programs by country, course level, and intake.",
  },
];

export const scholarshipHowItWorks = [
  {
    title: "Search by fit",
    body: "Filter by intake, currency, scholarship type, and stream so the list narrows to awards that match your profile.",
  },
  {
    title: "Compare awards",
    body: "Review the provider, target level, amount, and type to see which options are worth a full application.",
  },
  {
    title: "Apply with guidance",
    body: "Use expert support to tighten your application, sequence deadlines, and line up documents without missing key windows.",
  },
];
