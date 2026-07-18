import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Clock3,
  FileText,
  Globe2,
  GraduationCap,
  Home,
  Landmark,
  MapPin,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";

import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { useInitialPageReady } from "@/hooks/useInitialPageReady";
import { useUniversityData } from "@/context/UniversityDataContext";

const pageShell = "mx-auto w-full max-w-[1180px] px-4 md:px-6";
const anchors = [
  { id: "overview", label: "Overview" },
  { id: "programs", label: "Programs" },
  { id: "admission", label: "Admission" },
  { id: "costs", label: "Education Cost" },
  { id: "scholarships", label: "Scholarships" },
  { id: "visa", label: "Student Visa" },
  { id: "opportunities", label: "Work Opportunities" },
  { id: "why", label: "Why This University" },
  { id: "faqs", label: "FAQs" },
];

export const UniversityPage = () => {
  const { slug = "", universitySlug = "" } = useParams<{ slug: string; universitySlug: string }>();
  const { countryPageMap, universityPageMap } = useUniversityData();
  const university = universityPageMap[`${slug}/${universitySlug}`];
  const country = useMemo(
    () => countryPageMap[slug] ?? (university ? { slug: university.countrySlug, name: university.countryName } : undefined),
    [slug, university],
  );
  const [activeAnchor, setActiveAnchor] = useState(anchors[0].id);
  const pageReadySources = useMemo(
    () => (university ? [university.visuals.heroBackground, university.visuals.heroFeature] : []),
    [university],
  );
  const isSapienza = country?.slug === "italy" && university?.name === "Sapienza University of Rome";
  const backHref = university?.isMbbs ? "/mbbs-study-abroad#universities" : `/study-in/${country?.slug}`;
  const backLabel = university?.isMbbs ? "Back to MBBS" : `Back to ${country?.name}`;

  useInitialPageReady(pageReadySources);

  useEffect(() => {
    if (!university || !country) return;

    document.title = `${university.name} | ${country.name} University Guide`;
    const description = `Explore ${university.name} in ${country.name}: overview, admission requirements, costs, scholarships, visa support, and career opportunities.`;
    let metaTag = document.querySelector('meta[name="description"]');
    if (!metaTag) {
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "description");
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute("content", description);
  }, [country, university]);

  useEffect(() => {
    if (!university) return;

    setActiveAnchor(anchors[0].id);
    const sections = anchors
      .map((anchor) => document.getElementById(anchor.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (!visibleEntries.length) return;
        const topMost = visibleEntries.reduce((best, entry) =>
          entry.boundingClientRect.top < best.boundingClientRect.top ? entry : best,
        );
        setActiveAnchor(topMost.target.id);
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0.1, 0.25, 0.5, 0.75] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [university]);

  if (!university || !country) {
    return <Navigate to="/" replace />;
  }

  const visaWindow = university.costs.find((item) => item.label.toLowerCase().includes("visa"))?.value ?? "4-10 weeks";
  const tuitionRange = university.costs.find((item) => item.label.toLowerCase().includes("tuition"))?.value ?? "Program dependent";
  const livingBudget = university.costs.find((item) => item.label.toLowerCase().includes("living"))?.value ?? "Depends on city and lifestyle";
  const scholarships = university.scholarships?.length ? university.scholarships : [`${university.name} merit awards`, "External and country scholarships"];
  const visuals = university.visuals;
  const eligibilityCards = [
    { icon: GraduationCap, title: "Academic profile", body: university.requirements[0] ?? "Relevant educational background." },
    { icon: FileText, title: "Documents", body: university.requirements[1] ?? "Transcripts, SOP, and recommendation set." },
    { icon: Globe2, title: "Language", body: university.requirements[2] ?? "Language proof where required." },
    { icon: Wallet, title: "Financial proof", body: university.requirements[3] ?? "Funds and financial documents for visa." },
  ];

  return (
    <main className="min-h-screen bg-[#fbfdff] text-foreground">
      <Navbar />

      <section className="relative isolate overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img src={visuals.heroBackground} alt="" className="h-full w-full object-cover" fetchPriority="high" decoding="async" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(5,17,28,0.84),rgba(12,34,52,0.74)_44%,rgba(18,53,78,0.34)_100%)]" />
        </div>

        <div className={`${pageShell} relative flex min-h-[calc(90svh-5rem)] items-center py-8 md:py-10 lg:py-12`}>
          <Link
            to={backHref}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {backLabel}
          </Link>

          <div className="mt-6 grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl text-white">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/85 backdrop-blur">
                <Landmark className="h-3.5 w-3.5" />
                {university.heroTag}
              </p>
              <h1 className="mt-5 max-w-2xl text-balance font-display text-4xl leading-[0.95] text-white md:text-6xl lg:text-[4.15rem]">
                {university.name}
              </h1>
              <p className="mt-5 max-w-2xl text-balance text-sm leading-7 text-white/88 md:text-base md:leading-8">
                {university.program} in {country.name}. Built with profile-driven shortlisting, scholarship planning, and application strategy.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#overview"
                  className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary shadow-pill transition-smooth hover:bg-white/90"
                >
                  Explore overview
                </a>
                <a
                  href="#admission"
                  className="inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-smooth hover:bg-white/15"
                >
                  See admission path
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <HeroStat label="Country" value={country.name} />
                <HeroStat label="Program track" value={university.tag} />
                <HeroStat label="Tuition" value={tuitionRange} />
                <HeroStat label="Living costs" value={livingBudget} />
                <HeroStat label="Visa window" value={visaWindow} />
                <HeroStat label="Next intake" value={university.timeline[1]?.value ?? "Varies by programme"} />
              </div>
            </div>

            <div className="space-y-4 lg:self-stretch">
              <div className="overflow-hidden rounded-[30px] border border-white/18 bg-white/8 p-3 shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur">
                <img src={visuals.heroFeature} alt={university.name} className="h-[250px] w-full rounded-[24px] object-cover sm:h-[300px] lg:h-[420px]" decoding="async" />
              </div>

              <div className="rounded-[24px] border border-white/14 bg-[#061520]/90 p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">University profile</p>
                  <p className="mt-1 text-sm text-white/85">{university.name}</p>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <MiniChip icon={MapPin} text={country.name} />
                  <MiniChip icon={GraduationCap} text={university.tag} />
                  <MiniChip icon={Wallet} text={tuitionRange} />
                  <MiniChip icon={BadgeCheck} text={university.menuNote} />
                </div>
              </div>

              {isSapienza ? (
                <div className="rounded-[24px] border border-white/14 bg-white/10 p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">Sapienza video</p>
                      <p className="mt-1 text-sm text-white/85">Official YouTube reference and channel link.</p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <a
                        href="https://www.youtube.com/channel/UCdfc70lUXk2zkf7mSEkkK2w"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-smooth hover:bg-white/15"
                      >
                        Sapienza channel
                      </a>
                      <a
                        href="https://www.youtube.com/@GoStudyOverseas_in"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-smooth hover:bg-white/15"
                      >
                        Go Study Overseas
                      </a>
                    </div>
                  </div>
                  <div className="mt-4 overflow-hidden rounded-[18px] border border-white/12 bg-black">
                    <iframe
                      src="https://www.youtube.com/embed/6SvMIk3TMEI?start=3&rel=0"
                      title="Sapienza University of Rome video"
                      className="aspect-video w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-20 z-30 border-b border-[#d8e8ef] bg-[#eef7fa]/95 backdrop-blur lg:hidden">
        <div className={`${pageShell} overflow-x-auto`}>
          <div className="mx-auto flex min-w-max items-center justify-center gap-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent md:gap-6">
            {anchors.map((anchor, index) => (
              <div key={anchor.id} className="flex items-center gap-5">
                <a
                  href={`#${anchor.id}`}
                  className={`whitespace-nowrap rounded-full px-2 py-1 transition-smooth ${
                    activeAnchor === anchor.id ? "bg-accent text-white shadow-soft" : "hover:text-primary"
                  }`}
                >
                  {anchor.label}
                </a>
                {index < anchors.length - 1 ? <span className="text-accent/28">|</span> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="py-10 md:py-14">
        <div className={`${pageShell} grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]`}>
          <aside className="hidden lg:block">
            <div className="sticky top-28 flex max-h-[calc(100svh-8rem)] flex-col rounded-[24px] border border-[#d9e7ee] bg-white p-5 shadow-soft">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">Index</p>
              <h2 className="mt-2 font-display text-2xl leading-tight text-primary">{university.name}</h2>
              <nav className="mt-5 flex-1 space-y-2 overflow-y-auto pr-1">
                {anchors.map((anchor, index) => (
                  <a
                    key={anchor.id}
                    href={`#${anchor.id}`}
                    className={`flex items-center justify-between rounded-[16px] border px-4 py-3 text-sm transition-smooth ${
                      activeAnchor === anchor.id
                        ? "border-accent bg-accent-soft text-primary shadow-soft"
                        : "border-[#e6eef2] bg-[#fbfdff] text-muted-foreground hover:border-accent/40 hover:text-primary"
                    }`}
                  >
                    <span className="inline-flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-accent shadow-sm">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 break-words font-medium">{anchor.label}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="min-w-0 space-y-8">
            <section id="overview" className="py-8 md:py-10">
              <SectionHeader
                eyebrow={`Study at ${university.name}`}
                title="Overview"
                intro={`A structured overview of ${university.name} with admission, cost, scholarship, and visa planning context.`}
              />
              <div className="mt-5 space-y-4">
                <div className="rounded-[26px] border border-[#d9e7ee] bg-[linear-gradient(135deg,#f8fbfd_0%,#eef6f9_52%,#ffffff_100%)] p-6 shadow-soft md:p-8">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">University snapshot</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <FactCard label="University" value={university.name} icon={Landmark} />
                    <FactCard label="Country" value={country.name} icon={MapPin} />
                    <FactCard label="Tuition" value={tuitionRange} icon={Wallet} />
                    <FactCard label="Living costs" value={livingBudget} icon={Home} />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {university.highlights.map((item) => (
                    <div key={item.title} className="rounded-[16px] border border-[#d9e7ee] bg-white p-4 shadow-soft">
                      <p className="font-semibold text-primary">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.body}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="rounded-[24px] border border-[#d9e7ee] bg-white p-5 shadow-soft">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">Quick facts</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      <FactCard label="University" value={university.name} icon={Landmark} />
                      <FactCard label="Country" value={country.name} icon={MapPin} />
                      <FactCard label="Program focus" value={university.program} icon={GraduationCap} />
                      <FactCard label="Preferred stream" value={university.tag} icon={Sparkles} />
                    </div>
                  </div>
                  <div className="rounded-[24px] border border-[#d9e7ee] bg-[#f8fbfd] p-5 shadow-soft">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">Consulting edge</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      The page is designed around admissions-first planning: shortlisting fit, document quality, scholarship positioning, and visa readiness.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="programs" className="border-y border-[#dce9ef] bg-[#f5fbf7] py-8 md:py-10">
              <SectionHeader eyebrow="Programs" title={`Programs at ${university.name}`} intro="Course focus with profile fit and pathway relevance." />
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <IconBoxCard icon={GraduationCap} title="Primary programme" body={university.program} compact />
                <IconBoxCard icon={BadgeCheck} title="Track category" body={university.tag} compact />
                <IconBoxCard icon={Globe2} title="Destination context" body={`${country.name} academic environment`} compact />
                <IconBoxCard icon={BriefcaseBusiness} title="Career orientation" body="Built for employability, outcomes, and practical skills." compact />
                <IconBoxCard icon={Sparkles} title="Best fit profile" body="Students with clear goals and focused documentation." compact />
                <IconBoxCard icon={FileText} title="Outcome planning" body="Application + visa + post-study roadmap in one flow." compact />
              </div>
            </section>

            <section id="admission" className="py-8 md:py-10">
              <SectionHeader eyebrow="Admission Requirements" title="Admission Requirements" intro="Eligibility, documents, and application flow similar to major university guidance pages." />
              <div className="mt-5 space-y-4">
                <div className="rounded-[24px] border border-[#d9e7ee] bg-white p-5 shadow-soft">
                  <ul className="space-y-3">
                    {university.requirements.map((requirement) => (
                      <li key={requirement} className="flex items-start gap-3 rounded-[16px] border border-[#d9e7ee] bg-[#fbfdff] px-4 py-3">
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[12px] border border-accent/15 bg-accent-soft text-accent">
                          <Check className="h-4 w-4" />
                        </span>
                        <span className="text-sm leading-6 text-muted-foreground">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {eligibilityCards.map((card) => (
                    <IconBoxCard key={card.title} icon={card.icon} title={card.title} body={card.body} compact />
                  ))}
                </div>
              </div>
            </section>

            <section id="costs" className="border-y border-[#dce9ef] bg-[#f5fbf7] py-8 md:py-10">
              <SectionHeader eyebrow="Student Budget Analysis" title="Education Cost" intro="Tuition, living budget, scholarship potential, and practical financial planning." />
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {university.costs.map((cost) => (
                  <FactCard key={cost.label} label={cost.label} value={cost.value} icon={Wallet} />
                ))}
              </div>
            </section>

            <section id="scholarships" className="py-8 md:py-10">
              <SectionHeader eyebrow="Scholarships" title="Scholarships" intro="Merit and external funding opportunities relevant to this destination." />
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {scholarships.map((scholarship) => (
                  <IconBoxCard key={scholarship} icon={ShieldCheck} title={scholarship} body="Eligibility, deadline, and documentation strategy." compact />
                ))}
              </div>
            </section>

            <section id="visa" className="border-y border-[#dce9ef] bg-[#f5fbf7] py-8 md:py-10">
              <SectionHeader eyebrow="Student Visa" title="Student Visa" intro="Visa timeline, document readiness, and interview preparation focus." />
              <div className="mt-5 space-y-4">
                <div className="rounded-[26px] border border-[#d9e7ee] bg-white p-5 shadow-soft">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">Visa planning</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    We treat the visa step as part of the overall application system, not a last-minute scramble after the admit lands.
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <FactCard label="Visa window" value={visaWindow} icon={Clock3} />
                    <FactCard label="Financial proof" value="Proof aligned to destination guidance" icon={Wallet} />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {[
                    { label: "Visa window", value: visaWindow, icon: Clock3 },
                    { label: "Financial proof", value: "Banking and cost documentation aligned to destination requirements.", icon: Wallet },
                    { label: "Offer alignment", value: "CAS/I20-equivalent documentation and offer letter checks.", icon: FileText },
                    { label: "Readiness", value: "Interview preparation and pre-departure planning support.", icon: BadgeCheck },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[16px] border border-[#d9e7ee] bg-white p-4 shadow-soft">
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 text-accent" />
                        <p className="text-sm font-semibold text-primary">{item.label}</p>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="opportunities" className="py-8 md:py-10">
              <SectionHeader eyebrow="Work Opportunities" title="Work Opportunities" intro="Internship and post-study outcomes around country-level opportunities." />
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <IconBoxCard icon={BriefcaseBusiness} title="Internships" body="Practical exposure and skill-building pathways." compact />
                <IconBoxCard icon={Clock3} title="Post-study timeline" body={visaWindow} compact />
                <IconBoxCard icon={Globe2} title="Global profile" body={`${university.name} adds international career value.`} compact />
                <IconBoxCard icon={Home} title="Student life balance" body="Academic + social + career support ecosystem." compact />
              </div>
            </section>

            <section id="why" className="border-y border-[#dce9ef] bg-[#f5fbf7] py-8 md:py-10">
              <SectionHeader eyebrow="Why This University" title={`Why ${university.name}?`} intro="A concise, high-conversion decision matrix." />
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ...university.highlights,
                  { title: "Admissions-first roadmap", body: "Personalized strategy around profile, documents, and deadlines." },
                  { title: "Scholarship-oriented planning", body: "Funding-aware shortlisting and targeted application support." },
                  { title: "End-to-end support model", body: "From shortlist to visa and pre-departure execution." },
                ].slice(0, 6).map((item) => (
                  <IconBoxCard key={item.title} icon={Sparkles} title={item.title} body={item.body} compact />
                ))}
              </div>
              <div className="mt-5 overflow-hidden rounded-[26px] border border-[#d9e7ee] bg-white shadow-soft">
                <img src={visuals.overview} alt={`${university.name} campus life`} className="h-[280px] w-full object-cover" decoding="async" />
              </div>
            </section>

            <section id="faqs" className="py-8 md:py-10">
              <SectionHeader eyebrow="FAQs" title="Got Questions? We Got Answers!" centered />
              <div className="mt-6 rounded-[22px] border border-[#d9e7ee] bg-white shadow-soft">
                {university.faqs.slice(0, 6).map((faq, index) => (
                  <details key={faq.q} open={index === 0} className="border-b border-[#d9e7ee] px-5 py-4 last:border-b-0">
                    <summary className="cursor-pointer list-none font-poppins text-base font-semibold text-primary">{faq.q}</summary>
                    <p className="mt-2 font-poppins text-sm leading-6 text-muted-foreground">{faq.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

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

const HeroStat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-[18px] border border-white/14 bg-white/10 p-3 backdrop-blur">
    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/68">{label}</p>
    <p className="mt-1.5 break-words text-sm font-semibold leading-5 text-white">{value}</p>
  </div>
);

const MiniChip = ({
  icon: Icon,
  text,
}: {
  icon: ComponentType<{ className?: string }>;
  text: string;
}) => (
  <div className="rounded-2xl border border-white/20 bg-white/10 p-2.5 text-white">
    <Icon className="h-3.5 w-3.5 text-white/80" />
    <p className="mt-1 text-xs font-medium leading-4">{text}</p>
  </div>
);

const FactCard = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
}) => (
  <article className="rounded-[18px] border border-[#d9e7ee] bg-white p-4 shadow-soft">
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-accent/15 bg-accent-soft">
        <Icon className="h-4.5 w-4.5 text-accent" />
      </div>
      <div className="min-w-0">
        <h3 className="break-words font-poppins text-sm font-semibold text-primary">{label}</h3>
        <p className="mt-1 break-words text-sm leading-5 text-muted-foreground">{value}</p>
      </div>
    </div>
  </article>
);

const IconBoxCard = ({
  icon: Icon,
  title,
  body,
  compact = false,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
  compact?: boolean;
}) => (
  <article className={`rounded-[20px] border border-[#d9e7ee] bg-white shadow-soft transition-smooth hover:-translate-y-0.5 hover:shadow-lg ${compact ? "p-4" : "p-5"}`}>
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-accent/15 bg-gradient-to-br from-accent-soft to-white">
        <Icon className="h-4 w-4 text-accent" />
      </div>
      <div className="min-w-0">
        <h3 className="break-words font-display text-sm font-semibold leading-snug text-primary">{title}</h3>
        {body ? <p className="mt-0.5 break-words text-sm font-medium leading-5 text-primary">{body}</p> : null}
      </div>
    </div>
  </article>
);
