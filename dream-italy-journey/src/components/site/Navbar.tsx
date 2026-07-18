import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, FileText, Globe2, Menu, Stethoscope } from "lucide-react";
import { countryPages, getUniversityPageHrefBySlug } from "@/data/countries";
import { examPages, getExamPageHref } from "@/data/exams";
import { mbbsStudyAbroadCountries } from "@/data/mbbsStudyAbroad";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import logo from "@/assets/logo-final.png";

type CountryCard = {
  university: string;
  href: string;
  program: string;
  tag: string;
};

type CountrySection = {
  slug: string;
  label: string;
  href: string;
  note: string;
  intro: string;
  eyebrow: string;
  heroImage: string;
  courseTags: string[];
  stats: { label: string; value: string }[];
  cards: CountryCard[];
};

type StudyDropdownPanelProps = {
  sections: CountrySection[];
  activeSection: CountrySection;
  selectedTags: string[];
  allTags: string[];
  onSelectSection: (label: string) => void;
  onToggleTag: (tag: string) => void;
  onOpenTarget: () => void;
  onClose: () => void;
  primaryActionLabel: string;
};

const mbbsCountrySections: CountrySection[] = mbbsStudyAbroadCountries.map((country) => ({
  slug: country.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  label: country.name.trim(),
  href: `/study-in/${country.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  note: country.note,
  intro: `${country.name.trim()} MBBS colleges for students comparing destination options.`,
  eyebrow: "MBBS",
  heroImage: country.image,
  courseTags: ["MBBS"],
  stats: [
    { label: "Country", value: country.name.trim() },
    { label: "Colleges", value: `${country.universities.length}` },
    { label: "Course", value: "MBBS" },
  ],
  cards: country.universities.map((university) => ({
    university,
    href: getUniversityPageHrefBySlug(
      country.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      university.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
    ),
    program: "MBBS",
    tag: "MBBS",
  })),
}));

const allMbbsTags = Array.from(new Set(mbbsCountrySections.flatMap((section) => section.courseTags)));

const examMenuItems = examPages.map((page) => ({
  slug: page.slug,
  label: page.name,
  href: getExamPageHref(page.slug),
}));

const testPrepNavOrder = [
  "toefl",
  "psat",
  "sat",
  "act",
  "ielts",
  "hat",
  "elat",
  "philosophy-test",
  "gre",
  "gmat",
] as const;

const testPrepNavItems = testPrepNavOrder
  .map((slug) => examMenuItems.find((item) => item.slug === slug))
  .filter((item): item is (typeof examMenuItems)[number] => Boolean(item));

const directMobileLinks = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Course Finder", href: "/course-finder" },
  { label: "Events", href: "/events" },
  { label: "Find Scholarships", href: "/find-your-path" },
] as const;

const navTriggerClass =
  "group relative isolate inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-smooth before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-white/10 before:opacity-0 before:scale-95 before:transition before:duration-300 before:content-[''] hover:before:scale-100 hover:before:opacity-100";

const StudyDropdownPanel = ({
  sections,
  activeSection,
  selectedTags,
  allTags,
  onSelectSection,
  onToggleTag,
  onOpenTarget,
  onClose,
  primaryActionLabel,
}: StudyDropdownPanelProps) => (
  <div
    className="fixed left-1/2 top-[78px] z-[10000] w-[min(calc(100vw-24px),1228px)] -translate-x-1/2"
    onMouseEnter={onOpenTarget}
    onMouseLeave={onClose}
  >
    <div className="h-[min(84vh,760px)] overflow-hidden rounded-[28px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,251,255,0.97))] shadow-elegant backdrop-blur-xl">
      <div className="flex h-full min-h-0">
        <div className="max-h-[min(84vh,760px)] w-[292px] shrink-0 overflow-y-auto border-r border-border/70 bg-white/70 px-7 py-7">
          <ul className="space-y-1">
            {sections.map((section) => {
              const isActive = activeSection.label === section.label;

              return (
                <li key={section.label}>
                  <Link
                    to={section.href}
                    onClick={onClose}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-[15px] font-medium transition-smooth ${
                      isActive
                        ? "border-accent/25 bg-accent-soft text-accent shadow-soft"
                        : "border-transparent text-foreground hover:border-border hover:bg-white/80 hover:text-accent"
                    }`}
                    onMouseEnter={() => onSelectSection(section.label)}
                    onFocus={() => onSelectSection(section.label)}
                  >
                    <div>
                      <span className="block">{section.label}</span>
                      <span
                        className={`mt-1 block text-xs font-medium ${isActive ? "text-accent/80" : "text-muted-foreground"}`}
                      >
                        {section.note}
                      </span>
                    </div>
                    <ChevronDown className={`h-4 w-4 -rotate-90 ${isActive ? "text-accent" : "text-muted-foreground"}`} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex min-h-0 flex-1 flex-col bg-gradient-dawn px-8 py-7">
          <div className="mb-5">
            <div className="flex items-start justify-between gap-6">
              <div className="max-w-[520px]">
                <p className="font-display text-[32px] leading-[1.05] text-foreground">{activeSection.label}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{activeSection.intro}</p>
              </div>
              <Link
                to={activeSection.href}
                onClick={onClose}
                className="inline-flex shrink-0 items-center rounded-full bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sky transition-smooth hover:bg-accent/95"
              >
                {primaryActionLabel}
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {allTags.length > 1 ? (
                <button
                  type="button"
                  className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-smooth ${
                    selectedTags.length === allTags.length && allTags.every((tag) => selectedTags.includes(tag))
                      ? "border-accent bg-accent text-white shadow-sky"
                      : "border-white/70 bg-white/70 text-foreground hover:border-accent/25 hover:bg-white"
                  }`}
                  onClick={() => onToggleTag("__all__")}
                  aria-pressed={selectedTags.length === allTags.length && allTags.every((tag) => selectedTags.includes(tag))}
                >
                  All
                </button>
              ) : null}
              {activeSection.courseTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);

                return (
                  <button
                    key={tag}
                    type="button"
                    className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-smooth ${
                      isSelected
                        ? "border-accent bg-accent text-white shadow-sky"
                        : "border-white/70 bg-white/70 text-foreground hover:border-accent/25 hover:bg-white"
                    }`}
                    onClick={() => onToggleTag(tag)}
                    aria-pressed={isSelected}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="min-h-0 overflow-y-auto pr-2">
              <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-2">
                {activeSection.cards
                  .filter((card) =>
                    !selectedTags.length ? true : selectedTags.some((tag) => card.tag.toLowerCase() === tag.toLowerCase()),
                  )
                  .map((card) => (
                    <Link
                      key={`${card.university}-${card.program}`}
                      to={card.href}
                      onClick={onClose}
                      className="group glass block rounded-[24px] border border-white/60 p-5 text-left transition-smooth hover:-translate-y-1 hover:shadow-sky"
                    >
                      <div className="min-w-0">
                        <p className="break-words text-[16px] font-semibold leading-5 text-foreground">{card.university}</p>
                        <p className="mt-1 break-words text-[14px] leading-5 text-muted-foreground">{card.program}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-gradient-pill px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground shadow-pill">
                            {card.tag}
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">View details</span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>

            <div className="relative hidden h-full min-h-0 overflow-hidden rounded-[28px] lg:block">
              <img
                src={activeSection.heroImage}
                alt={`${activeSection.label} skyline`}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,28,68,0.05),rgba(0,28,68,0.14)_24%,rgba(0,28,68,0.56)_74%,rgba(0,28,68,0.84)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <div className="glass-strong rounded-[18px] border border-white/20 bg-[linear-gradient(180deg,rgba(0,28,68,0.10),rgba(0,28,68,0.22))] p-2.5 text-white backdrop-blur-md">
                  {activeSection.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between gap-3 border-b border-white/12 py-1.5 last:border-b-0 last:pb-0 first:pt-0"
                    >
                      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/72">{stat.label}</p>
                      <p className="max-w-[132px] text-right text-[11px] font-semibold leading-snug text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const Navbar = ({ forceSolidBackground = false }: { forceSolidBackground?: boolean } = {}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studyMenuOpen, setStudyMenuOpen] = useState(false);
  const [studyMenuMode, setStudyMenuMode] = useState<"countries" | "mbbs">("countries");
  const [examMenuOpen, setExamMenuOpen] = useState(false);
  const [activeCountry, setActiveCountry] = useState("Italy");
  const [selectedCountryTags, setSelectedCountryTags] = useState<string[]>([]);
  const [activeMbbsCountry, setActiveMbbsCountry] = useState(mbbsCountrySections[0]?.label ?? "Russia");
  const [selectedMbbsTags, setSelectedMbbsTags] = useState<string[]>(allMbbsTags);
  const closeStudyMenuTimer = useRef<number | null>(null);
  const countrySections = useMemo<CountrySection[]>(
    () =>
      countryPages.map((page) => ({
        slug: page.slug,
        label: page.name,
        href: `/study-in/${page.slug}`,
        note: page.menuNote,
        intro: page.heroSummary,
        eyebrow: page.heroTag,
        heroImage: page.spotlightImage,
        courseTags: (() => {
          const uniqueTags = Array.from(new Set(page.universities.map((university) => university.tag).filter(Boolean)));
          if (uniqueTags.includes("MBBS")) {
            return uniqueTags.slice(0, 8);
          }

          return uniqueTags.length < 8 ? [...uniqueTags, "MBBS"] : [...uniqueTags.slice(0, 7), "MBBS"];
        })(),
        stats: page.heroStats.slice(0, 3),
        cards: page.universities.map((university) => ({
          university: university.name,
          href: getUniversityPageHrefBySlug(page.slug, university.slug),
          program: university.program,
          tag: university.tag,
        })),
      })),
    [countryPages],
  );
  const allCountryTags = useMemo(() => Array.from(new Set(countrySections.flatMap((section) => section.courseTags))), [countrySections]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerIsSolid = forceSolidBackground || scrolled;
  const activeCountrySection = useMemo(
    () => countrySections.find((country) => country.label === activeCountry) ?? countrySections[0],
    [activeCountry, countrySections],
  );
  const activeMbbsSection = useMemo(
    () => mbbsCountrySections.find((country) => country.label === activeMbbsCountry) ?? mbbsCountrySections[0],
    [activeMbbsCountry],
  );

  const activeSection = studyMenuMode === "countries" ? activeCountrySection : activeMbbsSection;
  const selectedTags = studyMenuMode === "countries" ? selectedCountryTags : selectedMbbsTags;

  useEffect(() => {
    setActiveCountry(countrySections[0]?.label ?? "Italy");
    setSelectedCountryTags(allCountryTags);
  }, [allCountryTags, countrySections]);

  const openStudyMenu = (mode: "countries" | "mbbs") => {
    if (closeStudyMenuTimer.current) {
      window.clearTimeout(closeStudyMenuTimer.current);
      closeStudyMenuTimer.current = null;
    }

    setExamMenuOpen(false);
    setStudyMenuMode(mode);
    setStudyMenuOpen(true);
  };

  const toggleStudyMenu = (mode: "countries" | "mbbs") => {
    if (studyMenuOpen && studyMenuMode === mode) {
      setStudyMenuOpen(false);
      return;
    }

    openStudyMenu(mode);
  };

  const closeStudyMenu = () => {
    if (closeStudyMenuTimer.current) {
      window.clearTimeout(closeStudyMenuTimer.current);
    }

    closeStudyMenuTimer.current = window.setTimeout(() => {
      setStudyMenuOpen(false);
      setActiveCountry(countrySections[0]?.label ?? "Italy");
      setActiveMbbsCountry(mbbsCountrySections[0]?.label ?? "Russia");
      setSelectedCountryTags(allCountryTags);
      setSelectedMbbsTags(allMbbsTags);
      closeStudyMenuTimer.current = null;
    }, 120);
  };

  useEffect(
    () => () => {
      if (closeStudyMenuTimer.current) {
        window.clearTimeout(closeStudyMenuTimer.current);
      }
    },
    [],
  );

  const toggleStudyTag = (tag: string) => {
    if (studyMenuMode === "countries") {
      if (tag === "__all__") {
        setSelectedCountryTags(allCountryTags);
        return;
      }

      setSelectedCountryTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
      return;
    }

    if (tag === "__all__") {
      setSelectedMbbsTags(allMbbsTags);
      return;
    }

    setSelectedMbbsTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  };

  const countryTriggerTextClass = headerIsSolid ? "text-white/90 hover:text-white" : "text-white";
  const aboutLinkClass = `${navTriggerClass} ${countryTriggerTextClass}`;
  const navButtonClass = `${navTriggerClass} ${countryTriggerTextClass}`;
  const eventsLinkClass = `${navTriggerClass} ${countryTriggerTextClass}`;
  const examsLinkClass = `${navTriggerClass} ${countryTriggerTextClass}`;
  const courseLinkClass = `${navTriggerClass} ${countryTriggerTextClass}`;
  const mobileIconButtonClass = headerIsSolid
    ? "border-white/15 bg-white/10 text-white hover:bg-white/16"
    : "border-white/30 bg-black/10 text-white hover:bg-black/20";

  const closeAllMenus = () => {
    setStudyMenuOpen(false);
    setExamMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const handleAboutClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    closeAllMenus();
    navigate("/about");

    // Scroll after navigation so the target page starts at the top even on same-route clicks.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
    });
  };

  const handleMobileNavigate = () => {
    closeAllMenus();

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
    });
  };

  return (
    <header
      className={`fixed left-0 top-0 z-40 w-full transition-smooth ${
        headerIsSolid
          ? "border-b border-white/10 bg-[#21334b] shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link to="/" className="inline-flex items-center rounded-lg bg-white px-2 py-1 shadow-sm">
          <img src={logo} alt="Go Study Overseas" className="h-10 w-auto object-contain" width={422} height={97} />
        </Link>

        <div className="flex items-center gap-3 sm:gap-8">
          <nav className="hidden items-center gap-2 md:flex">
            <div
              className="relative"
              onMouseEnter={() => openStudyMenu("countries")}
              onMouseLeave={closeStudyMenu}
            >
              <button
                type="button"
                aria-label="Countries / Universities / Courses"
                aria-expanded={studyMenuOpen && studyMenuMode === "countries"}
                className={navButtonClass}
                onFocus={() => openStudyMenu("countries")}
                onClick={() => toggleStudyMenu("countries")}
              >
                <Globe2 className="h-4 w-4" />
                <span className="whitespace-nowrap">Countries / Universities / Courses</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${studyMenuOpen && studyMenuMode === "countries" ? "rotate-180" : ""}`} />
              </button>
            </div>

            <div className="relative" onMouseEnter={() => openStudyMenu("mbbs")} onMouseLeave={closeStudyMenu}>
              <button
                type="button"
                aria-label="Browse MBBS colleges"
                aria-expanded={studyMenuOpen && studyMenuMode === "mbbs"}
                className={navButtonClass}
                onFocus={() => openStudyMenu("mbbs")}
                onClick={() => toggleStudyMenu("mbbs")}
              >
                <Stethoscope className="h-4 w-4" />
                <span className="whitespace-nowrap">MBBS</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${studyMenuOpen && studyMenuMode === "mbbs" ? "rotate-180" : ""}`} />
              </button>
            </div>

            {studyMenuOpen && activeSection ? (
              <StudyDropdownPanel
                sections={studyMenuMode === "countries" ? countrySections : mbbsCountrySections}
                activeSection={activeSection}
                selectedTags={selectedTags}
                allTags={studyMenuMode === "countries" ? allCountryTags : allMbbsTags}
                onSelectSection={(label) => {
                  if (studyMenuMode === "countries") {
                    setActiveCountry(label);
                    return;
                  }

                  setActiveMbbsCountry(label);
                }}
                onToggleTag={toggleStudyTag}
                onOpenTarget={() => openStudyMenu(studyMenuMode)}
                onClose={closeStudyMenu}
                primaryActionLabel={studyMenuMode === "countries" ? "Explore country" : "Explore MBBS"}
              />
            ) : null}

            <div
              className="relative"
              onMouseEnter={() => {
                setStudyMenuOpen(false);
                setExamMenuOpen(true);
              }}
              onMouseLeave={() => setExamMenuOpen(false)}
            >
              <button
                type="button"
                aria-label="Browse exams"
                aria-expanded={examMenuOpen}
                className={examsLinkClass}
                onFocus={() => {
                  setStudyMenuOpen(false);
                  setExamMenuOpen(true);
                }}
                onClick={() => {
                  setStudyMenuOpen(false);
                  setExamMenuOpen((current) => !current);
                }}
              >
                <FileText className="h-4 w-4" />
                <span className="whitespace-nowrap">Exams</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${examMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {examMenuOpen ? (
                <div className="absolute left-0 top-full z-[10001] mt-2 w-[340px] overflow-hidden rounded-[22px] border border-white/60 bg-white shadow-elegant backdrop-blur-xl">
                  <div className="px-4 py-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">Test Preparation</p>
                  </div>
                  <div className="grid max-h-[400px] gap-2 overflow-y-auto p-3 sm:grid-cols-2">
                    {testPrepNavItems.map((item) => (
                      <Link
                        key={item.slug}
                        to={item.href}
                        onClick={() => setExamMenuOpen(false)}
                        className="rounded-2xl border border-transparent px-4 py-3 text-left transition-smooth hover:border-accent/20 hover:bg-accent-soft"
                      >
                        <span className="block text-sm font-semibold text-foreground">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <Link to="/course-finder" className={courseLinkClass} onClick={() => setStudyMenuOpen(false)}>
              Course Finder
            </Link>

            <Link to="/about" className={aboutLinkClass} onClick={handleAboutClick}>
              About
            </Link>

            <Link to="/events" className={eventsLinkClass} onClick={() => setStudyMenuOpen(false)}>
              Events
            </Link>
          </nav>

          <Link
            to="/find-your-path"
            onClick={handleMobileNavigate}
            className="hidden items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-medium text-[#21334b] shadow-soft transition-smooth hover:bg-white/90 sm:inline-flex sm:px-5 sm:text-sm"
          >
            Find Scholarships
          </Link>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open navigation menu"
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-smooth md:hidden ${mobileIconButtonClass}`}
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(100vw,24rem)] overflow-y-auto border-l border-[#d6e2ef] bg-[linear-gradient(180deg,#f8fbff_0%,#eef5ff_100%)] px-0 pb-8 pt-14"
            >
              <SheetTitle className="px-5 text-left font-display text-[26px] text-[#21334b]">Explore</SheetTitle>

              <div className="mt-2 px-5">
                <p className="text-sm leading-6 text-slate-600">
                  Browse destinations, MBBS options, exams, and quick links without crowding the top bar.
                </p>
              </div>

              <div className="mt-6 px-5">
                <Link
                  to="/find-your-path"
                  onClick={handleMobileNavigate}
                  className="inline-flex w-full items-center justify-center rounded-[18px] bg-[#21334b] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(33,51,75,0.22)] transition-smooth hover:bg-[#1a2a40]"
                >
                  Start with Find Scholarships
                </Link>
              </div>

              <Accordion type="multiple" className="mt-6 px-5">
                <AccordionItem value="countries" className="border-[#d6e2ef]">
                  <AccordionTrigger className="py-5 text-left text-base font-semibold text-[#21334b] hover:no-underline">
                    Countries / Universities / Courses
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2 pb-2">
                    {countrySections.map((section) => (
                      <Link
                        key={section.slug}
                        to={section.href}
                        onClick={handleMobileNavigate}
                        className="block rounded-[18px] border border-white/80 bg-white/80 px-4 py-3 shadow-[0_12px_28px_rgba(80,104,140,0.08)] transition-smooth hover:-translate-y-0.5 hover:bg-white"
                      >
                        <span className="block text-sm font-semibold text-[#21334b]">{section.label}</span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">{section.note}</span>
                      </Link>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="mbbs" className="border-[#d6e2ef]">
                  <AccordionTrigger className="py-5 text-left text-base font-semibold text-[#21334b] hover:no-underline">
                    MBBS
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2 pb-2">
                    {mbbsCountrySections.map((section) => (
                      <Link
                        key={section.slug}
                        to={section.href}
                        onClick={handleMobileNavigate}
                        className="block rounded-[18px] border border-white/80 bg-white/80 px-4 py-3 shadow-[0_12px_28px_rgba(80,104,140,0.08)] transition-smooth hover:-translate-y-0.5 hover:bg-white"
                      >
                        <span className="block text-sm font-semibold text-[#21334b]">{section.label}</span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">{section.note}</span>
                      </Link>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="exams" className="border-[#d6e2ef]">
                  <AccordionTrigger className="py-5 text-left text-base font-semibold text-[#21334b] hover:no-underline">
                    Exams
                  </AccordionTrigger>
                  <AccordionContent className="grid gap-2 pb-2">
                    {testPrepNavItems.map((item) => (
                      <Link
                        key={item.slug}
                        to={item.href}
                        onClick={handleMobileNavigate}
                        className="rounded-[18px] border border-white/80 bg-white/80 px-4 py-3 text-sm font-semibold text-[#21334b] shadow-[0_12px_28px_rgba(80,104,140,0.08)] transition-smooth hover:-translate-y-0.5 hover:bg-white"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="mt-4 px-5">
                <div className="rounded-[22px] border border-white/80 bg-white/70 p-3 shadow-[0_18px_40px_rgba(80,104,140,0.08)]">
                  {directMobileLinks.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={item.href === "/about" ? handleAboutClick : handleMobileNavigate}
                      className={`block rounded-[16px] px-4 py-3 text-sm font-semibold transition-smooth ${
                        pathname === item.href ? "bg-[#21334b] text-white" : "text-[#21334b] hover:bg-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
