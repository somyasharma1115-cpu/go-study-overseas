import { useEffect, useState, type ComponentType } from "react";
import { ArrowRight, Check, FileText, GraduationCap, Landmark, ScrollText, Sparkles, Wallet } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";

import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { useInitialPageReady } from "@/hooks/useInitialPageReady";
import { examPageMap, type ExamSection } from "@/data/exams";
import { buildWhatsAppUrl } from "@/lib/links";

const pageShell = "mx-auto w-full max-w-[1180px] px-4 md:px-6";

export const ExamPage = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const exam = examPageMap[slug];
  const [activeAnchor, setActiveAnchor] = useState(exam?.sections[0]?.id ?? "overview");

  useInitialPageReady([], { minDurationMs: 700, timeoutMs: 1800 });

  useEffect(() => {
    if (!exam) return;

    document.title = `${exam.name} | Exam Guide`;
    const description = exam.heroSummary;
    let metaTag = document.querySelector('meta[name="description"]');
    if (!metaTag) {
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "description");
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute("content", description);
  }, [exam]);

  useEffect(() => {
    if (!exam) return;

    setActiveAnchor(exam.sections[0]?.id ?? "overview");
    const sections = exam.sections
      .map((section) => document.getElementById(section.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

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
  }, [exam]);

  if (!exam) {
    return <Navigate to="/" replace />;
  }

  const topHighlights = [
    { icon: GraduationCap, label: "Exam", value: exam.name },
    { icon: ScrollText, label: "Guide type", value: "Index-led content page" },
    { icon: Wallet, label: "Planning", value: exam.stats.find((stat) => stat.label.toLowerCase().includes("fee"))?.value ?? "Varies" },
    { icon: Landmark, label: "Focus", value: exam.heroTag },
  ];
  const joinClassesMessage = `Hi Go Study Overseas, I want to join online classes for ${exam.name}. Please register me.`;
  const joinClassesUrl = buildWhatsAppUrl(joinClassesMessage);

  return (
    <main className="min-h-screen bg-[#fbfdff] text-foreground">
      <Navbar />

      <section className="relative isolate overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(42,124,255,0.14),transparent_36%),linear-gradient(135deg,#08131f_0%,#0b2238_52%,#10315c_100%)]" />
        <div className={`${pageShell} relative flex min-h-[calc(90svh-5rem)] items-center py-8 md:py-10 lg:py-12`}>
          <div className="grid w-full items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/85 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                {exam.heroTag}
              </div>
              <h1 className="mt-5 max-w-2xl text-balance font-display text-4xl leading-[0.95] text-white md:text-6xl lg:text-[4.15rem]">
                {exam.heroTitle}
              </h1>
              <p className="mt-5 max-w-2xl text-balance text-sm leading-7 text-white/88 md:text-base md:leading-8">{exam.heroSummary}</p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#overview"
                  className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary shadow-pill transition-smooth hover:bg-white/90"
                >
                  Explore overview
                </a>
                <a
                  href={joinClassesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-pill transition-smooth hover:bg-accent/90"
                >
                  Join online classes
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {topHighlights.map((stat) => (
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
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
                  {exam.stats.map((item) => (
                    <div key={item.label} className="rounded-[18px] border border-white/12 bg-white/8 p-4 text-white">
                      <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
                        <Sparkles className="h-3.5 w-3.5" />
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/88">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/14 bg-[#061520]/90 p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/12 bg-white/8">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">Study guide format</p>
                    <p className="mt-1 text-sm text-white/85">Sticky left index, section anchors, and a structured reading flow.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-20 z-30 border-b border-[#d8e8ef] bg-[#eef7fa]/95 backdrop-blur lg:hidden">
        <div className={`${pageShell} overflow-x-auto`}>
          <div className="mx-auto flex min-w-max items-center justify-center gap-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent md:gap-6">
            {exam.sections.map((section, index) => (
              <div key={section.id} className="flex items-center gap-5">
                <a
                  href={`#${section.id}`}
                  className={`whitespace-nowrap rounded-full px-2 py-1 transition-smooth ${
                    activeAnchor === section.id ? "bg-accent text-white shadow-soft" : "hover:text-primary"
                  }`}
                >
                  {section.label}
                </a>
                {index < exam.sections.length - 1 ? <span className="text-accent/28">|</span> : null}
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
              <h2 className="mt-2 font-display text-2xl leading-tight text-primary">{exam.name}</h2>
              <nav className="mt-5 flex-1 space-y-2 overflow-y-auto pr-1">
                {exam.sections.map((section, index) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`flex items-center justify-between rounded-[16px] border px-4 py-3 text-sm transition-smooth ${
                      activeAnchor === section.id
                        ? "border-accent bg-accent-soft text-primary shadow-soft"
                        : "border-[#e6eef2] bg-[#fbfdff] text-muted-foreground hover:border-accent/40 hover:text-primary"
                    }`}
                  >
                    <span className="inline-flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-accent shadow-sm">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 break-words font-medium">{section.label}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="min-w-0 space-y-8">
            {exam.sections.map((section, sectionIndex) => (
              <ExamContentSection key={section.id} section={section} alternate={sectionIndex % 2 === 1} />
            ))}
          </div>
        </div>
      </div>

      <Footer alwaysVisible />
    </main>
  );
};

const ExamContentSection = ({
  section,
  alternate = false,
}: {
  section: ExamSection;
  alternate?: boolean;
}) => (
  <section id={section.id} className={`py-8 md:py-10 ${alternate ? "border-y border-[#dce9ef] bg-[#f5fbf7]" : ""}`}>
    <SectionHeader eyebrow={section.label} title={section.title} intro={section.intro} />

    <div className="mt-5 space-y-4">
      {section.paragraphs?.length ? (
        <div className="rounded-[24px] border border-[#d9e7ee] bg-white p-5 shadow-soft">
          <div className="space-y-3">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-6 text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      ) : null}

      {section.bullets?.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {section.bullets.map((bullet) => (
            <div key={bullet} className="rounded-[18px] border border-[#d9e7ee] bg-white p-4 shadow-soft">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[12px] border border-accent/15 bg-accent-soft text-accent">
                  <Check className="h-4 w-4" />
                </span>
                <p className="text-sm leading-6 text-primary">{bullet}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {section.tables?.length ? (
        <div className="space-y-4">
          {section.tables.map((table, index) => (
            <div key={`${section.id}-table-${index}`} className="overflow-hidden rounded-[24px] border border-[#d9e7ee] bg-white shadow-soft">
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                  <thead className="bg-[#f8fbfd]">
                    <tr>
                      {table.headers.map((header) => (
                        <th key={header} className="border-b border-[#d9e7ee] px-4 py-3 font-semibold text-primary">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, rowIndex) => (
                      <tr key={`${section.id}-row-${rowIndex}`} className="odd:bg-white even:bg-[#fbfdff]">
                        {row.map((cell, cellIndex) => (
                          <td key={`${section.id}-cell-${rowIndex}-${cellIndex}`} className="border-b border-[#eef3f6] px-4 py-3 align-top text-muted-foreground">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {section.faqs?.length ? (
        <div className="rounded-[22px] border border-[#d9e7ee] bg-white shadow-soft">
          {section.faqs.map((faq, index) => (
            <details key={faq.q} open={index === 0} className="border-b border-[#d9e7ee] px-5 py-4 last:border-b-0">
              <summary className="cursor-pointer list-none font-poppins text-base font-semibold text-primary">{faq.q}</summary>
              <p className="mt-2 font-poppins text-sm leading-6 text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>
      ) : null}
    </div>
  </section>
);

const SectionHeader = ({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) => (
  <div className="max-w-3xl">
    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">{eyebrow}</p>
    <h2 className="mt-2 font-display text-[1.75rem] leading-[1.06] text-primary md:text-[2.25rem]">{title}</h2>
    {intro ? <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{intro}</p> : null}
  </div>
);
