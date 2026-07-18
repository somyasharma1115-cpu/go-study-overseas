import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Bookmark,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Filter,
  GraduationCap,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";

import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { useInitialPageReady } from "@/hooks/useInitialPageReady";
import { courseFinderCountryOptions, courseFinderResults } from "@/data/courseFinder";
import { getUniversityPageHref } from "@/data/countries";
import { cn } from "@/lib/utils";

type SavedSelections = {
  countries?: string[];
  intakes?: string[];
  levels?: string[];
  streams?: string[];
  tests?: string[];
  budget?: string;
  phone?: string;
  email?: string;
  submittedAt?: string;
};

const storageKey = "findYourPathSelections";
const RESULTS_PER_PAGE = 6;

const countryOptions = ["All", ...courseFinderCountryOptions];
const levelOptions = ["All", "Bachelor's", "Master's", "MBA", "PhD", "PG Diploma"];
const streamOptions = ["All", "Data & AI", "Engineering", "Management", "Design", "Law", "Arts & Humanities", "Healthcare"];
const intakeOptions = ["All", "Fall 2026", "Spring 2027", "Summer 2027", "Rolling / Flexible"];
const examOptions = ["All", "IELTS", "PTE", "TOEFL", "Duolingo", "GMAT", "GRE"];
const budgetOptions = ["All", "Self-funded", "Sponsored", "Partial loan", "Full loan"];

const courseResults = courseFinderResults;

const quickLinks = [
  { label: "Study in Italy", href: "/study-in/italy" },
  { label: "Study in UK", href: "/study-in/uk" },
  { label: "Study in Germany", href: "/study-in/germany" },
  { label: "Study in France", href: "/study-in/france" },
  { label: "Find Your Path", href: "/find-your-path" },
];

const readSavedSelections = (): SavedSelections => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.sessionStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as SavedSelections) : {};
  } catch {
    return {};
  }
};

