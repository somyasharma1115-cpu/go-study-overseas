import { type ComponentType } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronRight, GraduationCap, Landmark, MapPin, ScrollText, Sparkles, Stethoscope, Wallet } from "lucide-react";

import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { useInitialPageReady } from "@/hooks/useInitialPageReady";
import { getUniversityPageHref } from "@/data/countries";
import { mbbsStudyAbroadCountries, mbbsStudyAbroadFaqs } from "@/data/mbbsStudyAbroad";

const pageShell = "mx-auto w-full max-w-[1180px] px-4 md:px-6";

const totalUniversities = mbbsStudyAbroadCountries.reduce((total, country) => total + country.universities.length, 0);
const mbbsCountrySlug = (countryName: string) => countryName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const mbbsReasons = [
  {
    title: "Country-wise clarity",
    body: "Explore each destination in a clear format so students and parents can shortlist with confidence.",
  },
  {
    title: "University-wise detail",
    body: "Review the universities available in each destination without jumping across multiple pages.",
  },
  {
    title: "Simple to compare",
    body: "Country highlights and university options are organised to make side-by-side comparison easier.",
  },
];

const mbbsOverview = [
  { label: "Countries", value: String(mbbsStudyAbroadCountries.length), icon: MapPin },
  { label: "Universities", value: String(totalUniversities), icon: GraduationCap },
  { label: "Course", value: "MBBS", icon: Stethoscope },
  { label: "Format", value: "Single page", icon: ScrollText },
];

export const MBBSStudyAbroad = () => {
  useInitialPageReady([], { minDurationMs: 700, timeoutMs: 1800 });

  return (
    <main className="min-h-screen bg-[#fbfdff] text-foreground">
      <Navbar />

      <section className="relative isolate overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(42,124,255,0.16),transparent_35%),linear-gradient(135deg,#08131f_0%,#0b2238_52%,#10315c_100%)]" />
        <div className={`${pageShell} relative flex min-h-[calc(100svh-5rem)] items-center py-10 md:py-14`}>
          <div className="grid w-full items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/85 backdrop-blur">
                <Stethoscope className="h-3.5 w-3.5" />
                MBBS Study Abroad
              </div>
              <h1 className="mt-5 max-w-2xl text-balance font-display text-4xl leading-[0.95] text-white md:text-6xl lg:text-[4.4rem]">
                Country / University
              </h1>
              <p className="mt-5 max-w-2xl text-balance text-sm leading-7 text-white/88 md:text-base md:leading-8">
                Explore MBBS destinations country by country, with shortlisted universities gathered in one place for easier planning.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#countries"
                  className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary shadow-pill transition-smooth hover:bg-white/90"
                >
                  Explore countries
                </a>
                <a
                  href="#universities"
                  className="inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-smooth hover:bg-white/15"
                >
                  See universities
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {mbbsOverview.map((stat) => (
                  <div key={stat.label} className="rounded-[18px] border border-white/14 bg-white/10 p-3 backdrop-blur">
                    <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/68">
                      <stat.icon className="h-3.5 w-3.5" />
                      {stat.label}
                    </p>
                    <p className="mt-1.5 break-words text-sm font-semibold leading-5 text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 lg:self-stretch">
              <div className="rounded-[30px] border border-white/18 bg-white/10 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">Quick view</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {mbbsReasons.map((item) => (
                    <div key={item.title} className="rounded-[18px] border border-white/12 bg-white/8 p-4 text-white">
                      <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
                        <Sparkles className="h-3.5 w-3.5" />
                        {item.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/88">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/14 bg-[#061520]/90 p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/12 bg-white/8">
                    <Landmark className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">Study abroad route</p>
                    <p className="mt-1 text-sm text-white/85">Country and university selection in a single destination page.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="countries" className="border-y border-[#dce9ef] bg-[#f5fbf7] py-10 md:py-14">
        <div className={pageShell}>
          <SectionHeader
            eyebrow="Countries"
            title="Country Shortlist"
            intro="Browse each destination in a clean card layout for faster shortlisting."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {mbbsStudyAbroadCountries.map((country, index) => (
              <Link
                key={country.name}
                to={`/study-in/${mbbsCountrySlug(country.name)}`}
                className="rounded-[24px] border border-[#d9e7ee] bg-white p-5 shadow-soft transition-smooth hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">Country</p>
                    <h3 className="mt-2 font-display text-2xl leading-tight text-primary">{country.name}</h3>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{country.note}</p>
                <div className="mt-4 inline-flex rounded-full bg-accent-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                  {country.universities.length} universities
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="universities" className="py-10 md:py-14">
        <div className={pageShell}>
          <SectionHeader
            eyebrow="Universities"
            title="University Shortlist"
            intro="See shortlisted universities grouped by destination in an easy-to-scan layout."
          />

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {mbbsStudyAbroadCountries.map((country) => (
              <article key={country.name} className="rounded-[24px] border border-[#d9e7ee] bg-white p-5 shadow-soft">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">Country</p>
                    <h3 className="mt-1 font-display text-2xl text-primary">{country.name}</h3>
                  </div>
                  <div className="rounded-full border border-[#d9e7ee] bg-[#fbfdff] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    MBBS
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {country.universities.map((university, index) => (
                    <Link
                      key={`${country.name}-${university}`}
                      to={getUniversityPageHref(mbbsCountrySlug(country.name), university)}
                      className="rounded-[18px] border border-[#d9e7ee] bg-[#fbfdff] p-4 transition-smooth hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-soft"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">University {index + 1}</p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-primary">{university}</p>
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#dce9ef] bg-[#f5fbf7] py-10 md:py-14">
        <div className={pageShell}>
          <SectionHeader
            eyebrow="Course"
            title="MBBS Route Notes"
            intro="A short content block to keep the page useful beyond the raw list."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <InfoCard icon={Check} title="Focused shortlist" body="Keep countries and university options together while you evaluate the best fit." />
            <InfoCard icon={Wallet} title="Budget planning" body="Use destination and university details to compare tuition and living costs more easily." />
            <InfoCard icon={ChevronRight} title="Easy next steps" body="Move from country selection to university shortlisting without losing context." />
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className={pageShell}>
          <SectionHeader eyebrow="FAQs" title="MBBS FAQ" centered />
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {mbbsStudyAbroadFaqs.map((faq) => (
              <article key={faq.q} className="rounded-[20px] border border-[#d9e7ee] bg-white p-5 shadow-soft">
                <p className="font-display text-xl text-primary">{faq.q}</p>
                <p className="mt-3 font-poppins text-sm leading-6 text-muted-foreground">{faq.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer alwaysVisible />
    </main>
  );
};

const SectionHeader = ({
  eyebrow,
  title,
  intro,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  centered?: boolean;
}) => (
  <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">{eyebrow}</p>
    <h2 className="mt-2 font-display text-[1.75rem] leading-[1.06] text-primary md:text-[2.25rem]">{title}</h2>
    {intro ? <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{intro}</p> : null}
  </div>
);

const InfoCard = ({
  icon: Icon,
  title,
  body,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) => (
  <article className="rounded-[20px] border border-[#d9e7ee] bg-white p-5 shadow-soft">
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-accent/15 bg-accent-soft">
        <Icon className="h-4.5 w-4.5 text-accent" />
      </div>
      <div className="min-w-0">
        <h3 className="break-words font-display text-sm font-semibold leading-snug text-primary">{title}</h3>
        <p className="mt-1 break-words text-sm leading-5 text-muted-foreground">{body}</p>
      </div>
    </div>
  </article>
);
