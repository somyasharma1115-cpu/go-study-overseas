import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarRange,
  FilePenLine,
  Check,
  Clock3,
  FileText,
  Globe2,
  GraduationCap,
  Landmark,
  MapPin,
  Home,
  ShieldCheck,
  Scale,
  Sparkles,
  UtensilsCrossed,
  CarFront,
  Wifi,
  Users,
  Wallet,
} from "lucide-react";

import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { useInitialPageReady } from "@/hooks/useInitialPageReady";
import { getRuntimeUniversityHref, useUniversityData } from "@/context/UniversityDataContext";

const pageShell = "mx-auto w-full max-w-[1180px] px-4 md:px-6";

const anchorLinks = [
  { id: "overview", label: "Overview" },
  { id: "whyStudy", label: "Why Study" },
  { id: "universities", label: "Top Universities" },
  { id: "admission", label: "Admission" },
  { id: "EducationCost", label: "Education Cost" },
  { id: "scholarship", label: "Scholarships" },
  { id: "Visa", label: "Student Visa" },
  { id: "Opportunities", label: "Work Opportunities" },
  { id: "faqs", label: "FAQs" },
];

const jobs = [
  "AI Developer",
  "Digital Marketer",
  "Robotics Engineer",
  "Full Stack Engineer",
  "Backend Developer",
  "Data Scientist",
  "DevOps Engineer",
  "Data Engineer",
  "Security Engineer",
  "Communications Specialist",
  "Partnership Manager",
  "Clinical Manager",
];