const CourseFinder = () => {
  useInitialPageReady([], { minDurationMs: 700, timeoutMs: 1800 });

  const savedSelections = useMemo(readSavedSelections, []);
  const preferredCountry = savedSelections.countries?.[0] ?? "All";
  const preferredLevel = savedSelections.levels?.[0] ?? "All";
  const preferredStream = savedSelections.streams?.[0] ?? "All";
  const preferredExam = savedSelections.tests?.[0] ?? "All";

  const [search, setSearch] = useState("");
  const [country, setCountry] = useState(countryOptions.includes(preferredCountry) ? preferredCountry : "All");
  const [level, setLevel] = useState(levelOptions.includes(preferredLevel) ? preferredLevel : "All");
  const [stream, setStream] = useState(streamOptions.includes(preferredStream) ? preferredStream : "All");
  const [intake, setIntake] = useState(intakeOptions.includes(savedSelections.intakes?.[0] ?? "All") ? (savedSelections.intakes?.[0] ?? "All") : "All");
  const [exam, setExam] = useState(examOptions.includes(preferredExam) ? preferredExam : "All");
  const [budget, setBudget] = useState(budgetOptions.includes(savedSelections.budget ?? "All") ? (savedSelections.budget ?? "All") : "All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    document.title = "Course Finder | Go Study Overseas";

    const description =
      "Explore study abroad courses with filters for country, level, intake, exams, and budget, in a layout designed around smarter shortlisting.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, []);

  const filteredResults = useMemo(() => {
    const term = search.trim().toLowerCase();

    return courseResults.filter((result) => {
      const matchesSearch =
        !term ||
        [result.course, result.university, result.country, result.city, result.stream, result.highlight, result.exams.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesCountry = country === "All" || result.country === country;
      const matchesLevel = level === "All" || result.level === level;
      const matchesStream = stream === "All" || result.stream === stream;
      const matchesIntake = intake === "All" || result.intake === intake;
      const matchesExam = exam === "All" || result.exams.includes(exam);
      const matchesBudget = budget === "All" || result.budget === budget;

      return matchesSearch && matchesCountry && matchesLevel && matchesStream && matchesIntake && matchesExam && matchesBudget;
    });
  }, [budget, country, exam, intake, level, search, stream]);

  useEffect(() => {
    setPage(1);
  }, [search, country, level, stream, intake, exam, budget]);

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / RESULTS_PER_PAGE));
  const visibleResults = filteredResults.slice((page - 1) * RESULTS_PER_PAGE, page * RESULTS_PER_PAGE);

  const resetFilters = () => {
    setSearch("");
    setCountry("All");
    setLevel("All");
    setStream("All");
    setIntake("All");
    setExam("All");
    setBudget("All");
  };

  return (
    <>
      <main className="min-h-screen bg-[#f4f8fc] text-foreground">
        <Navbar forceSolidBackground />

        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,150,190,0.14),transparent_30%),radial-gradient(circle_at_top_right,rgba(18,48,74,0.14),transparent_32%),linear-gradient(180deg,#f8fbff_0%,#eef4fb_36%,#f4f8fc_100%)]" />

          <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-12 pt-24 md:px-6 md:pt-28">
            <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
              <aside className="xl:sticky xl:top-24 xl:self-start">
                <section className="rounded-[28px] border border-white/70 bg-white/88 p-5 shadow-elegant backdrop-blur">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-[#2596be]" />
                      <h2 className="font-display text-[1.8rem] text-[#10273c]">Filters</h2>
                    </div>
                    <span className="rounded-full bg-[#edf7fc] px-3 py-1.5 text-xs font-semibold text-[#12304a]">
                      {filteredResults.length} results
                    </span>
                  </div>

                  <label className="mt-4 block">
                    <span className="text-sm font-semibold text-[#10273c]">Search course or university</span>
                    <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[#d8e4ee] bg-white px-4 py-3">
                      <Search className="h-4 w-4 text-[#88a1b2]" />
                      <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by course, city, or university"
                        className="w-full bg-transparent text-sm text-[#10273c] outline-none placeholder:text-[#90a5b5]"
                      />
                    </div>
                  </label>

                  {[
                    { label: "Country", value: country, options: countryOptions, onChange: setCountry },
                    { label: "Course level", value: level, options: levelOptions, onChange: setLevel },
                    { label: "Stream", value: stream, options: streamOptions, onChange: setStream },
                    { label: "Intake", value: intake, options: intakeOptions, onChange: setIntake },
                    { label: "Exam", value: exam, options: examOptions, onChange: setExam },
                    { label: "Budget style", value: budget, options: budgetOptions, onChange: setBudget },
                  ].map((group) => (
                    <div key={group.label} className="mt-5">
                      <p className="text-sm font-semibold text-[#10273c]">{group.label}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {group.options.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => group.onChange(option)}
                            className={cn(
                              "rounded-full border px-3 py-2 text-sm font-semibold transition-smooth",
                              group.value === option
                                ? "border-[#12304a] bg-[#12304a] text-white shadow-[0_12px_26px_rgba(18,48,74,0.18)]"
                                : "border-[#d8e4ee] bg-[#fbfdff] text-[#12304a] hover:border-[#12304a]/20",
                            )}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="inline-flex flex-1 items-center justify-center rounded-2xl border border-[#d8e4ee] bg-[#fbfdff] px-4 py-3 text-sm font-semibold text-[#12304a] transition-smooth hover:border-[#12304a]/20"
                    >
                      Reset
                    </button>
                    <a
                      href="/find-your-path"
                      className="inline-flex flex-1 items-center justify-center rounded-2xl bg-[#2596be] px-4 py-3 text-sm font-semibold text-white transition-smooth hover:bg-[#1d86ab]"
                    >
                      Get Help
                    </a>
                  </div>
                </section>
              </aside>

              <section>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {visibleResults.map((result) => (
                    <article
                      key={result.id}
                      className="group rounded-[22px] border border-white/70 bg-white p-3.5 shadow-card transition-smooth hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(18,48,74,0.12)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-[15px] font-semibold leading-5 text-[#171923]">{result.university}</p>
                          <span className="mt-1 inline-flex rounded-xl bg-[#eef8ea] px-2.5 py-1 text-xs font-medium text-[#538b19]">
                            {result.course}
                          </span>
                        </div>
                        <button
                          type="button"
                          aria-label={`Save ${result.course}`}
                          className="rounded-full border border-[#dde8ef] p-1.5 text-[#93a6b4] transition-smooth hover:border-[#12304a]/20 hover:text-[#12304a]"
                        >
                          <Bookmark className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#425f77]">
                        <MapPin className="h-3.5 w-3.5 text-[#2596be]" />
                        <span>
                          {result.city}, {result.country}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <div className="rounded-full border border-[#d7dee5] px-2.5 py-1.5 text-[11px] font-semibold text-[#171923]">
                          {result.tuition}
                        </div>
                        <div className="rounded-full border border-[#d7dee5] px-2.5 py-1.5 text-[11px] font-semibold text-[#171923]">
                          Focus: {result.ranking}
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <div className="rounded-full border border-[#d7dee5] px-2.5 py-1.5 text-[11px] font-semibold text-[#171923]">
                          {result.exams[0]}
                          {result.exams.length > 1 ? ` +${result.exams.length - 1} more` : ""}
                        </div>
                        <div className="rounded-full border border-[#d7dee5] px-2.5 py-1.5 text-[11px] font-semibold text-[#171923]">
                          {result.intake} intake
                        </div>
                      </div>

                      <p className="mt-3 line-clamp-3 text-xs leading-5 text-[#58758b]">{result.highlight}</p>

                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <div className="rounded-2xl bg-[#f8fbfd] p-2.5">
                          <div className="flex items-center gap-2 text-[#2596be]">
                            <GraduationCap className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">Level</span>
                          </div>
                          <p className="mt-1.5 text-xs font-semibold text-[#10273c]">{result.level}</p>
                        </div>
                        <div className="rounded-2xl bg-[#f8fbfd] p-2.5">
                          <div className="flex items-center gap-2 text-[#2596be]">
                            <BookOpen className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">Stream</span>
                          </div>
                          <p className="mt-1.5 text-xs font-semibold text-[#10273c]">{result.stream}</p>
                        </div>
                        <div className="rounded-2xl bg-[#f8fbfd] p-2.5">
                          <div className="flex items-center gap-2 text-[#2596be]">
                            <CalendarDays className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">Duration</span>
                          </div>
                          <p className="mt-1.5 text-xs font-semibold text-[#10273c]">{result.duration}</p>
                        </div>
                        <div className="rounded-2xl bg-[#f8fbfd] p-2.5">
                          <div className="flex items-center gap-2 text-[#2596be]">
                            <CircleDollarSign className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">Budget fit</span>
                          </div>
                          <p className="mt-1.5 text-xs font-semibold text-[#10273c]">{result.budget}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {result.badges.map((badge) => (
                          <span key={badge} className="rounded-full bg-[#f3f7fb] px-2.5 py-1 text-[11px] font-semibold text-[#12304a]">
                            {badge}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <a
                          href={getUniversityPageHref(result.countrySlug, result.university)}
                          className="inline-flex flex-1 items-center justify-center rounded-[12px] bg-[#12304a] px-3 py-2.5 text-xs font-semibold text-white transition-smooth hover:bg-[#173a57]"
                        >
                          View university
                        </a>
                        <a
                          href="/find-your-path"
                          className="inline-flex flex-1 items-center justify-center rounded-[12px] border border-[#2596be] px-3 py-2.5 text-xs font-semibold text-[#2596be] transition-smooth hover:bg-[#2596be] hover:text-white"
                        >
                          Apply Now
                        </a>
                      </div>
                    </article>
                  ))}
                </div>

                {filteredResults.length === 0 ? (
                  <div className="mt-4 rounded-[28px] border border-white/70 bg-white/90 px-6 py-10 text-center shadow-card">
                    <Sparkles className="mx-auto h-8 w-8 text-[#2596be]" />
                    <p className="mt-4 font-display text-[2rem] text-[#10273c]">No course matches yet.</p>
                    <p className="mt-2 text-sm leading-6 text-[#58758b]">
                      Try broadening the filters or let us help you build a shortlist from your profile.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="rounded-2xl border border-[#d8e4ee] bg-[#fbfdff] px-5 py-3 text-sm font-semibold text-[#12304a]"
                      >
                        Clear filters
                      </button>
                      <a
                        href="/find-your-path"
                        className="rounded-2xl bg-[#2596be] px-5 py-3 text-sm font-semibold text-white"
                      >
                        Get expert help
                      </a>
                    </div>
                  </div>
                ) : null}

                {filteredResults.length > RESULTS_PER_PAGE ? (
                  <div className="mt-4 rounded-[24px] border border-white/70 bg-white/88 p-3 shadow-card">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPage((current) => Math.max(1, current - 1))}
                        disabled={page === 1}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef5fb] text-[#12304a] disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                        <button
                          key={pageNumber}
                          type="button"
                          onClick={() => setPage(pageNumber)}
                          className={cn(
                            "inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition-smooth",
                            page === pageNumber ? "bg-[#12304a] text-white" : "bg-[#eef5fb] text-[#12304a] hover:bg-[#dcecf7]",
                          )}
                        >
                          {pageNumber}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                        disabled={page === totalPages}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef5fb] text-[#12304a] disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : null}
              </section>
            </div>

            <section className="mt-6 rounded-[34px] border border-white/70 bg-white/90 p-6 shadow-elegant md:p-8">
              <div className="mb-6 flex flex-wrap gap-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="rounded-full bg-[#e8edf2] px-4 py-2 text-sm font-semibold text-[#12304a] transition-smooth hover:bg-[#d9e8f2]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>

      <Footer alwaysVisible />
    </>
  );
};

export default CourseFinder;
