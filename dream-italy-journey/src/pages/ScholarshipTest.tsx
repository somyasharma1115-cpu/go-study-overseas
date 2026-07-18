import { useEffect } from "react";
import { FileCheck2 } from "lucide-react";

import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { useInitialPageReady } from "@/hooks/useInitialPageReady";

const scholarshipTestTitle = "Student Scholarship Eligibility Test";
const scholarshipTestEmbedUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLScgedweLzJJqrQRlozMMfMcGo6iv2Ew_p_vhBGIBqHJa1qiRg/viewform?embedded=true";

const ScholarshipTest = () => {
  useInitialPageReady([], { minDurationMs: 700, timeoutMs: 1800 });

  useEffect(() => {
    document.title = `${scholarshipTestTitle} | Go Study Overseas`;

    const description =
      "Take the Student Scholarship Eligibility Test online and submit your details through the embedded application form.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, []);

  return (
    <main className="min-h-screen bg-[#f6fbff] text-foreground">
      <Navbar forceSolidBackground />

      <section className="relative isolate overflow-hidden pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,150,190,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(18,48,74,0.12),transparent_28%),linear-gradient(180deg,#fbfdff_0%,#eef6fb_44%,#f6fbff_100%)]" />

        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 pb-12 md:px-6 md:pb-16">
          <div className="rounded-[30px] border border-white/70 bg-white/88 p-6 shadow-elegant backdrop-blur md:p-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d8e8ef] bg-[#edf7fc] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1f6e93]">
                <FileCheck2 className="h-3.5 w-3.5" />
                Scholarship Assessment
              </div>
              <h1 className="mt-4 font-display text-4xl leading-[0.95] text-[#10273c] md:text-5xl">
                {scholarshipTestTitle}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#466176] md:text-base">
                Complete the test below to help our team evaluate your scholarship profile and guide you toward the
                right study abroad opportunities.
              </p>
            </div>

            <div className="mt-6 rounded-[28px] border border-[#dbe8f0] bg-[#f8fbfe] p-2 md:p-3">
              <iframe
                title={scholarshipTestTitle}
                src={scholarshipTestEmbedUrl}
                className="min-h-[1329px] w-full rounded-[22px] bg-white"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              >
                Loading…
              </iframe>
            </div>
          </div>
        </div>
      </section>

      <Footer alwaysVisible />
    </main>
  );
};

export default ScholarshipTest;
