import { useEffect, useState } from "react";
import news1 from "@/assets/news/news1.jpeg";
import news2 from "@/assets/news/news2.jpeg";
import news3 from "@/assets/news/news3.jpeg";
import news4 from "@/assets/news/news4.jpeg";
import news5 from "@/assets/news/news5.jpeg";
import news6 from "@/assets/news/news6.jpeg";

const newsImages = [news1, news2, news3, news4, news5, news6];

const newsMetas = [
  "Press release - July 14, 2026",
  "Press release - June 16, 2026",
  "Press release - April 28, 2026",
  "Press release - March 3, 2026",
  "Press release - Dec 16, 2025",
  "Betakit article - Dec 9, 2025",
];

const newsItems = newsImages.map((image, index) => ({
  image,
  index,
  title: newsMetas[index],
  meta: newsMetas[index],
}));

export const News = () => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (!activeImage) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveImage(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeImage]);

  return (
    <section
      id="news"
      data-scroll-reveal
      data-controlled-scroll
      className="scroll-reveal-section relative isolate flex min-h-[115svh] items-start overflow-hidden bg-fold-blue py-32 text-primary-foreground md:items-center md:py-40"
    >
      <div data-panel-content className="container relative z-10 w-full">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">News</p>
          <h2 className="mt-4 font-display text-4xl md:text-6xl font-semibold text-white text-balance">
            Our <em className="not-italic font-light text-white/80">News</em>
          </h2>
          <p className="mt-5 max-w-2xl text-white/70">
            The latest press releases and coverage on Go Study Overseas
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item, index) => (
            <article
              key={item.href ?? index}
              className="group flex flex-col overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-soft backdrop-blur-md transition-smooth hover:-translate-y-1 hover:shadow-elegant"
            >
              <button
                type="button"
                onClick={() => setActiveImage(item.image)}
                aria-label={`Open news image ${item.index + 1}`}
                className="relative aspect-[4/3] overflow-hidden border-b border-white/10 bg-black/5"
              >
                <img
                  src={item.image}
                  alt={`News image ${item.index + 1}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-center transition-smooth group-hover:scale-105"
                />
              </button>
              {item.meta ? (
                <div className="p-6">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/60">{item.meta}</p>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>

      {activeImage ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setActiveImage(null)}
            aria-label="Close image"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-smooth hover:bg-white/20"
          >
            ×
          </button>
          <img
            src={activeImage}
            alt="News preview"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-elegant"
          />
        </div>
      ) : null}
    </section>
  );
};