export const CountryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { countryPageMap } = useUniversityData();
  const page = useMemo(() => (slug ? countryPageMap[slug] : undefined), [countryPageMap, slug]);
  const universitiesRef = useRef<HTMLDivElement | null>(null);
  const [activeAnchor, setActiveAnchor] = useState(anchorLinks[0].id);
  const pageReadySources = useMemo(
    () => (page ? [page.heroImage, page.visuals.gallery[0] ?? page.heroImage] : []),
    [page],
  );

  useInitialPageReady(pageReadySources);

  useEffect(() => {
    if (!page) return;

    document.title = `Study in ${page.name} | Go Study Overseas`;
    const desc = `${page.heroSummary} Explore top universities, admissions, student budget analysis, scholarships, visa support, work opportunities, and FAQs for studying in ${page.name}.`;
    let metaTag = document.querySelector('meta[name="description"]');
    if (!metaTag) {
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "description");
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute("content", desc);
  }, [page]);

  useEffect(() => {
    if (!page) return;

    setActiveAnchor(anchorLinks[0].id);

    const sections = anchorLinks
      .map((link) => document.getElementById(link.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length === 0) return;

        const topMost = visibleEntries.reduce((best, entry) =>
          entry.boundingClientRect.top < best.boundingClientRect.top ? entry : best,
        );
        setActiveAnchor(topMost.target.id);
      },
      {
        root: null,
        rootMargin: "-18% 0px -62% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [page]);

  if (!slug || !page) {
    return <Navigate to="/" replace />;
  }

  const isItaly = page.slug === "italy";
  const visaWindow = page.costs.find((item) => item.label.toLowerCase().includes("visa"))?.value ?? "Varies by case";
  const tuitionRange = page.costs.find((item) => item.label.toLowerCase().includes("tuition"))?.value ?? "Varies by university";
  const livingBudget = page.costs.find((item) => item.label.toLowerCase().includes("living"))?.value ?? "Depends on city and lifestyle";

  const quickFacts = [
    { label: "Tuition", value: tuitionRange, icon: Wallet },
    { label: "Living budget", value: livingBudget, icon: Home },
    { label: "Popular courses", value: page.heroStats[2]?.value ?? "High-demand tracks", icon: GraduationCap },
    {
      label: "Scholarships",
      value: page.costs.find((item) => item.label.toLowerCase().includes("scholar"))?.value ?? "Merit and institutional options",
      icon: Sparkles,
    },
    { label: "Universities", value: `${page.universities.length}+ shortlisted`, icon: FileText },
    { label: "Entry requirements", value: "Profile and documentation based", icon: FilePenLine },
    { label: "Application season", value: page.timeline[0]?.value ?? "Check by university", icon: CalendarRange },
    { label: "Destination", value: `Study in ${page.name}`, icon: MapPin },
    { label: "Intakes", value: page.timeline[1]?.value ?? page.timeline[0]?.value ?? "Varies by university", icon: CalendarRange },
    { label: "Visa window", value: visaWindow, icon: Clock3 },
  ];

  const reasons = buildReasons(page.name, page.highlights, page.heroStats[2]?.value ?? "");
  const visuals = page.visuals;
  const whyStudyTitle = isItaly ? "10 Reasons Why Italy Is Popular for Higher Studies" : "9 Reasons Why " + page.name + " Is Popular for Higher Studies";
  const overviewCards = [
    { icon: Landmark, title: `${page.name} destination`, body: "A globally known education destination with varied university options." },
    { icon: Globe2, title: page.heroTag, body: "Built for international students with practical application pathways." },
    { icon: GraduationCap, title: `${page.universities.length}+ universities`, body: "A broad university network with strong academic pathways." },
    { icon: Wallet, title: tuitionRange, body: "Budget planning starts with realistic tuition and living-cost expectations." },
  ];
  const admissionSteps = ["Check eligibility", "Prepare documents", "Submit the application", "Track the offer and visa"];
  const budgetTiles = [
    { icon: Wallet, title: "Tuition", body: page.costs[0]?.value ?? "Varies by institution and programme." },
    { icon: Home, title: "Accommodation", body: "Shared rooms, student housing, or private rentals." },
    { icon: UtensilsCrossed, title: "Food", body: "Groceries, campus meals, and everyday dining." },
    { icon: CarFront, title: "Transport pass", body: "Metro, bus, or rail passes for student travel." },
    { icon: ShieldCheck, title: "Insurance", body: "Health cover and mandatory admin costs." },
    { icon: Wifi, title: "Utilities", body: "Internet, phone, electricity, and basic bills." },
    { icon: Sparkles, title: "Recreation", body: "Social life, weekend plans, and extras." },
    { icon: Clock3, title: "Visa window", body: page.costs.find((item) => item.label === "Visa window")?.value ?? "Plan early and keep documents ready." },
  ];
  const scrollUniversities = (direction: "prev" | "next") => {
    const container = universitiesRef.current;
    if (!container) return;

    container.scrollBy({
      left: direction === "next" ? Math.round(container.clientWidth * 0.82) : -Math.round(container.clientWidth * 0.82),
      behavior: "smooth",
    });
  };

  return (
    <main className="min-h-screen bg-[#fbfdff] text-foreground">
      <Navbar />

      <section className="relative isolate overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img src={page.heroImage} alt="" className="h-full w-full object-cover" fetchPriority="high" decoding="async" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(5,17,28,0.84),rgba(12,34,52,0.74)_44%,rgba(18,53,78,0.34)_100%)]" />
        </div>

        <div className={`${pageShell} relative flex min-h-[calc(100svh-5rem)] items-center py-8 md:py-10 lg:py-12`}>
          <div className="grid w-full items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/85 backdrop-blur">
                <MapPin className="h-3.5 w-3.5" />
                {page.heroTag}
              </div>
              <h1 className="mt-5 max-w-2xl text-balance font-display text-4xl leading-[0.95] text-white md:text-6xl lg:text-[4.3rem]">
                Study in {page.name}
              </h1>
              <p className="mt-5 max-w-2xl text-balance text-sm leading-7 text-white/88 md:text-base md:leading-8">
                {page.heroSummary}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#overview"
                  className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary shadow-pill transition-smooth hover:bg-white/90"
                >
                  Explore overview
                </a>
                <a
                  href="#universities"
                  className="inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-smooth hover:bg-white/15"
                >
                  See universities
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {page.heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-[18px] border border-white/14 bg-white/10 p-3 backdrop-blur">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/68">{stat.label}</p>
                    <p className="mt-1.5 break-words text-sm font-semibold leading-5 text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 lg:self-stretch">
              <div className="overflow-hidden rounded-[30px] border border-white/18 bg-white/8 p-3 shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur">
                <img
                  src={visuals.gallery[0] ?? page.heroImage}
                  alt={`Study in ${page.name}`}
                  className="h-[250px] w-full rounded-[24px] object-cover sm:h-[300px] lg:h-[440px]"
                />
              </div>

              <div className="rounded-[24px] border border-white/14 bg-[#061520]/90 p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">Featured institutions</p>
                    <p className="mt-1 text-sm text-white/82">Featured institutions at a glance.</p>
                  </div>
                  <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/58">Universities</p>
                    <p className="mt-1 text-2xl font-display text-white">{page.universities.length}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-[18px] border border-white/12 bg-white/6 px-4 py-3 text-sm leading-6 text-white/76">
                  Shortlisted institutions are summarized here by programme fit and destination context.
                </div>
              </div>

              <div className="space-y-3">
                {page.highlights.slice(0, 3).map((item) => (
                  <div key={item.title} className="flex items-start gap-3 rounded-[18px] border border-white/14 bg-white/8 px-4 py-3 backdrop-blur">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-white" />
                    <p className="min-w-0 break-words text-sm leading-6 text-white/90">
                      <strong className="text-white">{item.title}</strong>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-20 z-30 border-b border-[#d8e8ef] bg-[#eef7fa]/95 backdrop-blur lg:hidden">
        <div className={`${pageShell} overflow-x-auto`}>
          <div className="mx-auto flex min-w-max items-center justify-center gap-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent md:gap-6">
            {anchorLinks.map((link, index) => (
              <div key={link.id} className="flex items-center gap-5">
                <a
                  href={`#${link.id}`}
                  className={`whitespace-nowrap rounded-full px-2 py-1 transition-smooth ${
                    activeAnchor === link.id ? "bg-accent text-white shadow-soft" : "hover:text-primary"
                  }`}
                >
                  {link.label}
                </a>
                {index < anchorLinks.length - 1 ? <span className="text-accent/28">|</span> : null}
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
              <h2 className="mt-2 font-display text-2xl leading-tight text-primary">Study in {page.name}</h2>

              <nav className="mt-5 flex-1 space-y-2 overflow-y-auto pr-1">
                {anchorLinks.map((link, index) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    className={`flex items-center justify-between rounded-[16px] border px-4 py-3 text-sm transition-smooth ${
                      activeAnchor === link.id
                        ? "border-accent bg-accent-soft text-primary shadow-soft"
                        : "border-[#e6eef2] bg-[#fbfdff] text-muted-foreground hover:border-accent/40 hover:text-primary"
                    }`}
                  >
                    <span className="inline-flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-accent shadow-sm">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 break-words font-medium">{link.label}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="min-w-0 space-y-8">
            <section id="overview" className="py-8 md:py-10">
              <div className={pageShell}>
                <div className="space-y-4">
            <SectionHeader
              eyebrow={`Study in ${page.name}`}
              title={`${page.name} Overview`}
              intro="A practical snapshot of costs, study areas, and the main institutions to compare."
            />

                  <div className="space-y-4">
                    <div className="rounded-[26px] border border-[#d9e7ee] bg-[linear-gradient(135deg,#f8fbfd_0%,#eef6f9_52%,#ffffff_100%)] p-6 shadow-soft md:p-8">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">Destination snapshot</p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {quickFacts.slice(0, 4).map((fact, index) => (
                          <FactCard key={`${fact.label}-overview-${index}`} {...fact} />
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-[#d9e7ee] bg-[#f8fbfd] p-5 shadow-soft">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">Featured institutions</p>
                          <h3 className="mt-1 font-display text-2xl text-primary">{page.universities.length} Shortlisted</h3>
                        </div>
                        <div className="rounded-2xl border border-[#d9e7ee] bg-white px-4 py-3 text-right shadow-soft">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">Best fit</p>
                          <p className="mt-1 text-sm font-medium text-primary">{page.heroStats[2]?.value ?? "High-demand fields"}</p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-[18px] border border-[#d9e7ee] bg-white px-4 py-3 text-sm leading-6 text-muted-foreground">
                        {page.universities.slice(0, 3).map((uni) => uni.name).join(" • ")}
                      </div>
                    </div>
                  </div>

                  <a
                    href="/#contact"
                    className="inline-flex rounded-full bg-gradient-brand px-5 py-3 text-sm font-medium text-primary-foreground shadow-pill transition-smooth hover:opacity-95"
                  >
                    Book a Free Consultation
                  </a>
                </div>
              </div>
            </section>

      <section id="whyStudy" className="border-y border-[#dce9ef] bg-[#f5fbf7] py-8 md:py-10">
        <div className={pageShell}>
          <div className="space-y-4">
            <SectionHeader
              eyebrow={`Why Study in ${page.name}?`}
              title={whyStudyTitle}
              intro={isItaly ? "The Italy route is built around value, scholarships, and strong post-study planning." : "Nine quick reasons."}
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {reasons.map((reason, index) => (
                <IconBoxCard
                  key={reason.title}
                  icon={index % 4 === 0 ? GraduationCap : index % 4 === 1 ? Scale : index % 4 === 2 ? BriefcaseBusiness : Sparkles}
                  title={reason.title}
                  body={reason.body}
                  compact
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="universities" className="border-y border-[#dce9ef] bg-[#f5fbf7] py-10 md:py-14">
        <div className={pageShell}>
          <SectionHeader eyebrow="Top Universities" title={`Top ${page.name} Universities`} centered intro="Shortlist by programme fit." />

          <div className="mt-7 flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollUniversities("prev")}
              className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d7e3ea] bg-white text-accent shadow-soft transition-smooth hover:bg-accent-soft md:inline-flex"
              aria-label="Previous universities"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div ref={universitiesRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 no-scrollbar">
              {page.universities.map((uni) => (
                <Link
                  key={`${uni.slug || uni.name}-${uni.program}`}
                  to={getRuntimeUniversityHref(page.slug, uni.slug)}
                  className="min-w-[220px] snap-start rounded-[20px] border border-[#d9e7ee] bg-white p-5 text-center shadow-soft md:min-w-[235px]"
                >
                  <h3 className="mt-4 font-display text-xl text-primary">{uni.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{uni.program}</p>
                  <div className="mt-4 inline-flex rounded-full bg-accent-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                    {uni.tag}
                  </div>
                </Link>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollUniversities("next")}
              className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d7e3ea] bg-white text-accent shadow-soft transition-smooth hover:bg-accent-soft md:inline-flex"
              aria-label="Next universities"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section id="admission" className="py-8 md:py-10">
        <div className={pageShell}>
          <div className="space-y-4">
            <SectionHeader
              eyebrow="Admission Criteria"
              title={`Admission Criteria to Study in ${page.name}`}
              intro="Eligibility, documents, language proof, and a clearer step-by-step path."
            />

            <div className="rounded-[24px] border border-[#d9e7ee] bg-white p-5 shadow-soft">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">Checklist</p>
              <ul className="mt-4 space-y-3">
                {page.requirements.map((item) => (
                  <ChecklistItem key={item} text={item} />
                ))}
              </ul>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {[
                { icon: FilePenLine, title: "Eligibility", body: compactText(page.requirements[0], 8) },
                { icon: FileText, title: "Documents", body: compactText(page.requirements[1], 8) },
                { icon: Globe2, title: "Language", body: compactText(page.requirements[2], 8) },
                { icon: Wallet, title: "Visa proof", body: compactText(page.requirements[3], 8) },
              ].map((item) => (
                <IconBoxCard key={item.title} icon={item.icon} title={item.title} body={item.body} compact />
              ))}
            </div>

            <a
              href="/#contact"
              className="inline-flex rounded-full bg-gradient-brand px-5 py-3 text-sm font-medium text-primary-foreground shadow-pill transition-smooth hover:opacity-95"
            >
              Book a Free Consultation
            </a>
            <div className="overflow-hidden rounded-[26px] border border-[#d9e7ee] bg-white shadow-soft">
              <img src={visuals.visaImage} alt={`Admission process for ${page.name}`} className="h-[240px] w-full object-cover md:h-[300px]" decoding="async" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[20px] border border-[#d9e7ee] bg-[#f8fbfd] p-5 shadow-soft">
                <h3 className="font-display text-lg text-primary">How to Apply</h3>
                <ul className="mt-4 space-y-3 text-sm leading-5 text-muted-foreground">
                  {admissionSteps.map((item, index) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[12px] border border-accent/15 bg-white text-[11px] font-semibold text-accent shadow-soft">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[20px] border border-[#d9e7ee] bg-white p-5 shadow-soft">
                <h3 className="font-display text-lg text-primary">Intakes</h3>
                <ul className="mt-4 space-y-3 text-sm leading-5 text-muted-foreground">
                  {page.timeline.map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[12px] border border-accent/15 bg-accent-soft text-accent">
                        <CalendarRange className="h-4 w-4" />
                      </span>
                      <span>
                        <strong className="text-primary">{item.label}:</strong> {compactText(item.value, 6)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-[20px] border border-[#d9e7ee] bg-white p-5 shadow-soft">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">Support</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                If the application flow feels fragmented, we keep it simple: shortlist the right programme, prepare the
                documents, and line up the timing for the intake and visa stage.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="EducationCost" className="border-y border-[#dce9ef] bg-[#f5fbf7] py-8 md:py-10">
        <div className={pageShell}>
          <div className="space-y-4">
            <SectionHeader
              eyebrow="Student Budget Analysis"
              title="Student Budget Analysis"
              intro="An icon-led budget scan built from tuition and living-cost details."
            />

            <div className="overflow-hidden rounded-[26px] border border-[#d9e7ee] bg-white shadow-soft">
              <img src={visuals.budgetImage} alt={`Budget guidance for ${page.name}`} className="h-[240px] w-full object-cover md:h-[310px]" decoding="async" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {page.heroStats.slice(0, 3).map((stat) => (
                <FactCard key={stat.label} label={stat.label} value={stat.value} icon={Wallet} />
              ))}
            </div>

            <div className="space-y-4">
              <div className="rounded-[24px] border border-[#d9e7ee] bg-white p-5 shadow-soft">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">Cost map</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {budgetTiles.map((item) => (
                    <IconBoxCard key={item.title} icon={item.icon} title={item.title} body={item.body} compact />
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {[...page.costs, ...buildLivingCosts(page.name)].map((item) => (
                  <BudgetCard key={item.label} label={item.label} value={item.value} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="scholarship" className="py-8 md:py-10">
        <div className={pageShell}>
          <div className="space-y-4">
            <SectionHeader
              eyebrow="Scholarships"
              title={`Scholarships Available for ${page.name}`}
              intro="Funding routes."
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {buildScholarships(page.name, page.scholarships).slice(0, 8).map((item, index) => (
                <IconBoxCard
                  key={item}
                  icon={index % 3 === 0 ? ShieldCheck : index % 3 === 1 ? Scale : Sparkles}
                  title={item}
                  body="Value, fit, deadline."
                  compact
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="Visa" className="border-y border-[#dce9ef] bg-[#f5fbf7] py-8 md:py-10">
        <div className={pageShell}>
          <div className="space-y-4">
            <SectionHeader
              eyebrow="Student Visa"
              title="Student Visa"
              intro="Only the essentials."
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: FilePenLine, title: "Offer letter", body: "University confirmation." },
                { icon: Wallet, title: "Funds", body: "Financial proof ready." },
                { icon: Globe2, title: "Visa form", body: `Forms for ${page.name}.` },
                { icon: Clock3, title: "Visa window", body: visaWindow },
              ].map((item) => (
                <IconBoxCard key={item.title} icon={item.icon} title={item.title} body={item.body} compact />
              ))}
            </div>

            <a
              href="/#contact"
              className="inline-flex rounded-full bg-gradient-brand px-5 py-3 text-sm font-medium text-primary-foreground shadow-pill transition-smooth hover:opacity-95"
            >
              Apply for Student Visa
            </a>
          </div>
        </div>
      </section>

      <section id="Opportunities" className="py-8 md:py-10">
        <div className={pageShell}>
          <div className="space-y-4">
            <SectionHeader
              eyebrow="Work Opportunities"
              title={`Work Opportunities in ${page.name}`}
              intro="Study-work fit."
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <IconBoxCard icon={BriefcaseBusiness} title="Student work" body="Part-time jobs, internships." compact />
              <IconBoxCard icon={Clock3} title="After study" body={`Visa support timeline: ${visaWindow}.`} compact />
              <IconBoxCard icon={Users} title="Industry" body="Projects, employers, exposure." compact />
              <IconBoxCard icon={Landmark} title="Long term" body="ROI and job direction." compact />
            </div>

            <div className="rounded-[22px] border border-[#d9e7ee] bg-[#f8fbfd] p-4 shadow-soft">
              <SectionHeader eyebrow="Popular Jobs" title="Popular Jobs in Demand" centered intro="Short list." />
              <div className="mt-4 flex flex-wrap gap-2">
                {jobs.map((job) => (
                  <span key={job} className="inline-flex rounded-full border border-[#d9e7ee] bg-white px-3 py-2 text-xs font-medium text-primary shadow-soft">
                    {job}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faqs" className="py-8 md:py-10">
        <div className={pageShell}>
          <SectionHeader eyebrow="FAQs" title="Got Questions? We Got Answers!" centered />
          <div className="mt-6">
            <FaqList faqs={page.faqs} />
          </div>
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

const ChecklistItem = ({ text }: { text: string }) => (
  <li className="flex items-start gap-3 rounded-[16px] border border-[#d9e7ee] bg-[#fbfdff] px-4 py-3 shadow-soft">
    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[12px] border border-accent/15 bg-accent-soft text-accent">
      <Check className="h-4 w-4" />
    </span>
    <span className="min-w-0 break-words text-sm leading-6 text-muted-foreground">{text}</span>
  </li>
);

const BudgetCard = ({ label, value }: { label: string; value: string }) => (
  <article className="rounded-[16px] border border-[#d9e7ee] bg-white p-4 shadow-soft">
    <h3 className="break-words font-poppins text-sm font-semibold text-primary">{label}</h3>
    <p className="mt-2 break-words text-sm leading-5 text-muted-foreground">{value}</p>
  </article>
);

const FaqList = ({ faqs }: { faqs: { q: string; a: string }[] }) => {
  const [open, setOpen] = useState(0);

  return (
    <div className="rounded-[22px] border border-[#d9e7ee] bg-white shadow-soft">
      {faqs.map((faq, index) => {
        const isOpen = open === index;

        return (
          <div key={faq.q} className="border-b border-[#d9e7ee] last:border-b-0">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
            >
              <span className="min-w-0 break-words font-poppins text-base font-semibold text-primary md:text-lg">{faq.q}</span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border text-lg ${
                  isOpen ? "border-accent bg-accent text-white" : "border-[#d9e7ee] text-accent"
                }`}
              >
                {isOpen ? "-" : "+"}
              </span>
            </button>
            <div className={`overflow-hidden px-5 transition-all duration-300 ${isOpen ? "max-h-64 pb-5" : "max-h-0"}`}>
              <p className="break-words font-poppins text-sm leading-6 text-muted-foreground">{compactText(faq.a, 18)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const buildScholarships = (country: string, scholarships?: string[]) =>
  scholarships?.length ? scholarships : [
    `${country} merit scholarships`,
    `${country} university-specific scholarships`,
    "Government scholarship schemes",
    "University grants and bursaries",
  ];

const buildLivingCosts = (country: string) => [
  { label: "Accommodation", value: `${country}: city, room type, campus.` },
  { label: "Food", value: "Groceries, meals, daily spend." },
  { label: "Transport", value: "Transit, commute, student passes." },
  { label: "Insurance and utilities", value: "Cover, internet, electricity, bills." },
];

const buildReasons = (
  country: string,
  highlights: { title: string; body: string }[],
  bestFor: string,
) => {
  if (country === "Italy") {
    return [
      { title: "Free Education", body: "Public universities can make higher education accessible for international students." },
      { title: "Guaranteed Scholarships", body: "Regional scholarships can reach up to €8,000 per year." },
      { title: "IELTS Recommended", body: "Especially for top universities, while GRE and GMAT are not mandatory for most routes." },
      { title: "Better ROI", body: "Scholarships make the return on investment much easier to manage." },
      { title: "Part-Time Work", body: "International students can usually work up to 20 hours per week." },
      { title: "Post-Study Visa", body: "Italy offers a 1-year post-study visa route for eligible graduates." },
      { title: "Long-Term Pathway", body: "Permanent residency becomes possible after 5 years of stay." },
      { title: "Salary Potential", body: "Strong job profiles can support attractive salary outcomes." },
      { title: "Schengen Access", body: "Travel across Europe becomes easier with Schengen access." },
      { title: "English-Taught Programs", body: "A wide range of English-taught programmes is widely available." },
    ];
  }

  const seed = highlights.map((item) => ({ title: item.title, body: compactText(item.body, 10) }));

  const extras = [
    {
      title: "A Wide Spectrum of Courses",
      body: `${country}: strong for ${bestFor || "high-demand fields"}.`,
    },
    {
      title: "Recognised Education System",
      body: "Credible degrees, solid support.",
    },
    {
      title: "Scholarship and Funding Potential",
      body: "Funding can change the total cost.",
    },
    {
      title: "International Student Environment",
      body: `${country}: mixed cohorts, support, ease.`,
    },
    {
      title: "Career-Facing Outcomes",
      body: "Internships, jobs, post-study path.",
    },
    {
      title: "Long-Term Value",
      body: `${country}: ROI, employability, growth.`,
    },
  ];

  return [...seed, ...extras].slice(0, 9);
};

const compactText = (text: string, maxWords = 12) => {
  const cleaned = text.replace(/\s+/g, " ").trim();
  const words = cleaned.split(" ");
  if (words.length <= maxWords) return cleaned;
  return `${words.slice(0, maxWords).join(" ")}…`;
};
