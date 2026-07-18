import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, LoaderCircle } from "lucide-react";
import { Link } from "react-router-dom";

import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { useInitialPageReady } from "@/hooks/useInitialPageReady";
import { fetchBlogEntries, type BlogEntry } from "@/lib/blogSheet";

const summarizeContent = (content: string) => {
  const firstBlock = content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find(Boolean);

  if (!firstBlock) {
    return "Read the full story.";
  }

  const singleLine = firstBlock.replace(/\s+/g, " ").trim();
  if (singleLine.length <= 180) {
    return singleLine;
  }

  return `${singleLine.slice(0, 177).trimEnd()}...`;
};

const BlogCard = ({ entry }: { entry: BlogEntry }) => (
  <Link
    to={entry.href}
    className="group flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-[#dce6f2] bg-white text-left shadow-[0_16px_44px_rgba(18,38,63,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_56px_rgba(18,38,63,0.12)]"
  >
    <div className="relative flex h-32 items-end overflow-hidden bg-[linear-gradient(135deg,#17324e_0%,#0f7f9d_58%,#e7f7fb_135%)] p-5 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.24),transparent_45%)]" />
      <div className="relative">
        <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/78">
          {entry.blogNumber ? `Blog ${entry.blogNumber}` : "Blog"}
        </p>
        <h2 className="mt-2 line-clamp-2 font-display text-[1.4rem] leading-[1.05] text-white">{entry.headline}</h2>
      </div>
    </div>

    <div className="flex flex-1 flex-col p-5">
      <p className="line-clamp-4 text-[15px] leading-7 text-[#4d6079]">{summarizeContent(entry.content)}</p>
      <div className="mt-5 flex items-center justify-between gap-4">
        <span className="inline-flex items-center rounded-full bg-[#eef7fb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#0f7f9d]">
          Read article
        </span>
        <ChevronRight className="h-4 w-4 text-[#0f7f9d] transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </div>
  </Link>
);

const Blog = () => {
  const { data: blogEntries = [], isLoading, isError } = useQuery({
    queryKey: ["blog-entries"],
    queryFn: fetchBlogEntries,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useInitialPageReady([], { minDurationMs: 700, timeoutMs: 1800 });

  useEffect(() => {
    document.title = "Blog | Go Study Overseas";
    const description =
      "Browse Go Study Overseas blog posts on Italy admissions, scholarships, and study abroad guidance.";

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
  }, []);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#eef5fb_38%,#ffffff_100%)] text-[#18263f]">
      <Navbar forceSolidBackground />

      <section className="pb-16 pt-28 md:pb-20">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#0f7f9d]">Blog</p>
            <h1 className="mt-4 font-display text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.96] text-[#18263f]">
              Latest stories and guidance from the team.
            </h1>
          </div>

          <div className="mt-10">
            {isLoading ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[340px] animate-pulse overflow-hidden rounded-[1.8rem] border border-[#dce6f2] bg-white shadow-[0_16px_44px_rgba(18,38,63,0.07)]"
                  >
                    <div className="h-32 bg-[linear-gradient(135deg,#18314d_0%,#0f7f9d_58%,#e7f7fb_135%)]" />
                    <div className="space-y-4 p-5">
                      <div className="h-3 w-24 rounded-full bg-[#e6eef6]" />
                      <div className="h-6 w-11/12 rounded-full bg-[#e6eef6]" />
                      <div className="h-4 w-full rounded-full bg-[#edf3f8]" />
                      <div className="h-4 w-5/6 rounded-full bg-[#edf3f8]" />
                      <div className="mt-8 h-9 w-28 rounded-full bg-[#e6eef6]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-[2rem] border border-[#f2d5d0] bg-[#fff7f5] p-8 text-[#6d3b34] shadow-[0_16px_40px_rgba(109,59,52,0.08)]">
                <h2 className="font-display text-3xl text-[#4f241f]">We couldn&apos;t load the blog right now.</h2>
                <p className="mt-3 max-w-2xl text-[16px] leading-7">
                  The sheet request failed. Once the Google Sheets connection responds again, the archive will populate automatically.
                </p>
              </div>
            ) : blogEntries.length === 0 ? (
              <div className="rounded-[2rem] border border-[#dce6f2] bg-white p-8 shadow-[0_20px_60px_rgba(18,38,63,0.06)]">
                <h2 className="font-display text-3xl text-[#18314d]">No blog posts yet.</h2>
                <p className="mt-3 max-w-2xl text-[16px] leading-7 text-[#52647d]">
                  Add rows to the <strong>Blogs</strong> sheet with <strong>Blog #</strong>, <strong>Headline</strong>, and <strong>Content</strong>, and they&apos;ll show up here.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {blogEntries.map((entry) => (
                  <BlogCard key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer alwaysVisible />
    </main>
  );
};

export default Blog;
