import { useEffect, useRef, useState } from "react";
import goStudyWayReel from "@/assets/web/go-study-way-reel.mp4";
import goStudyWayReelPoster from "@/assets/web/posters/go-study-way-reel.jpg";
import canamA1 from "@/assets/web/canam-awards/a-1.webp";
import canamA2 from "@/assets/web/canam-awards/a-2.webp";
import canamA3 from "@/assets/web/canam-awards/a-3.webp";
import canamA5 from "@/assets/web/canam-awards/a-5.webp";
import canamA6 from "@/assets/web/canam-awards/a-6.webp";
import canamA7 from "@/assets/web/canam-awards/a-7.webp";
import canamA8 from "@/assets/web/canam-awards/a-8.webp";
import canamNzeri from "@/assets/web/canam-awards/nzeri.webp";
import canamIcef from "@/assets/web/canam-awards/icef.webp";
import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

const recognitions = [
  {
    title: "NZERI",
    label: "Awards & Recognition",
    image: canamNzeri,
  },
  {
    title: "Canam Award 7",
    label: "Awards & Recognition",
    image: canamA7,
  },
  {
    title: "AIRC",
    label: "Awards & Recognition",
    image: canamA1,
    href: "/airc",
  },
  {
    title: "Canam Award 2",
    label: "Awards & Recognition",
    image: canamA2,
  },
  {
    title: "Canam Award 3",
    label: "Awards & Recognition",
    image: canamA3,
  },
  {
    title: "Canam Award 5",
    label: "Awards & Recognition",
    image: canamA5,
  },
  {
    title: "Canam Award 6",
    label: "Awards & Recognition",
    image: canamA6,
  },
  {
    title: "Canam Award 8",
    label: "Awards & Recognition",
    image: canamA8,
  },
  {
    title: "Canam Award 2",
    label: "Awards & Recognition",
    image: canamA2,
  },
  {
    title: "ICEF",
    label: "Awards & Recognition",
    image: canamIcef,
    href: "https://www.icef.com/agency/0012000000UQ08DAAT",
  },
];

export const Manifesto = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          const video = videoRef.current;
          if (!video) return;
          void video.play().catch(() => {});
          return;
        }

        const video = videoRef.current;
        if (!video) return;
        if (!video.paused && !hasInteracted) {
          video.pause();
        }
      },
      { threshold: 0.45, rootMargin: "240px 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [hasInteracted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
  }, [isMuted]);

  const handleRestart = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play().catch(() => {});
  };

  const handleToggleMute = () => {
    setHasInteracted(true);
    setIsMuted((current) => !current);
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().catch(() => {});
    }
  };

  const handleTogglePlayback = () => {
    setHasInteracted(true);
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration === 0) return;
    setProgress(video.currentTime / video.duration);
  };

  useEffect(() => {
    if (!emblaApi) return;
    const id = window.setInterval(() => emblaApi.scrollNext(), 2800);
    return () => window.clearInterval(id);
  }, [emblaApi]);

  return (
    <section
      ref={sectionRef}
      data-scroll-reveal
      data-controlled-scroll
      className="scroll-reveal-section relative isolate flex min-h-[100svh] items-start overflow-hidden bg-fold-light py-24 md:py-28"
    >
      <div data-panel-content className="container relative z-10 w-full pt-10 md:pt-14">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">The Go Study Overseas way</p>
            <h2 className="mt-8 font-display text-5xl md:text-7xl font-light leading-[1] text-balance text-primary">
              Honest guidance.
              <span className="block mt-3">Real scholarships.</span>
              <span className="block mt-3">Global opportunities.</span>
            </h2>
            <p className="mt-10 max-w-xl text-lg font-light text-foreground/75">
              We help students secure scholarships, admissions, and visa support for top universities in Italy, Germany, Dubai, Ireland, and the UK - making international education more accessible and affordable.
            </p>
            <div className="mt-12 space-y-4 text-sm">
              {[
                "Scholarship-focused admissions support",
                "Personalized counselling & university matching",
                "SOP, LOR & visa guidance under one roof",
                "Alumni mentor community across countries",
                "200+ global university partnerships",
              ].map((t) => (
                <div key={t} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span className="text-foreground/80">{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[340px] md:max-w-[380px]">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-sky-200/45 via-white/40 to-amber-100/35 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-card shadow-[0_24px_80px_rgba(15,23,42,0.16)]">
              <div className="relative aspect-[9/13] w-full bg-black md:aspect-[9/14]">
                <video
                  ref={videoRef}
                  src={shouldLoadVideo ? goStudyWayReel : undefined}
                  poster={goStudyWayReelPoster}
                  className="h-full w-full object-cover"
                  muted={isMuted}
                  playsInline
                  preload="none"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleTimeUpdate}
                  onEnded={() => setProgress(1)}
                  onClick={handleTogglePlayback}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
                <button
                  type="button"
                  onClick={handleRestart}
                  className="absolute left-3 top-3 z-20 rounded-full bg-black/45 p-2 text-white backdrop-blur-md transition hover:bg-black/60"
                  aria-label="Restart reel"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleToggleMute}
                  className="absolute right-3 top-3 z-20 rounded-full bg-black/45 p-2 text-white backdrop-blur-md transition hover:bg-black/60"
                  aria-label={isMuted ? "Unmute reel" : "Mute reel"}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <div className="absolute bottom-0 left-0 right-0 z-20 h-1.5 bg-white/10">
                  <div
                    className="h-full bg-white/90 transition-[width] duration-150"
                    style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
                  />
                </div>
              </div>
            </div>

            <div ref={emblaRef} className="relative mt-6 overflow-hidden md:hidden">
              <div className="-ml-4 flex">
                {recognitions.map((item, index) => (
                  <div key={`${item.title}-mobile-${index}`} className="min-w-0 shrink-0 basis-[82%] pl-4">
                    <div className="flex h-24 w-full items-center justify-center rounded-[1.25rem] border border-black/5 bg-background/80 px-4 shadow-sm">
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noreferrer" className="block h-full w-full">
                          <img
                            src={item.image}
                            alt={item.title}
                            loading="lazy"
                            className="h-full w-full object-contain p-3"
                          />
                        </a>
                      ) : (
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          className="h-full w-full object-contain p-3"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-6 hidden overflow-hidden md:block">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background via-background/80 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background via-background/80 to-transparent" />
              <div className="flex w-max gap-4 animate-marquee">
                {[...recognitions, ...recognitions].map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="flex h-28 w-44 items-center justify-center rounded-[1.4rem] border border-black/5 bg-background/80 px-4 shadow-sm md:h-32 md:w-52"
                  >
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noreferrer" className="block h-full w-full">
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          className="h-full w-full object-contain p-4 transition duration-500"
                        />
                      </a>
                    ) : (
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-contain p-4 transition duration-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
