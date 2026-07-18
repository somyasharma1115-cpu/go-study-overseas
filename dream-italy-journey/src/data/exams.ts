export type ExamTable = {
  headers: string[];
  rows: string[][];
};

export type ExamSection = {
  id: string;
  label: string;
  title: string;
  intro?: string;
  paragraphs?: string[];
  bullets?: string[];
  tables?: ExamTable[];
  faqs?: { q: string; a: string }[];
};

export type ExamPage = {
  slug: string;
  name: string;
  menuNote: string;
  heroTag: string;
  heroTitle: string;
  heroSummary: string;
  stats: { label: string; value: string }[];
  sections: ExamSection[];
};

type StandardExamConfig = {
  slug: string;
  name: string;
  menuNote: string;
  heroTag: string;
  heroTitle: string;
  heroSummary: string;
  stats: { label: string; value: string }[];
  about: string[];
  sectionSummary: string;
  sectionRows: string[][];
  formatSummary: string;
  formatRows: string[][];
  scoreSummary: string;
  scoreRows: string[][];
  registration: string[];
  fees: string[];
  faqs: { q: string; a: string }[];
};

const createStandardExamPage = (config: StandardExamConfig): ExamPage => {
  const sections: ExamSection[] = [
    {
      id: "overview",
      label: "Overview",
      title: `About ${config.name} Exam`,
      paragraphs: config.about,
    },
    {
      id: "sections",
      label: "Sections",
      title: `${config.name} Sections`,
      intro: config.sectionSummary,
      tables: [
        {
          headers: ["Section", "What it tests"],
          rows: config.sectionRows,
        },
      ],
    },
    {
      id: "format",
      label: "Test Format",
      title: `${config.name} Test Format`,
      intro: config.formatSummary,
      tables: [
        {
          headers: ["Metric", "Details"],
          rows: config.formatRows,
        },
      ],
    },
    {
      id: "score",
      label: "Test Score",
      title: `${config.name} Test Score`,
      paragraphs: [
        config.scoreSummary,
      ],
      tables: [
        {
          headers: ["Score band / section", "Meaning"],
          rows: config.scoreRows,
        },
      ],
    },
    {
      id: "registration",
      label: "Registration",
      title: `${config.name} Registration`,
      paragraphs: config.registration,
    },
    {
      id: "fees",
      label: "Fees",
      title: `${config.name} Fees`,
      paragraphs: config.fees,
    },
    {
      id: "faqs",
      label: "FAQs",
      title: `${config.name} FAQs`,
      faqs: config.faqs,
    },
  ];

  return {
    slug: config.slug,
    name: config.name,
    menuNote: config.menuNote,
    heroTag: config.heroTag,
    heroTitle: config.heroTitle,
    heroSummary: config.heroSummary,
    stats: config.stats,
    sections,
  };
};

type SourceExamConfig = {
  slug: string;
  name: string;
  menuNote: string;
  heroTag: string;
  heroTitle: string;
  heroSummary: string;
  stats: { label: string; value: string }[];
  overviewTitle: string;
  overviewParagraphs: string[];
  detailTitle: string;
  detailRows: string[][];
  extraSections?: ExamSection[];
};

const createSourceExamPage = (config: SourceExamConfig): ExamPage => {
  const sections: ExamSection[] = [
    {
      id: "overview",
      label: "Overview",
      title: config.overviewTitle,
      paragraphs: config.overviewParagraphs,
    },
    {
      id: "details",
      label: "Test Details",
      title: config.detailTitle,
      tables: [
        {
          headers: ["Detail", "Value"],
          rows: config.detailRows,
        },
      ],
    },
    ...(config.extraSections ?? []),
  ];

  return {
    slug: config.slug,
    name: config.name,
    menuNote: config.menuNote,
    heroTag: config.heroTag,
    heroTitle: config.heroTitle,
    heroSummary: config.heroSummary,
    stats: config.stats,
    sections,
  };
};

