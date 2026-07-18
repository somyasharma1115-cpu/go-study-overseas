import { type CSSProperties, useEffect, useRef, useState } from "react";
import instagramDRC2jthDAM2 from "@/assets/reviews/DRC2jthDAM2.mp4";
import instagramDQ8pZuqE from "@/assets/reviews/DQ8pZuqE-Cg.mp4";
import instagramDWTHCxTjK0X from "@/assets/reviews/DWTHCxTjK0X.mp4";
import eventStudentStory from "@/assets/reviews/IMG_3559.mp4";
import sandeepReview from "@/assets/reviews/sandeep_italy.mp4";
import swatiReview from "@/assets/reviews/swati_chindwara.mp4";
import uditReview from "@/assets/reviews/udit_indore.mp4";
import instagramDRC2jthDAM2Poster from "@/assets/reviews/posters/DRC2jthDAM2.jpg";
import instagramDQ8pZuqEPoster from "@/assets/reviews/posters/DQ8pZuqE-Cg.jpg";
import instagramDWTHCxTjK0XPoster from "@/assets/reviews/posters/DWTHCxTjK0X.jpg";
import eventStudentStoryPoster from "@/assets/reviews/posters/IMG_3559.jpg";
import sandeepReviewPoster from "@/assets/reviews/posters/sandeep_italy.jpg";
import swatiReviewPoster from "@/assets/reviews/posters/swati_chhindwara.jpg";
import uditReviewPoster from "@/assets/reviews/posters/udit_indore.jpg";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

const testimonials = [
  { label: "Italy · Sandeep", place: "Italy", video: sandeepReview, poster: sandeepReviewPoster },
  { label: "India · Swati", place: "Chhindwara", video: swatiReview, poster: swatiReviewPoster },
  { label: "India · Udit", place: "Indore", video: uditReview, poster: uditReviewPoster },
  { label: "Italy · Sahil", place: "Italy", video: instagramDQ8pZuqE, poster: instagramDQ8pZuqEPoster },
  { label: "Italy · Student story", place: "Visa comeback", video: instagramDRC2jthDAM2, poster: instagramDRC2jthDAM2Poster },
  { label: "India · Om Singh Baghel", place: "NMIMS", video: instagramDWTHCxTjK0X, poster: instagramDWTHCxTjK0XPoster },
  { label: "India · Student story", place: "Study abroad guidance", video: eventStudentStory, poster: eventStudentStoryPoster },
];

const bounceTimings = [
  { duration: 6.8, delay: -0.6, distance: 5 },
  { duration: 7.4, delay: -2.2, distance: 6 },
  { duration: 8.1, delay: -1.3, distance: 4 },
  { duration: 6.3, delay: -3.1, distance: 5 },
  { duration: 7.9, delay: -0.9, distance: 6 },
] as const;

const getBounceStyle = (index: number) => {
  const timing = bounceTimings[index % bounceTimings.length];
  return {
    ["--testimonial-bounce-duration" as string]: `${timing.duration}s`,
    ["--testimonial-bounce-delay" as string]: `${timing.delay}s`,
    ["--testimonial-bounce-distance" as string]: `${timing.distance}px`,
  } as CSSProperties;
};

