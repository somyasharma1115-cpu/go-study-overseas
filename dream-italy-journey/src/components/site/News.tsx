import { useEffect, useRef, useState } from "react";
import "@/components/site/News.css";
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
  const [isDragging, setIsDragging] = useState(false);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startScroll: 0,
    moved: false,
    lastX: 0,
    lastT: 0,
    velocity: 0,
  });
  const momentum = useRef<number | null>(null);

  const stopMomentum = () => {
    if (momentum.current !== null) {
      cancelAnimationFrame(momentum.current);
      momentum.current = null;
    }
  };

  const clampScroll = (el: HTMLElement, value: number) =>
    Math.max(0, Math.min(value, el.scrollWidth - el.clientWidth));

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const el = scrollerRef.current;
    if (!el) return;
    stopMomentum();
    const now = performance.now();
    drag.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
      lastX: e.clientX,
      lastT: now,
      velocity: 0,
    };
    setIsDragging(true);
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el || !drag.current.active || e.pointerId !== drag.current.pointerId) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 5) drag.current.moved = true;
    const now = performance.now();
    const dt = now - drag.current.lastT;
    if (dt > 0) {
      const inst = (e.clientX - drag.current.lastX) / dt;
      drag.current.velocity = drag.current.velocity * 0.7 + inst * 0.3;
    }
    drag.current.lastX = e.clientX;
    drag.current.lastT = now;
    el.scrollLeft = clampScroll(el, drag.current.startScroll - dx);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!drag.current.active || e.pointerId !== drag.current.pointerId) return;
    if (el && el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    drag.current.active = false;
    setIsDragging(false);

    if (!el) return;
    let v = drag.current.velocity * 16;
    if (Math.abs(v) < 0.5) return;
    const step = () => {
      if (!scrollerRef.current) {
        momentum.current = null;
        return;
      }
      v *= 0.95;
      const next = clampScroll(el, el.scrollLeft - v);
      el.scrollLeft = next;
      if (Math.abs(v) > 0.5 && next > 0 && next < el.scrollWidth - el.clientWidth) {
        momentum.current = requestAnimationFrame(step);
      } else {
        momentum.current = null;
      }
    };
    momentum.current = requestAnimationFrame(step);
  };

  const onCardClick = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

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

        <div
          ref={scrollerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={
            "mt-14 flex snap-x snap-proximity gap-6 overflow-x-auto overscroll-x-contain pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x select-none " +
            (isDragging ? "cursor-grabbing" : "cursor-grab")
          }
        >
          {newsItems.map((item, index) => (
            <article
              key={item.href ?? index}
              onClick={onCardClick}
              className="group flex w-[26rem] shrink-0 snap-start flex-col overflow-hidden rounded-[2rem] border border-white/15 shadow-soft backdrop-blur-md transition-smooth hover:-translate-y-1 hover:shadow-elegant sm:w-[34rem] md:w-[42rem]"
            >
              <button
                type="button"
                onClick={(e) => {
                  if (drag.current.moved) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                  }
                  setActiveImage(item.image);
                }}
                aria-label={`Open news image ${item.index + 1}`}
                className="news-image-container relative block w-full overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={`News image ${item.index + 1}`}
                  loading="lazy"
                  draggable={false}
                  className={
                    "news-image pointer-events-none object-center transition-smooth group-hover:scale-105"
                  }
                />
              </button>
              {item.meta ? (
                <div className="px-4 py-3">
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