const ieltsSections: ExamSection[] = [
  {
    id: "overview",
    label: "Overview",
    title: "Overview",
    intro:
      "Achieving proficiency in English is a key requirement for studying, working, or immigrating to countries like the UK, USA, Canada, and Australia. IELTS is the benchmark used to assess those skills.",
    paragraphs: [
      "IELTS evaluates listening, reading, writing, and speaking with a format trusted by thousands of institutions and authorities worldwide.",
      "This guide is organised to help students move through registration, preparation, and testing in a clear sequence.",
    ],
  },
  {
    id: "highlights",
    label: "Highlights",
    title: "IELTS Exam Highlights",
    tables: [
      {
        headers: ["Feature", "Details"],
        rows: [
          ["Exam Name", "IELTS"],
          ["Full Form", "International English Language Testing System"],
          ["Official Website", "www.ielts.org"],
          ["Best For", "Education, employment, or immigration in English-speaking countries"],
          ["Accepted By", "More than 11,500 organisations in over 140 countries"],
          ["Conducted By", "IDP Education Ltd."],
          ["Mode of Exam", "Computer-based and paper-based options"],
          ["IELTS Exam Fees", "₹18,000 (may vary)"],
          ["Score Range", "Band scores from 1 to 9"],
        ],
      },
    ],
  },
  {
    id: "why-required",
    label: "Why Required",
    title: "Why is the IELTS Exam required?",
    paragraphs: [
      "If you want to study, work, or settle abroad, you need to prove English proficiency, and IELTS is one of the most widely recognised ways to do that.",
      "It is designed to measure your ability to understand, speak, read, and write in English in real-life academic and everyday situations.",
    ],
    bullets: [
      "Listening",
      "Reading",
      "Writing",
      "Speaking",
    ],
  },
  {
    id: "eligibility",
    label: "Eligibility",
    title: "IELTS Eligibility",
    paragraphs: [
      "IELTS is open to everyone. There are no rigid eligibility requirements, no cut-offs, and no mandatory documents beyond what the test centre asks for.",
      "The primary age criterion used by IDP is that candidates should be at least 16 years old to register.",
    ],
    tables: [
      {
        headers: ["Criteria", "Details"],
        rows: [
          ["Minimum Age", "16 years"],
          ["Nationality", "Open to all nationalities"],
          ["Educational Background", "No specific qualification required"],
        ],
      },
    ],
  },
  {
    id: "registration",
    label: "Registration",
    title: "IELTS Registration",
    paragraphs: [
      "You can register for IELTS online or offline. The process is straightforward, and the test fee in India is ₹18,000.",
      "Paper-based tests are held on fixed dates, while the computer-based version offers more flexibility with multiple slots through the week.",
    ],
    bullets: [
      "Register on the official IELTS portal",
      "Choose Academic or General Training",
      "Select your city, centre, date, and time slot",
      "Upload your passport copy and pay the fee",
    ],
  },
  {
    id: "dates",
    label: "Dates",
    title: "IELTS Exam Dates 2025",
    paragraphs: [
      "IELTS runs throughout the year in India, but not every test type is available on every date or in every city.",
      "The computer-delivered test is available seven days a week with multiple slots, while the paper-based format follows fixed dates that fill up fast.",
    ],
  },
  {
    id: "pattern",
    label: "Pattern",
    title: "IELTS Exam Pattern 2025",
    tables: [
      {
        headers: ["Section", "Duration", "What to Expect"],
        rows: [
          ["Listening", "30 minutes", "4 sections and 40 questions"],
          ["Reading", "60 minutes", "3 passages and 40 questions"],
          ["Writing", "60 minutes", "2 tasks: data interpretation and essay writing"],
          ["Speaking", "11-14 minutes", "3-part conversation and discussion"],
        ],
      },
    ],
  },
  {
    id: "syllabus",
    label: "Syllabus",
    title: "IELTS Test Format",
    paragraphs: [
      "IELTS measures the same four key skills across its test versions: listening, reading, writing, and speaking.",
      "The Academic and General Training versions share the listening and speaking components, while the reading and writing sections differ based on the purpose of the test.",
    ],
    bullets: [
      "Academic: for higher education",
      "General Training: for work, immigration, or professional registration",
    ],
  },
  {
    id: "results",
    label: "Results",
    title: "IELTS Results",
    paragraphs: [
      "Computer-delivered IELTS results are typically released in 2 to 5 days.",
      "Paper-based IELTS results are usually available after 13 days.",
    ],
  },
  {
    id: "prep-tips",
    label: "Prep Tips",
    title: "IELTS Preparation Tips",
    paragraphs: [
      "Start by understanding the test format, then build a plan to improve grammar, vocabulary, and speed.",
      "Use trusted study materials and practice with real questions so your preparation stays focused and measurable.",
    ],
    bullets: [
      "Use official study materials",
      "Take full-length mock tests",
      "Time every practice session",
      "Study smart and stay consistent",
    ],
  },
  {
    id: "faqs",
    label: "FAQs",
    title: "IELTS FAQs",
    faqs: [
      {
        q: "What is IELTS used for?",
        a: "IELTS is used to prove English proficiency for study, work, and migration applications.",
      },
      {
        q: "Which IELTS format should I choose?",
        a: "Use IELTS Academic for university admission and General Training for work or migration purposes.",
      },
      {
        q: "How long is the IELTS test valid?",
        a: "IELTS scores are typically valid for two years.",
      },
    ],
  },
];

const toeflSections: ExamSection[] = [
  {
    id: "overview",
    label: "Overview",
    title: "Overview",
    intro:
      "TOEFL is a globally recognised assessment of English proficiency for non-native speakers and remains one of the leading English examinations for international admissions.",
    paragraphs: [
      "The test measures how well you understand and use English in academic situations.",
      "This page follows the same study-friendly structure as a university guide, with a left-side index for quick section jumps.",
    ],
  },
  {
    id: "eligibility",
    label: "Eligibility",
    title: "TOEFL Eligibility",
    paragraphs: [
      "There is no fixed universal TOEFL eligibility score. Each institution sets its own minimum score requirement based on the course and degree level.",
      "You should carry valid identification and be ready to confirm the registration details on test day.",
    ],
    tables: [
      {
        headers: ["University", "Country", "Minimum TOEFL iBT Score (2025)", "Additional Notes"],
        rows: [
          ["MIT", "USA", "90+", "Competitive applicants often score above 100"],
          ["Harvard University", "USA", "100+", "Some graduate courses may ask for 105+"],
          ["University of Oxford", "UK", "100", "Sectional minimums apply"],
          ["Imperial College London", "UK", "92-100", "Varies by course stream"],
          ["ETH Zurich", "Switzerland", "100+", "Required for English-taught programmes"],
        ],
      },
    ],
  },
  {
    id: "registration",
    label: "Registration",
    title: "TOEFL Registration",
    paragraphs: [
      "TOEFL registration is handled through ETS. Candidates can pick the test format and schedule that best matches their plan.",
      "The current TOEFL iBT options include test-centre and home edition formats, while the paper edition is no longer the primary path.",
    ],
    bullets: [
      "Register through the official ETS portal",
      "Choose your preferred test mode and date",
      "Keep a valid government-issued photo ID ready",
      "Review your confirmation carefully after booking",
    ],
  },
  {
    id: "dates",
    label: "Dates",
    title: "TOEFL Exam Dates 2025",
    paragraphs: [
      "TOEFL is available year-round, so you can plan around application deadlines without waiting for a single national test day.",
      "The iBT test is offered regularly, while the paper edition is no longer the standard path for most candidates.",
    ],
  },
  {
    id: "pattern",
    label: "Pattern",
    title: "TOEFL Exam Pattern",
    tables: [
      {
        headers: ["Section", "Duration", "Questions / Tasks"],
        rows: [
          ["Reading", "35 minutes", "20 questions"],
          ["Listening", "36 minutes", "28 questions"],
          ["Speaking", "16 minutes", "4 tasks"],
          ["Writing", "29 minutes", "2 tasks"],
          ["Total", "116 minutes", "48 questions and 6 tasks"],
        ],
      },
    ],
  },
  {
    id: "syllabus",
    label: "Syllabus",
    title: "TOEFL Syllabus 2025",
    paragraphs: [
      "TOEFL tests reading, listening, speaking, and writing in an academic context.",
      "The four sections reflect real classroom and university communication tasks, so practice should stay close to academic English.",
    ],
    bullets: [
      "Reading academic texts",
      "Listening to lectures and conversations",
      "Speaking clearly on familiar topics",
      "Writing essays based on reading and listening prompts",
    ],
  },
  {
    id: "results",
    label: "Results",
    title: "TOEFL Results",
    paragraphs: [
      "TOEFL scores are usually available within 4 to 8 days after the test date.",
      "Your score report includes separate scores for Reading, Listening, Speaking, and Writing, summed into a total out of 120.",
    ],
  },
  {
    id: "prep-tips",
    label: "Prep Tips",
    title: "TOEFL Preparation Tips",
    paragraphs: [
      "Use official ETS materials and the TOEFL TestReady tools to keep practice aligned with the real exam.",
      "Build section-specific drills so you can improve pace, comprehension, and response quality without relying on guesswork.",
    ],
    bullets: [
      "Practice with official ETS tests",
      "Work section by section",
      "Track timing on every drill",
      "Review mistakes and retest weak areas",
    ],
  },
  {
    id: "faqs",
    label: "FAQs",
    title: "TOEFL FAQs",
    faqs: [
      {
        q: "What does TOEFL measure?",
        a: "TOEFL measures your ability to use English in academic settings.",
      },
      {
        q: "How long is TOEFL valid?",
        a: "TOEFL scores are generally valid for two years.",
      },
      {
        q: "What is the TOEFL test duration?",
        a: "The TOEFL iBT takes about 116 minutes.",
      },
    ],
  },
];