export const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  useEffect(() => {
    if (!emblaApi) return;
    const resetActive = () => setActiveIndex(null);
    emblaApi.on("select", resetActive);
    emblaApi.on("reInit", resetActive);

    const id = activeIndex === null ? window.setInterval(() => emblaApi.scrollNext(), 3200) : null;
    return () => {
      if (id !== null) {
        window.clearInterval(id);
      }
      emblaApi.off("select", resetActive);
      emblaApi.off("reInit", resetActive);
    };
  }, [emblaApi, activeIndex]);

  const togglePlayback = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (activeIndex === index) {
      video.pause();
      setActiveIndex(null);
      return;
    }

    videoRefs.current.forEach((item) => {
      if (item && !item.paused) {
        item.pause();
      }
    });

    void video.play();
    setActiveIndex(index);
  };

  const scrollPrev = () => {
    if (!emblaApi) return;
    setActiveIndex(null);
    emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (!emblaApi) return;
    setActiveIndex(null);
    emblaApi.scrollNext();
  };

  return (
    <section
      id="testimonials"
      data-scroll-reveal
      data-controlled-scroll
      className="scroll-reveal-section relative isolate flex min-h-[115svh] items-center overflow-hidden bg-fold-blue py-32 text-primary-foreground md:py-40"
    >
      <div data-panel-content className="relative z-10 mx-auto w-full max-w-6xl px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-white/70 mb-3">Testimonials</p>
          <h2 className="font-display text-3xl md:text-5xl text-white text-balance">
            Real students. Real journeys. <span className="italic text-white/85">From India to abroad.</span>
          </h2>
        </div>

        <div className="mx-auto mt-2 flex w-full max-w-6xl items-center gap-3 sm:gap-4 md:gap-5">
          <button
            type="button"
            onClick={scrollPrev}
            className="group relative z-10 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-[0_14px_35px_rgba(15,23,42,0.24)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white/20 sm:h-12 sm:w-12"
            aria-label="Previous testimonial"
          >
            <span className="absolute inset-0 rounded-full border border-white/20 opacity-60 transition-transform duration-500 group-hover:rotate-180" />
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <div ref={emblaRef} className="min-w-0 flex-1 overflow-hidden">
            <div className="-ml-4 flex">
              {testimonials.map((s, i) => {
                const cardIndex = i;
                return (
                  <div key={s.label} className="min-w-0 shrink-0 basis-[86%] pl-4 sm:basis-[70%] md:basis-1/3 xl:basis-1/5">
                    <div
                      className="testimonials-bounce group relative overflow-hidden rounded-3xl text-left shadow-soft transition-shadow hover:shadow-cloud"
                      style={{
                        ...getBounceStyle(cardIndex),
                        ["--testimonial-bounce-offset" as string]: `${i % 2 === 0 ? "0px" : "20px"}`,
                      } as CSSProperties}
                    >
                      <div className="relative aspect-[9/16] overflow-hidden rounded-3xl border border-white/10 bg-black/30">
                        <video
                          ref={(el) => {
                            videoRefs.current[cardIndex] = el;
                          }}
                          src={s.video}
                          poster={s.poster}
                          playsInline
                          preload="none"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                          onEnded={() => setActiveIndex((prev) => (prev === cardIndex ? null : prev))}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent" />
                        {activeIndex !== cardIndex && (
                          <button
                            type="button"
                            onClick={() => togglePlayback(cardIndex)}
                            className="absolute left-1/2 top-[68%] z-20 -translate-x-1/2 -translate-y-1/2"
                            aria-label={`Play testimonial from ${s.label}`}
                          >
                            <span className="flex items-center justify-center rounded-full bg-sky-500/95 p-4 shadow-[0_18px_40px_rgba(14,165,233,0.45)] ring-8 ring-sky-400/20 backdrop-blur-sm">
                              <Play className="h-8 w-8 fill-white text-white" />
                            </span>
                          </button>
                        )}
                        {activeIndex === cardIndex && (
                          <button
                            type="button"
                            onClick={() => togglePlayback(cardIndex)}
                            className="absolute inset-0 z-20"
                            aria-label={`Pause testimonial from ${s.label}`}
                          />
                        )}
                      </div>
                      <div className="px-1 pt-3 text-sm text-white/90">
                        <span className="font-medium">{s.label}</span>
                        <span className="text-white/65"> · {s.place}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={scrollNext}
            className="group relative z-10 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-[0_14px_35px_rgba(15,23,42,0.24)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white/20 sm:h-12 sm:w-12"
            aria-label="Next testimonial"
          >
            <span className="absolute inset-0 rounded-full border border-white/20 opacity-60 transition-transform duration-500 group-hover:-rotate-180" />
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </div>
    </section>
  );
};
