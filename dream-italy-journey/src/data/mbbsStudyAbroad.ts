import russiaImage from "@/assets/mbbs/russia.optimized.webp";
import uzbekistanImage from "@/assets/mbbs/uzbekistan.optimized.webp";
import kyrgyzstanImage from "@/assets/mbbs/kyrgyzstan.optimized.webp";
import kazakhstanImage from "@/assets/mbbs/kazakhstan.optimized.webp";

export type MbbsCountry = {
  name: string;
  note: string;
  image: string;
  universities: string[];
};

export const mbbsStudyAbroadCountries: MbbsCountry[] = [
  {
    name: "Russia",
    note: "Popular destination",
    image: russiaImage,
    universities: [
      "Syktyvkar State Medical University",
      "Chuvash State Medical University",
      "Osmk State Medical University",
      "Yaroslavl State Medical University",
      "North Caucasian State Medical Academy",
      "Ingush State University",
    ],
  },
  {
    name: "Uzbekistan",
    note: "Growing interest",
    image: uzbekistanImage,
    universities: ["UBS Namangan University", "Turon Zarmed University", "Tashkent Medical Academy"],
  },
  {
    name: "Kyrgyzstan",
    note: "Student-friendly option",
    image: kyrgyzstanImage,
    universities: ["Avicenna Internation Medical University", "International European University - IEU"],
  },
  {
    name: "Kazakhstan",
    note: "Established choice",
    image: kazakhstanImage,
    universities: [
      "Kokshetau State University",
      "South Kazakhstan State University",
      "Al Farabi Kazakh National University",
      "Kazakh National Medical University (KazNMU)",
      "South Kazakhstan Medical Academy (SKMA)",
    ],
  },
];

export const mbbsStudyAbroadFaqs = [
  {
    q: "Is this a country-wise or university-wise page?",
    a: "It combines country comparisons with university shortlists in one MBBS guide.",
  },
  {
    q: "Which country has the biggest shortlist here?",
    a: "Russia currently has the longest university list on the page.",
  },
  {
    q: "Can this be expanded later?",
    a: "Yes. The structure is intentionally simple so more countries or universities can be added without changing the layout.",
  },
  {
    q: "Is this MBBS page separate from the country pages?",
    a: "Yes. It is a dedicated MBBS study abroad page rather than a country destination page.",
  },
] as const;
