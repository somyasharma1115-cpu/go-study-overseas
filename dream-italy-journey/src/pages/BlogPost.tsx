import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";

import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { useInitialPageReady } from "@/hooks/useInitialPageReady";
import { fetchBlogEntries, type BlogEntry } from "@/lib/blogSheet";

type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

const buildContentBlocks = (content: string): ContentBlock[] =>
  content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const looksLikeList = lines.length > 1 && lines.every((line) => line.length <= 90 && !/[.!?]$/.test(line));

      if (looksLikeList) {
        return { type: "list", items: lines } satisfies ContentBlock;
      }

      return { type: "paragraph", text: lines.join(" ") } satisfies ContentBlock;
    });

const summarizeContent = (content: string) => {
  const firstBlock = content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find(Boolean);

  if (!firstBlock) {
    return "";
  }

  const singleLine = firstBlock.replace(/\s+/g, " ").trim();
  return singleLine.length <= 220 ? singleLine : `${singleLine.slice(0, 217).trimEnd()}...`;
};

const BlogPost = () => {
  const { slug } = useParams();
  const { data: blogEntries = [], isLoading, isError } = useQuery({
    queryKey: ["blog-entries"],
    queryFn: fetchBlogEntries,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const selectedEntry = useMemo(
    () => blogEntries.find((entry) => entry.slug === slug) ?? null,
    [blogEntries, slug],
  );

  const relatedEntries = useMemo(
    () => blogEntries.filter((entry) => entry.slug !== selectedEntry?.slug).slice(0, 3),
    [blogEntries, selectedEntry?.slug],
  );

  useInitialPageReady([], { minDurationMs: 700, timeoutMs: 1800 });

  useEffect(() => {
    if (!selectedEntry) {
      return;
    }

    document.title = `${selectedEntry.headline} | Go Study Overseas`;
    const description = summarizeContent(selectedEntry.content) || "Read the latest Go Study Overseas blog post.";

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
    });
  }, [selectedEntry]);

  if (!isLoading && !isError && slug && !selectedEntry) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#eef5fb_38%,#ffffff_100%)] text-[#18263f]">
      <Navbar forceSolidBackground />

      <section className="pb-16 pt-28 md:pb-20">
        <div className="container">
          <div className="max-w-4xl">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-[#d8e4ef] bg-white px-4 py-2 text-sm font-semibold text-[#18314d] shadow-[0_12px_28px_rgba(18,38,63,0.06)] transition-colors hover:border-[#0f7f9d] hover:text-[#0f7f9d]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to blog
            </Link>
          </div>

          <div className="mt-8">
            {isLoading ? (
              <div className="rounded-[2rem] border border-[#dce6f2] bg-white p-8 shadow-[0_20px_60px_rgba(18,38,63,0.06)]">
                <div className="flex items-center gap-3 text-[#18314d]">
                  <LoaderCircle className="h-5 w-5 animate-spin text-[#0f7f9d]" />
                  <p className="text-base font-medium">Loading article...</p>
                </div>
              </div>
            ) : isError ? (
              <div className="rounded-[2rem] border border-[#f2d5d0] bg-[#fff7f5] p-8 text-[#6d3b34] shadow-[0_16px_40px_rgba(109,59,52,0.08)]">
                <h1 className="font-display text-3xl text-[#4f241f]">We couldn&apos;t load this article.</h1>
                <p className="mt-3 max-w-2xl text-[16px] leading-7">
                  The sheet request failed. Please head back to the archive and try again shortly.
                </p>
              </div>
            ) : selectedEntry ? (
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
                <article className="overflow-hidden rounded-[2rem] border border-[#dce6f2] bg-white shadow-[0_20px_60px_rgba(18,38,63,0.08)]">
                  <div className="border-b border-[#e8eef5] bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(241,247,255,0.96))] px-6 py-6 sm:px-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center rounded-full bg-[#eaf7fb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#0f7f9d]">
                        {selectedEntry.blogNumber ? `Blog ${selectedEntry.blogNumber}` : "Blog"}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-medium text-[#4e6281]">
                        Go Study Overseas Journal
                      </span>
                    </div>
                    <h1 className="mt-4 max-w-4xl font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.03] text-[#18263f]">
                      {selectedEntry.headline}
                    </h1>
                  </div>

                  <div className="px-6 py-7 sm:px-8 sm:py-8">
                    <div className="space-y-5 text-[16px] leading-8 text-[#41556f] sm:text-[17px]">
                      {buildContentBlocks(selectedEntry.content).map((block, index) =>
                        block.type === "paragraph" ? (
                          <p key={`${selectedEntry.slug}-paragraph-${index}`}>{block.text}</p>
                        ) : (
                          <ul key={`${selectedEntry.slug}-list-${index}`} className="space-y-3 pl-5 text-[#223451] marker:text-[#0f7f9d]">
                            {block.items.map((item) => (
                              <li key={`${selectedEntry.slug}-${item}`}>{item}</li>
                            ))}
                          </ul>
                        ),
                      )}
                    </div>
                  </div>
                </article>

                <aside className="space-y-5 lg:sticky lg:top-28">
                  <Link
                    to="/#contact"
                    className="block rounded-[1.75rem] border border-[#dce6f2] bg-white p-5 shadow-[0_16px_50px_rgba(20,38,63,0.07)] transition-colors hover:border-[#0f7f9d] hover:shadow-[0_20px_56px_rgba(18,38,63,0.12)]"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0f7f9d]">Need help?</p>
                    <p className="mt-4 text-sm leading-6 text-[#52647d]">
                      If you want guidance on your profile, scholarships, or admissions, our team can help you map the next step.
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0f7f9d]">
                      Go to contact form
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </span>
                  </Link>
                </aside>
              </div>
            ) : null}
          </div>

          {!isLoading && !isError && selectedEntry && relatedEntries.length > 0 ? (
            <section className="mt-10 rounded-[2rem] border border-[#dce6f2] bg-white px-6 py-7 shadow-[0_20px_60px_rgba(18,38,63,0.06)] sm:px-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0f7f9d]">Related posts</p>
                  <h2 className="mt-2 font-display text-[clamp(1.6rem,2.4vw,2.2rem)] text-[#18314d]">
                    More articles you may like
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-3">
                {relatedEntries.map((entry) => (
                  <Link
                    key={entry.slug}
                    to={entry.href}
                    className="group flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-[#dce6f2] bg-white text-left shadow-[0_16px_44px_rgba(18,38,63,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_56px_rgba(18,38,63,0.12)]"
                  >
                    <div className="relative flex h-32 items-end overflow-hidden bg-[linear-gradient(135deg,#17324e_0%,#0f7f9d_58%,#e7f7fb_135%)] p-5 text-white">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.24),transparent_45%)]" />
                      <div className="relative">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/78">
                          {entry.blogNumber ? `Blog ${entry.blogNumber}` : "Blog"}
                        </p>
                        <h3 className="mt-2 line-clamp-2 font-display text-[1.4rem] leading-[1.05] text-white">{entry.headline}</h3>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="line-clamp-4 text-[15px] leading-7 text-[#4d6079]">{summarizeContent(entry.content)}</p>
                      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0f7f9d]">
                        Read article
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>

      <Footer alwaysVisible />
    </main>
  );
};

export default BlogPost;