export const examPages: ExamPage[] = [
  createSourceExamPage({
    slug: "ielts",
    name: "IELTS",
    menuNote: "Most recognised English test",
    heroTag: "English proficiency",
    heroTitle: "IELTS",
    heroSummary: "IELTS details, test structure, and requirements presented in the same indexed layout as our university pages.",
    stats: [
      { label: "Test type", value: "English language test" },
      { label: "Mode", value: "Both computer-based and paper-based" },
      { label: "Duration", value: "2 hours 55 minutes" },
      { label: "Validity", value: "Two years" },
    ],
    overviewTitle: "About IELTS Exam",
    overviewParagraphs: [
      "IELTS is an English proficiency test for non-native speakers who want to study in an English-speaking country.",
      "Universities in the US, UK, Australia, Canada, and New Zealand use IELTS scores to assess English ability for admission.",
      "In India, IDP administers IELTS after taking over the British Council’s stake in the country.",
    ],
    detailTitle: "IELTS Test Details",
    detailRows: [
      ["Test type", "English language test"],
      ["Mode", "Both computer-based and paper-based"],
      ["Duration", "2 hours 55 minutes"],
      ["Validity", "Two years"],
      ["Purpose", "Admission to an English language course"],
      ["Frequency", "Once a week"],
      ["Centre", "Nearest Centre"],
    ],
    extraSections: [
      {
        id: "sections",
        label: "Sections",
        title: "IELTS Sections",
        tables: [
          {
            headers: ["Section", "Questions / tasks", "Duration"],
            rows: [
              ["Listening", "40 dialogues", "40 minutes"],
              ["Reading", "3 texts, 40 questions", "60 minutes"],
              ["Writing", "2 tasks (describe graph + essay)", "60 minutes"],
              ["Speaking", "3 dialogues", "15 minutes"],
            ],
          },
        ],
      },
    ],
  }),
  createSourceExamPage({
    slug: "toefl",
    name: "TOEFL",
    menuNote: "Leading academic English test",
    heroTag: "English proficiency",
    heroTitle: "TOEFL",
    heroSummary: "TOEFL details, sections, and test format presented with the same section-jump layout used across the site.",
    stats: [
      { label: "Test type", value: "English language test" },
      { label: "Mode", value: "Internet-Based and Paper-Based" },
      { label: "Duration", value: "4 hours paper-based / 3 hours internet-based" },
      { label: "Validity", value: "Two years" },
    ],
    overviewTitle: "About TOEFL Exam",
    overviewParagraphs: [
      "TOEFL measures English ability for non-native speakers seeking admission to a foreign university.",
      "More than 11,000 institutions in 190 countries accept TOEFL scores as part of the admissions process.",
      "ETS designs and administers the test and sends score reports directly to the institutions you choose.",
    ],
    detailTitle: "TOEFL Test Details",
    detailRows: [
      ["Test type", "English language test"],
      ["Mode", "Internet-Based and Paper-Based"],
      ["Duration", "4 hours for paper-based and 3 hours for internet-based"],
      ["Validity", "Two years"],
      ["Purpose", "Admission to an English language course in a foreign university"],
      ["Frequency", "4 times a year for paper-based, and over 50 times a year for internet-based"],
      ["Centre", "Nearest Centre"],
    ],
    extraSections: [
      {
        id: "sections",
        label: "Sections",
        title: "TOEFL Sections",
        tables: [
          {
            headers: ["Section", "Questions / tasks", "Duration"],
            rows: [
              ["Reading", "3-4 passages with 10 questions each", "54-72 minutes"],
              ["Listening", "5-7 passages with 5-6 questions each", "41-57 minutes"],
              ["Writing", "2 tasks", "50 minutes"],
              ["Speaking (internet)", "4 tasks", "17 minutes"],
              ["Structure (paper)", "40 exercises", "25 minutes"],
            ],
          },
        ],
      },
    ],
  }),
  createStandardExamPage({
    slug: "ucat",
    name: "UCAT",
    menuNote: "Medicine admissions test",
    heroTag: "Medical admissions",
    heroTitle: "UCAT Exam 2025: Registration, Fees, Eligibility, Test Dates & Centres",
    heroSummary: "A structured UCAT guide with the same left-index navigation pattern as our university pages.",
    stats: [
      { label: "Mode", value: "Computer-based" },
      { label: "Duration", value: "2 hours" },
      { label: "Validity", value: "One year" },
      { label: "Purpose", value: "Medical and dental graduate programs in the UK" },
    ],
    about: [
      "UCAT stands for University Clinical Aptitude Test, a 2-hour computer-based test used by medical schools to assess an applicant’s eligibility for admission.",
      "Indian students applying to a UK consortium university or a non-UK associate member university may need to provide UCAT scores for medicine-focused applications.",
    ],
    sectionSummary: "The UCAT is split into five sections that assess reasoning, numerical ability, and judgement in clinical scenarios.",
    sectionRows: [
      ["Verbal Reasoning", "Ability to evaluate information and draw conclusions from passages"],
      ["Decision Making", "Ability to make judgements using logic, diagrams, and data"],
      ["Quantitative Reasoning", "Ability to evaluate numerical information"],
      ["Abstract Reasoning", "Ability to detect patterns and relationships"],
      ["Situational Judgement", "Ability to understand real-life situations and respond appropriately"],
    ],
    formatSummary: "The UCAT has 225 questions in total and takes two hours to complete.",
    formatRows: [
      ["Verbal Reasoning", "44 questions / 21 minutes"],
      ["Decision Making", "29 questions / 31 minutes"],
      ["Quantitative Reasoning", "36 questions / 25 minutes"],
      ["Abstract Reasoning", "50 questions / 12 minutes"],
      ["Situational Judgement", "66 questions / 26 minutes"],
    ],
    scoreSummary: "UCAT scoring is designed to compare applicants across medical and dental admissions pathways.",
    scoreRows: [
      ["Verbal Reasoning", "Scaled score within the UCAT band"],
      ["Decision Making", "Scaled score within the UCAT band"],
      ["Quantitative Reasoning", "Scaled score within the UCAT band"],
      ["Abstract Reasoning", "Scaled score within the UCAT band"],
      ["Situational Judgement", "Band-based judgement outcome"],
    ],
    registration: [
      "Register through the official UCAT booking process and choose your preferred test window and centre.",
      "Keep your identification details aligned with the registration record to avoid entry issues on test day.",
    ],
    fees: [
      "UCAT fees can vary by test location and applicant category, so confirm the current schedule before booking.",
      "Plan early because availability often becomes tight around medical application deadlines.",
    ],
    faqs: [
      { q: "Who takes the UCAT?", a: "Students applying to medicine and dentistry programmes in the UK and partner institutions." },
      { q: "How long is UCAT valid?", a: "UCAT scores are generally valid for one admissions cycle." },
      { q: "What is the format?", a: "A computer-based admissions test with five timed sections." },
    ],
  }),
  createStandardExamPage({
    slug: "bmat",
    name: "BMAT",
    menuNote: "Medical aptitude exam",
    heroTag: "Medical admissions",
    heroTitle: "BMAT Exam 2025: Registration, Fees, Eligibility, Test Dates & Centres",
    heroSummary: "A dedicated BMAT page laid out like a university guide, with anchor-based navigation.",
    stats: [
      { label: "Mode", value: "Computer-based / centre-based" },
      { label: "Duration", value: "Exam-dependent" },
      { label: "Validity", value: "Admission-cycle specific" },
      { label: "Purpose", value: "Medical school admissions" },
    ],
    about: [
      "BMAT is a medical admissions test used to assess problem-solving, scientific aptitude, and writing skills for medicine-focused applications.",
      "Candidates usually check BMAT alongside other medical entrance requirements to decide which universities to apply to.",
    ],
    sectionSummary: "BMAT sections typically cover aptitude, scientific reasoning, and writing.",
    sectionRows: [
      ["Section 1", "Problem solving and critical thinking"],
      ["Section 2", "Scientific knowledge and applications"],
      ["Section 3", "Writing task and argument construction"],
    ],
    formatSummary: "The BMAT format is section-based and timed separately.",
    formatRows: [
      ["Sections", "3"],
      ["Format", "Admission test"],
      ["Mode", "Computer-based"],
      ["Focus", "Medicine and dentistry admissions"],
    ],
    scoreSummary: "BMAT scoring is used by admissions teams to compare candidates across sections.",
    scoreRows: [
      ["Section 1", "Aptitude score"],
      ["Section 2", "Scientific score"],
      ["Section 3", "Writing assessment"],
    ],
    registration: [
      "Register for BMAT through the appropriate test booking channel used by the destination university or testing body.",
      "Check your application window carefully because the test is tied to admissions timelines.",
    ],
    fees: [
      "BMAT fees vary by centre and registration route.",
      "Confirm the current fee before scheduling your exam.",
    ],
    faqs: [
      { q: "What is BMAT for?", a: "It supports admissions into medicine-related programmes." },
      { q: "Is BMAT difficult?", a: "It is a competitive aptitude test that rewards practice and timing." },
      { q: "How should I prepare?", a: "Practice timed problem-solving, science reasoning, and structured writing." },
    ],
  }),
  createStandardExamPage({
    slug: "isat",
    name: "ISAT",
    menuNote: "Medical admissions test",
    heroTag: "Medical admissions",
    heroTitle: "ISAT Exam 2025: Registration, Fees, Eligibility, Test Dates & Centres",
    heroSummary: "A concise ISAT page with the same section-jump flow used throughout the site.",
    stats: [
      { label: "Mode", value: "Computer-based" },
      { label: "Duration", value: "Test-dependent" },
      { label: "Validity", value: "Admission cycle" },
      { label: "Purpose", value: "Medical and allied health admissions" },
    ],
    about: [
      "ISAT is an admissions test used for medicine and health-related courses in certain regions and university groups.",
      "It is typically used as part of a broader application review rather than as a standalone qualification.",
    ],
    sectionSummary: "ISAT evaluates reasoning, quantitative thinking, and scientific understanding.",
    sectionRows: [
      ["Scientific Reasoning", "Application of science in academic contexts"],
      ["Quantitative Reasoning", "Numerical problem solving"],
      ["Critical Thinking", "Argument analysis and logic"],
    ],
    formatSummary: "The exam is computer-based and timed.",
    formatRows: [
      ["Sections", "Multiple sections"],
      ["Mode", "Computer-based"],
      ["Use", "Admission to medicine-oriented programmes"],
      ["Outcome", "Part of selection shortlisting"],
    ],
    scoreSummary: "ISAT results are generally considered alongside academic records and other admission requirements.",
    scoreRows: [
      ["Section performance", "Used for admissions comparison"],
      ["Overall result", "University and programme dependent"],
    ],
    registration: [
      "Register using the official test booking route specified by the admissions body.",
      "Keep your passport or permitted ID ready when booking and on test day.",
    ],
    fees: [
      "ISAT fees depend on the test location and the testing year.",
      "Check the latest fee schedule before making plans.",
    ],
    faqs: [
      { q: "What is ISAT used for?", a: "It supports medical and health-science admissions." },
      { q: "How is it scored?", a: "Scoring is test-specific and used by universities to compare applicants." },
      { q: "What should I study?", a: "Focus on reasoning, maths, and science-based problem solving." },
    ],
  }),
  createStandardExamPage({
    slug: "ucat-anz",
    name: "UCAT ANZ",
    menuNote: "Australia and New Zealand medicine test",
    heroTag: "Medical admissions",
    heroTitle: "UCAT ANZ Exam 2025: Registration, Fees, Eligibility, Test Dates & Centres",
    heroSummary: "A matching UCAT ANZ page for students targeting medicine in Australia and New Zealand.",
    stats: [
      { label: "Mode", value: "Computer-based" },
      { label: "Duration", value: "2 hours" },
      { label: "Validity", value: "One admissions cycle" },
      { label: "Purpose", value: "Medical and dental admissions in ANZ" },
    ],
    about: [
      "UCAT ANZ is the Australian and New Zealand version of the UCAT used for medicine and dental admissions.",
      "Applicants use it alongside academic requirements to build a complete application profile.",
    ],
    sectionSummary: "UCAT ANZ uses the same broad reasoning and judgement themes as other UCAT formats.",
    sectionRows: [
      ["Verbal Reasoning", "Reading and inference"],
      ["Decision Making", "Logic and data-based judgement"],
      ["Quantitative Reasoning", "Numerical analysis"],
      ["Abstract Reasoning", "Pattern detection"],
      ["Situational Judgement", "Professional judgement"],
    ],
    formatSummary: "The exam remains fast-paced and computer-based.",
    formatRows: [
      ["Sections", "5"],
      ["Mode", "Computer-based"],
      ["Duration", "2 hours"],
      ["Audience", "ANZ medicine and dental applicants"],
    ],
    scoreSummary: "The score profile is used by admissions teams during shortlisting.",
    scoreRows: [
      ["Section scores", "Used in comparative assessment"],
      ["Situational judgement", "Banded or scaled outcome"],
    ],
    registration: [
      "Book through the UCAT ANZ registration pathway for your chosen admissions cycle.",
      "Check the official test centre schedule and availability before locking your university choices.",
    ],
    fees: [
      "UCAT ANZ fees vary by year and location.",
      "Always verify the current fee before booking.",
    ],
    faqs: [
      { q: "Is UCAT ANZ different from UCAT?", a: "It is the ANZ admissions version used for Australia and New Zealand." },
      { q: "Who should take it?", a: "Students applying to medicine or dentistry in the ANZ region." },
      { q: "Is it computer-based?", a: "Yes, UCAT ANZ is delivered on computer." },
    ],
  }),
  createStandardExamPage({
    slug: "lnat",
    name: "LNAT",
    menuNote: "Law admissions test",
    heroTag: "Law admissions",
    heroTitle: "LNAT Exam 2025: Registration, Fees, Eligibility, Test Dates & Centres",
    heroSummary: "A law-admissions page with the same index-led page structure used elsewhere on the site.",
    stats: [
      { label: "Mode", value: "Computer-based" },
      { label: "Duration", value: "About 2.5 hours" },
      { label: "Validity", value: "Admissions cycle" },
      { label: "Purpose", value: "Law school admissions" },
    ],
    about: [
      "LNAT is the Law National Aptitude Test used by selected universities to assess law applicants.",
      "It measures reasoning and essay-based judgement rather than subject-specific law knowledge.",
    ],
    sectionSummary: "LNAT typically assesses reading comprehension and essay-based reasoning.",
    sectionRows: [
      ["Multiple-choice section", "Reading and analytical reasoning"],
      ["Essay section", "Written argument and reasoning"],
    ],
    formatSummary: "LNAT is a timed admissions test taken on computer.",
    formatRows: [
      ["Sections", "2 main parts"],
      ["Mode", "Computer-based"],
      ["Focus", "Law admissions"],
      ["Output", "One part is scored objectively; one is reviewed by universities"],
    ],
    scoreSummary: "LNAT is used as one part of the admissions review, alongside grades and other documents.",
    scoreRows: [
      ["MCQ score", "Objective aptitude score"],
      ["Essay", "Reviewed by the university"],
    ],
    registration: [
      "Book LNAT through the official registration system used for your application cycle.",
      "Match your testing date to the law application deadline of your chosen universities.",
    ],
    fees: [
      "LNAT pricing can vary by country and testing year.",
      "Check the current official fee before you register.",
    ],
    faqs: [
      { q: "What does LNAT test?", a: "It tests law-admissions reasoning and writing ability." },
      { q: "Do all law schools require it?", a: "No. Only participating institutions ask for it." },
      { q: "How should I prepare?", a: "Practice reading quickly, argument analysis, and concise essay writing." },
    ],
  }),
  createStandardExamPage({
    slug: "lsat",
    name: "LSAT",
    menuNote: "Law school admissions test",
    heroTag: "Law admissions",
    heroTitle: "LSAT Exam 2025: Registration, Fees, Eligibility, Test Dates & Centres",
    heroSummary: "An LSAT page built with the same anchored reading experience as our university guides.",
    stats: [
      { label: "Mode", value: "Computer-based" },
      { label: "Duration", value: "Test-specific" },
      { label: "Validity", value: "Admissions cycle" },
      { label: "Purpose", value: "Law school admissions" },
    ],
    about: [
      "LSAT is a standardised law school admissions test used by universities to evaluate reading, reasoning, and analytical skills.",
      "It is commonly used in North America and by other institutions that use law-admissions testing.",
    ],
    sectionSummary: "The LSAT focuses on logical reasoning, reading comprehension, and analytical thinking.",
    sectionRows: [
      ["Reading Comprehension", "Understand dense legal and academic passages"],
      ["Logical Reasoning", "Evaluate arguments and conclusions"],
      ["Analytical Reasoning", "Work through structured logic problems"],
    ],
    formatSummary: "The LSAT is computer-based and built around timed reasoning tasks.",
    formatRows: [
      ["Sections", "Reasoning-based sections"],
      ["Mode", "Computer-based"],
      ["Use", "Law school admissions"],
      ["Outcome", "Comparative admissions score"],
    ],
    scoreSummary: "LSAT scores are used by law schools to compare applicants against the admissions pool.",
    scoreRows: [
      ["Scaled score", "Used for comparison across test takers"],
      ["Writing sample", "Additional admissions context where applicable"],
    ],
    registration: [
      "Register through the official LSAT booking flow for your region.",
      "Pick a test date that aligns with your law school deadlines.",
    ],
    fees: [
      "LSAT fees depend on region and test year.",
      "Confirm the current official fee before booking.",
    ],
    faqs: [
      { q: "What is LSAT used for?", a: "It is used for law school admissions." },
      { q: "Is LSAT hard?", a: "It is a reasoning-heavy exam that rewards sustained practice." },
      { q: "What should I focus on?", a: "Logic, reading comprehension, and speed under time pressure." },
    ],
  }),
  createSourceExamPage({
    slug: "gre",
    name: "GRE",
    menuNote: "Graduate admissions test",
    heroTag: "Graduate admissions",
    heroTitle: "GRE",
    heroSummary: "GRE details, test format, and section structure presented in the indexed exam-page style.",
    stats: [
      { label: "Test type", value: "Admission Test" },
      { label: "Mode", value: "Both computer-based and paper-based" },
      { label: "Duration", value: "3 hours 45 minutes (including breaks)" },
      { label: "Validity", value: "Five years" },
    ],
    overviewTitle: "About GRE",
    overviewParagraphs: [
      "GRE is a standardised admissions test administered by ETS for graduate-level study.",
      "Many graduate schools in the US, Canada, and other countries use it to evaluate analytical writing, quantitative reasoning, critical thinking, and verbal reasoning skills.",
      "Students may take the test online or in a paper-and-pencil format.",
    ],
    detailTitle: "GRE Test Details",
    detailRows: [
      ["Test type", "Admission Test"],
      ["Mode", "Both computer-based and paper-based"],
      ["Duration", "3 hours 45 minutes (including breaks)"],
      ["Validity", "Five years"],
      ["Purpose", "Admission to a graduate school in various disciplines"],
      ["Frequency", "Computer-based test: multiple times, Paper-based test: thrice a year"],
      ["Centre", "Nearest Centre"],
    ],
    extraSections: [
      {
        id: "sections",
        label: "Sections",
        title: "GRE Sections",
        tables: [
          {
            headers: ["Section", "Questions", "Duration"],
            rows: [
              ["Analytical Writing", "2 Questions", "60 Minutes"],
              ["Verbal Reasoning", "20 Questions", "60 Minutes"],
              ["Quantitative Reasoning", "20 Questions", "70 Minutes"],
            ],
          },
        ],
      },
    ],
  }),
  createSourceExamPage({
    slug: "gmat",
    name: "GMAT",
    menuNote: "Business school admissions test",
    heroTag: "Graduate admissions",
    heroTitle: "GMAT",
    heroSummary: "GMAT details, sections, and timing presented with the same indexed exam-page layout.",
    stats: [
      { label: "Test type", value: "Admission Test" },
      { label: "Mode", value: "Computer-Based" },
      { label: "Duration", value: "3 hours 7 minutes" },
      { label: "Validity", value: "Five years" },
    ],
    overviewTitle: "About GMAT Exam",
    overviewParagraphs: [
      "GMAT is an essential admissions test for business school applicants.",
      "It is a computer-based, computer-adaptive, multiple-choice exam used for graduate business programs across the world.",
      "Business schools review GMAT scores along with academic records and work experience.",
    ],
    detailTitle: "GMAT Test Details",
    detailRows: [
      ["Test type", "Admission Test"],
      ["Mode", "Computer-Based"],
      ["Duration", "3 hours 7 minutes"],
      ["Validity", "Five years"],
      ["Purpose", "Admission to a graduate-level management course"],
      ["Frequency", "Almost every day of the year (except weekends and holidays)"],
      ["Centre", "Nearest Centre"],
    ],
    extraSections: [
      {
        id: "sections",
        label: "Sections",
        title: "GMAT Sections",
        tables: [
          {
            headers: ["Section", "Questions", "Duration"],
            rows: [
              ["Analytical Writing Assessment", "1 questions", "30 Minutes"],
              ["Integrated Reasoning", "12 questions", "30 Minutes"],
              ["Quantitative Reasoning", "21 questions", "62 Minutes"],
              ["Verbal Reasoning", "36 questions", "65 Minutes"],
            ],
          },
        ],
      },
    ],
  }),
  createSourceExamPage({
    slug: "sat",
    name: "SAT",
    menuNote: "Undergraduate admissions test",
    heroTag: "Undergraduate admissions",
    heroTitle: "SAT",
    heroSummary: "SAT details and test sections presented in the same left-index pattern as the rest of the site.",
    stats: [
      { label: "Test type", value: "Admission Test" },
      { label: "Mode", value: "Pencil and Paper" },
      { label: "Duration", value: "3 hours" },
      { label: "Validity", value: "5 years" },
    ],
    overviewTitle: "About SAT Exam",
    overviewParagraphs: [
      "SAT is a standard test used for undergraduate admissions in US colleges.",
      "The College Board owns, develops, and publishes the exam, while ETS administers it on behalf of the College Board.",
      "The test name has changed over time, but it is now simply called SAT.",
    ],
    detailTitle: "SAT Test Details",
    detailRows: [
      ["Test type", "Admission Test"],
      ["Mode", "Pencil and Paper"],
      ["Duration", "3 hours"],
      ["Validity", "5 years"],
      ["Purpose", "Admission into an undergraduate course in a US college"],
      ["Frequency", "4 times per year"],
      ["Centre", "Nearest Centre"],
    ],
    extraSections: [
      {
        id: "sections",
        label: "Sections",
        title: "SAT Sections",
        tables: [
          {
            headers: ["Section", "Questions", "Duration"],
            rows: [
              ["Reading", "52 questions", "65 minutes"],
              ["Writing and Language", "44 questions", "35 minutes"],
              ["Math (No Calculator)", "20 questions", "25 minutes"],
              ["Math (With Calculator)", "38 questions", "55 minutes"],
            ],
          },
        ],
      },
    ],
  }),
  createSourceExamPage({
    slug: "act",
    name: "ACT",
    menuNote: "Undergraduate admissions test",
    heroTag: "Undergraduate admissions",
    heroTitle: "ACT",
    heroSummary: "ACT details and section breakdown presented using the site’s anchor-led exam layout.",
    stats: [
      { label: "Test type", value: "Admission Test" },
      { label: "Mode", value: "Pencil and Paper" },
      { label: "Duration", value: "2 hours 55 minutes (40 minutes extra if taking the test with writing)" },
      { label: "Validity", value: "5 years" },
    ],
    overviewTitle: "About ACT Exam",
    overviewParagraphs: [
      "The ACT is an admissions test many US and Canadian colleges use for undergraduate selection.",
      "It measures a high school student’s preparation for college and is often reviewed alongside GPA.",
    ],
    detailTitle: "ACT Test Details",
    detailRows: [
      ["Test type", "Admission Test"],
      ["Mode", "Pencil and Paper"],
      ["Duration", "2 hours 55 minutes (40 minutes extra if taking the test with writing)"],
      ["Validity", "5 years"],
      ["Purpose", "Admission into an undergraduate course in a US college"],
      ["Frequency", "5 times per year"],
      ["Centre", "Nearest Centre"],
    ],
    extraSections: [
      {
        id: "sections",
        label: "Sections",
        title: "ACT Sections",
        tables: [
          {
            headers: ["Section", "Questions", "Duration"],
            rows: [
              ["English", "75 questions", "45 minutes"],
              ["Math", "60 questions", "60 minutes"],
              ["Reading", "40 questions", "35 minutes"],
              ["Science", "40 questions", "35 minutes"],
              ["Writing (Optional)", "1 Essay", "40 minutes"],
            ],
          },
        ],
      },
    ],
  }),
  createSourceExamPage({
    slug: "psat",
    name: "PSAT",
    menuNote: "SAT practice and scholarship test",
    heroTag: "Undergraduate admissions",
    heroTitle: "PSAT",
    heroSummary: "PSAT details and test sections presented in the same anchor-based flow used throughout the app.",
    stats: [
      { label: "Test type", value: "Practice Version of SAT" },
      { label: "Mode", value: "Online" },
      { label: "Duration", value: "2 hours and 45 minutes" },
      { label: "Validity", value: "Not required" },
    ],
    overviewTitle: "About PSAT (Preliminary SAT)",
    overviewParagraphs: [
      "The PSAT is a standardised test administered by the College Board and sponsored by the National Merit Scholarship Corporation.",
      "It works like a mini-SAT so students can practise the SAT pattern and build familiarity with the difficulty level.",
    ],
    detailTitle: "PSAT Test Details",
    detailRows: [
      ["Test type", "Practice Version of SAT"],
      ["Mode", "Online"],
      ["Duration", "2 hours and 45 minutes"],
      ["Validity", "Not required"],
      ["Purpose", "SAT Preparation"],
      ["Frequency", "Varies between schools"],
      ["Centre", "Nearest Centre"],
    ],
    extraSections: [
      {
        id: "sections",
        label: "Sections",
        title: "PSAT Sections",
        tables: [
          {
            headers: ["Section", "Questions", "Duration"],
            rows: [
              ["Reading", "47 questions", "60 minutes"],
              ["Writing and Language", "44 questions", "35 minutes"],
              ["Math (No Calculator)", "17 questions", "25 minutes"],
              ["Math (With Calculator)", "31 questions", "45 minutes"],
            ],
          },
        ],
      },
    ],
  }),
  createStandardExamPage({
    slug: "imat",
    name: "IMAT",
    menuNote: "Medicine admissions test",
    heroTag: "Medical admissions",
    heroTitle: "IMAT Exam 2025: Registration, Fees, Eligibility, Test Dates & Centres",
    heroSummary: "An IMAT page built to match the site’s clean, anchor-led exam guide structure.",
    stats: [
      { label: "Mode", value: "Computer-based" },
      { label: "Duration", value: "Test-specific" },
      { label: "Validity", value: "Admission cycle" },
      { label: "Purpose", value: "Medicine admissions in Italy" },
    ],
    about: [
      "IMAT is the International Medical Admissions Test used for medicine and surgery programmes in Italy.",
      "It is generally used by international students applying to English-taught medical programmes.",
    ],
    sectionSummary: "IMAT covers logical reasoning, problem solving, and science-based questions.",
    sectionRows: [
      ["Logical Reasoning", "Argument analysis and inference"],
      ["Problem Solving", "Mathematical and analytical questions"],
      ["Science Knowledge", "Biology, chemistry, physics foundations"],
    ],
    formatSummary: "The exam is a timed medical-admissions test with multiple-choice questions.",
    formatRows: [
      ["Mode", "Computer-based"],
      ["Use", "Medicine admissions in Italy"],
      ["Sections", "Reasoning and science"],
      ["Outcome", "Used for ranking and shortlisting"],
    ],
    scoreSummary: "IMAT scores are used to rank candidates during medicine admissions.",
    scoreRows: [
      ["Section score", "Admissions ranking"],
      ["Overall score", "Used for selection"],
    ],
    registration: [
      "Register through the official IMAT process for the admissions cycle you are targeting.",
      "Track university-specific deadlines because medicine applications can close early.",
    ],
    fees: [
      "IMAT fees vary by region and testing year.",
      "Check the current official fee before booking.",
    ],
    faqs: [
      { q: "What is IMAT used for?", a: "It is used for medicine admissions in Italy." },
      { q: "Who takes it?", a: "International students applying to English-taught medical programmes." },
      { q: "What should I revise?", a: "Reasoning, maths, and basic sciences." },
    ],
  }),
  createStandardExamPage({
    slug: "gamsat",
    name: "GAMSAT",
    menuNote: "Graduate medical admissions test",
    heroTag: "Medical admissions",
    heroTitle: "GAMSAT Exam 2025: Registration, Fees, Eligibility, Test Dates & Centres",
    heroSummary: "A GAMSAT guide page with the same left-hand index flow as our university pages.",
    stats: [
      { label: "Mode", value: "Computer-based" },
      { label: "Duration", value: "Long-form admissions test" },
      { label: "Validity", value: "Admissions cycle" },
      { label: "Purpose", value: "Graduate-entry medicine and health sciences" },
    ],
    about: [
      "GAMSAT is used for graduate-entry medicine and related health programmes in select countries.",
      "It evaluates reasoning, science understanding, and writing performance.",
    ],
    sectionSummary: "GAMSAT typically spans reasoning, science, and written communication areas.",
    sectionRows: [
      ["Reasoning in Humanities and Social Sciences", "Critical reading and analysis"],
      ["Written Communication", "Construct two essays or written responses"],
      ["Reasoning in Biological and Physical Sciences", "Science problem solving"],
    ],
    formatSummary: "GAMSAT is a multi-hour admissions test with several distinct sections.",
    formatRows: [
      ["Mode", "Computer-based"],
      ["Use", "Graduate-entry medicine"],
      ["Sections", "3"],
      ["Outcome", "Admissions comparison score"],
    ],
    scoreSummary: "GAMSAT results are used by graduate medicine programmes to compare applicants.",
    scoreRows: [
      ["Section performance", "Admissions use"],
      ["Overall score", "Comparative ranking score"],
    ],
    registration: [
      "Register through the official GAMSAT booking route for your country.",
      "Allow time for preparation because the exam covers multiple disciplines.",
    ],
    fees: [
      "GAMSAT fees vary by region and test year.",
      "Check the latest official cost before registering.",
    ],
    faqs: [
      { q: "What is GAMSAT for?", a: "It is used for graduate-entry medicine and related programmes." },
      { q: "Is it science-heavy?", a: "Yes. It includes science reasoning and analysis." },
      { q: "How should I prepare?", a: "Combine science revision with reasoning and essay practice." },
    ],
  }),
  createSourceExamPage({
    slug: "hat",
    name: "HAT",
    menuNote: "Humanities admissions test",
    heroTag: "Humanities admissions",
    heroTitle: "HAT",
    heroSummary: "HAT details shown with the same indexed page structure used for the other exam guides.",
    stats: [
      { label: "Test type", value: "Admission Test" },
      { label: "Mode", value: "Paper-Based" },
      { label: "Duration", value: "1 hour" },
      { label: "Validity", value: "1 year" },
    ],
    overviewTitle: "About History Aptitude Test",
    overviewParagraphs: [
      "Oxford introduced HAT for applicants to history-related degree programmes.",
      "The university uses the test to assess a candidate’s potential and ability to study History.",
      "It is required for students applying to undergraduate History or joint honours courses at Oxford and its joint schools.",
    ],
    detailTitle: "HAT Test Details",
    detailRows: [
      ["Test type", "Admission Test"],
      ["Mode", "Paper-Based"],
      ["Duration", "1 hour"],
      ["Validity", "1 year"],
      ["Purpose", "Admission in History and joint honours courses at Oxford"],
      ["Frequency", "Once a year"],
      ["Centre", "Nearest Centre"],
    ],
  }),
  createSourceExamPage({
    slug: "elat",
    name: "ELAT",
    menuNote: "English admissions test",
    heroTag: "Humanities admissions",
    heroTitle: "ELAT",
    heroSummary: "ELAT details and writing section presented in the same left-side index flow used across the site.",
    stats: [
      { label: "Test type", value: "Subject-Specific Admission Test" },
      { label: "Mode", value: "Pen & Paper Based" },
      { label: "Duration", value: "90 minutes" },
      { label: "Validity", value: "1 year" },
    ],
    overviewTitle: "About ELAT Exam",
    overviewParagraphs: [
      "ELAT is the University of Oxford’s subject-specific admission test for English literature courses.",
      "The test also helps Cambridge assess applicants for English course admission.",
      "It focuses on language, syntax, structure, form, and imagery.",
    ],
    detailTitle: "ELAT Test Details",
    detailRows: [
      ["Test type", "Subject-Specific Admission Test"],
      ["Mode", "Pen & Paper Based"],
      ["Duration", "90 minutes"],
      ["Validity", "1 year"],
      ["Purpose", "Admission in English language undergraduate courses at Oxford"],
      ["Frequency", "Once a year"],
      ["Centre", "Nearest Centre"],
    ],
    extraSections: [
      {
        id: "writing",
        label: "Writing",
        title: "ELAT Writing",
        paragraphs: [
          "The ELAT has one section, the Writing section.",
          "Candidates have 90 minutes to write an essay based on their reading skills, with understanding, interpretation, and argument development as the key measures.",
        ],
      },
    ],
  }),
  createSourceExamPage({
    slug: "philosophy-test",
    name: "Philosophy Test",
    menuNote: "Philosophy admissions test",
    heroTag: "Humanities admissions",
    heroTitle: "Philosophy Test",
    heroSummary: "Philosophy Test details and structure shown with the same anchor-based reading flow as the other exam pages.",
    stats: [
      { label: "Test type", value: "Admission Test" },
      { label: "Mode", value: "Paper-Based" },
      { label: "Duration", value: "60 minutes" },
      { label: "Validity", value: "For Life" },
    ],
    overviewTitle: "About Philosophy Test Exam",
    overviewParagraphs: [
      "The Philosophy Test is an Oxford-specific admissions test for Philosophy and Theology applicants.",
      "It is designed to assess inference, argumentation, analysis, and clear writing.",
      "No prior subject study is required, although familiarity with philosophical argument structure can help.",
    ],
    detailTitle: "Philosophy Test Details",
    detailRows: [
      ["Test type", "Admission Test"],
      ["Mode", "Paper-Based"],
      ["Duration", "60 minutes"],
      ["Validity", "For Life"],
      ["Purpose", "Admission in Philosophy and Theology courses at Oxford"],
      ["Frequency", "Once a year"],
      ["Centre", "Nearest Centre"],
    ],
    extraSections: [
      {
        id: "structure",
        label: "Structure",
        title: "Philosophy Test Structure",
        paragraphs: [
          "The exam focuses on philosophical reasoning rather than subject knowledge.",
          "Candidates must read a comprehension and then answer structured questions or write an essay.",
          "The paper has two parts: Part A and Part B.",
        ],
      },
      {
        id: "part-a",
        label: "Part A",
        title: "Part A",
        paragraphs: [
          "Part A gives a short passage followed by questions.",
          "The first question asks for an explanation in your own words, and the second question is more analytical.",
          "This section checks how well a candidate can understand an argument and respond around the relevant theme.",
        ],
      },
      {
        id: "part-b",
        label: "Part B",
        title: "Part B",
        paragraphs: [
          "Part B has three questions, and the student must answer any one.",
          "The questions are often centred around logic, philosophy, politics, psychology, sociology, or theology.",
          "It evaluates counter-arguments, anticipation, and engagement while generating answers.",
        ],
      },
    ],
  }),
];

export const examPageMap = Object.fromEntries(examPages.map((page) => [page.slug, page] as const)) as Record<string, ExamPage>;

export const getExamPageHref = (slug: string) => `/exams/${slug}`;
