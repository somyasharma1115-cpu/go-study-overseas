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
import {
  scholarshipCountryOptions,
  scholarshipCurrencyOptions,
  scholarshipIntakeOptions,
  scholarshipLevelOptions,
  scholarshipResults,
  scholarshipStreamOptions,
  scholarshipTypeOptions,
} from "@/data/scholarshipFinder";
import { cn } from "@/lib/utils";

const RESULTS_PER_PAGE = 6;

const ScholarshipFinder = () => {
  useInitialPageReady([], { minDurationMs: 700, timeoutMs: 1800 });

  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("All");
  const [currency, setCurrency] = useState("All");
  const [scholarshipType, setScholarshipType] = useState("All");
  const [intake, setIntake] = useState("All");
  const [level, setLevel] = useState("All");
  const [stream, setStream] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    document.title = "Scholarship Finder | Go Study Overseas";

    const description =
      "Explore scholarships for studying abroad with filters for currency, type, intake year, and course stream, in a layout matched to the course finder.";
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

    return scholarshipResults.filter((result) => {
      const matchesSearch =
        !term ||
        [result.title, result.provider, result.country, result.type, result.level, result.stream, result.description, result.amount]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesCountry = country === "All" || result.country === country;
      const matchesCurrency = currency === "All" || result.currency === currency;
      const matchesType = scholarshipType === "All" || result.type === scholarshipType;
      const matchesIntake = intake === "All" || result.intake === intake;
      const matchesLevel = level === "All" || result.level === level;
      const matchesStream = stream === "All" || result.stream === stream;

      return matchesSearch && matchesCountry && matchesCurrency && matchesType && matchesIntake && matchesLevel && matchesStream;
    });
  }, [country, currency, intake, level, scholarshipType, search, stream]);

  useEffect(() => {
    setPage(1);
  }, [search, country, currency, scholarshipType, intake, level, stream]);

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / RESULTS_PER_PAGE));
  const visibleResults = filteredResults.slice((page - 1) * RESULTS_PER_PAGE, page * RESULTS_PER_PAGE);

  const resetFilters = () => {
    setSearch("");
    setCountry("All");
    setCurrency("All");
    setScholarshipType("All");
    setIntake("All");
    setLevel("All");
    setStream("All");
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
                    <span className="rounded-full bg-[#edf7fc] px-3 py-1.5 text-xs font-semibold text-[#1f6e93]">
                      {filteredResults.length} results
                    </span>
                  </div>

                  <label className="mt-4 block">
                    <span className="text-sm font-semibold text-[#10273c]">Search scholarship or provider</span>
                    <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[#d8e4ee] bg-white px-4 py-3">
                      <Search className="h-4 w-4 text-[#88a1b2]" />
                      <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by title, provider, country, or amount"
                        className="w-full bg-transparent text-sm text-[#10273c] outline-none placeholder:text-[#90a5b5]"
                      />
                    </div>
                  </label>

                  {[
                    { label: "Country", value: country, options: scholarshipCountryOptions, onChange: setCountry },
                    { label: "Currency", value: currency, options: scholarshipCurrencyOptions, onChange: setCurrency },
                    { label: "Scholarship type", value: scholarshipType, options: scholarshipTypeOptions, onChange: setScholarshipType },
                    { label: "Intake year", value: intake, options: scholarshipIntakeOptions, onChange: setIntake },
                    { label: "Course level", value: level, options: scholarshipLevelOptions, onChange: setLevel },
                    { label: "Course stream", value: stream, options: scholarshipStreamOptions, onChange: setStream },
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
                          <p className="line-clamp-2 text-[15px] font-semibold leading-5 text-[#171923]">{result.title}</p>
                          <span className="mt-1 inline-flex rounded-xl bg-[#edf7fc] px-2.5 py-1 text-xs font-medium text-[#1f6e93]">
                            {result.provider}
                          </span>
                        </div>
                        <button
                          type="button"
                          aria-label={`Save ${result.title}`}
                          className="rounded-full border border-[#dde8ef] p-1.5 text-[#93a6b4] transition-smooth hover:border-[#12304a]/20 hover:text-[#12304a]"
                        >
                          <Bookmark className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#425f77]">
                        <MapPin className="h-3.5 w-3.5 text-[#2596be]" />
                        <span>{result.country}</span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <div className="rounded-full border border-[#d7dee5] px-2.5 py-1.5 text-[11px] font-semibold text-[#171923]">
                          {result.amount}
                        </div>
                        <div className="rounded-full border border-[#d7dee5] px-2.5 py-1.5 text-[11px] font-semibold text-[#171923]">
                          {result.type}
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <div className="rounded-full border border-[#d7dee5] px-2.5 py-1.5 text-[11px] font-semibold text-[#171923]">
                          Intake {result.intake}
                        </div>
                        <div className="rounded-full border border-[#d7dee5] px-2.5 py-1.5 text-[11px] font-semibold text-[#171923]">
                          {result.level}
                        </div>
                      </div>

                      <p className="mt-3 line-clamp-3 text-xs leading-5 text-[#58758b]">{result.description}</p>

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
                            <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">Intake</span>
                          </div>
                          <p className="mt-1.5 text-xs font-semibold text-[#10273c]">{result.intake}</p>
                        </div>
                        <div className="rounded-2xl bg-[#f8fbfd] p-2.5">
                          <div className="flex items-center gap-2 text-[#2596be]">
                            <CircleDollarSign className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">Currency</span>
                          </div>
                          <p className="mt-1.5 text-xs font-semibold text-[#10273c]">{result.currency}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <Link
                          to={result.applyHref}
                          className="inline-flex flex-1 items-center justify-center rounded-[12px] bg-[#12304a] px-3 py-2.5 text-xs font-semibold text-white transition-smooth hover:bg-[#173a57]"
                        >
                          Apply with help
                        </Link>
                        <Link
                          to="/course-finder"
                          className="inline-flex flex-1 items-center justify-center rounded-[12px] border border-[#2596be] px-3 py-2.5 text-xs font-semibold text-[#2596be] transition-smooth hover:bg-[#2596be] hover:text-white"
                        >
                          Compare courses
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {filteredResults.length === 0 ? (
                  <div className="mt-4 rounded-[28px] border border-white/70 bg-white/90 px-6 py-10 text-center shadow-card">
                    <Sparkles className="mx-auto h-8 w-8 text-[#2596be]" />
                    <p className="mt-4 font-display text-[2rem] text-[#10273c]">No scholarships match yet.</p>
                    <p className="mt-2 text-sm leading-6 text-[#58758b]">
                      Try relaxing the filters or use our team support to narrow the scholarship list to your profile.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="rounded-2xl border border-[#d8e4ee] bg-[#fbfdff] px-5 py-3 text-sm font-semibold text-[#12304a]"
                      >
                        Clear filters
                      </button>
                      <a href="/find-your-path" className="rounded-2xl bg-[#2596be] px-5 py-3 text-sm font-semibold text-white">
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
          </div>
        </section>
      </main>

      <Footer alwaysVisible />
    </>
  );
};

export default ScholarshipFinder;
