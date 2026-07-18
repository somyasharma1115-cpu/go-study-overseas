import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Phone, Search } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/links";
import heroPoster from "@/assets/web/posters/hero-background-video.jpg";
import heroBackgroundVideoDesktop from "../../../hero_background_video.mp4";
import heroBackgroundVideoMobile from "../../../hero_background_video_mobile.mp4";

type HeroProps = {
  onSearchOpen: () => void;
  onMatchOpen: () => void;
};

export const Hero = ({ onSearchOpen, onMatchOpen }: HeroProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let ticking = false;

    const updateCover = () => {
      const offset = Math.max(0, window.scrollY - section.offsetTop);
      const coverDistance = Math.max(section.offsetHeight * 0.42, 1);
      const coverProgress = Math.min(offset / coverDistance, 1);

      section.style.setProperty("--hero-cover-progress", coverProgress.toFixed(3));
      section.style.setProperty("--hero-parallax-offset", `${Math.round(offset)}px`);

      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateCover);
    };

    updateCover();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const connection = navigator.connection as
      | {
          saveData?: boolean;
          effectiveType?: string;
        }
      | undefined;

    if (connection?.saveData || connection?.effectiveType === "2g" || connection?.effectiveType === "slow-2g") {
      return;
    }

    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const resolveVideoSrc = () =>
      window.matchMedia("(max-width: 768px)").matches ? heroBackgroundVideoMobile : heroBackgroundVideoDesktop;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) {
          return;
        }

        setVideoSrc(resolveVideoSrc());
        setShouldLoadVideo(true);
        observer.disconnect();
      },
      { threshold: 0.2, rootMargin: "200px 0px" },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoadVideo || !videoSrc) {
      return;
    }

    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.load();
    void video.play().catch(() => {});
  }, [shouldLoadVideo, videoSrc]);

  return (
    <section ref={sectionRef} className="hero-parallax relative isolate flex min-h-[100svh] items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="hero-parallax__video-wrap"
          aria-hidden="true"
          style={{ backgroundImage: `url(${heroPoster})` }}
        >
          {shouldLoadVideo ? (
            <video
              ref={videoRef}
              className={`hero-parallax__video ${isVideoReady ? "is-ready" : ""}`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              src={videoSrc ?? undefined}
              poster={heroPoster}
              onLoadedData={() => setIsVideoReady(true)}
              onCanPlay={() => setIsVideoReady(true)}
            >
            </video>
          ) : null}
        </div>
        <div className="hero-parallax__overlay" aria-hidden="true" />
        <div className="hero-parallax__fade" />
      </div>

      <div className="container relative z-10 w-full py-32 md:py-40">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto max-w-4xl rounded-[2rem] bg-black/10 px-5 py-6 backdrop-blur-[2px] md:px-8 md:py-8">
            <h1 className="font-display text-5xl font-semibold leading-[0.92] tracking-[-0.03em] text-white text-balance drop-shadow-[0_4px_18px_rgba(0,0,0,0.65)] sm:text-6xl md:text-7xl lg:text-[6.5rem]">
              Study abroad with top scholarships
            </h1>

            <p className="hidden lg:block mt-6 text-base font-medium tracking-[0.01em] text-white/95 md:text-lg text-pretty drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]">
              Scholarships · Admissions · Visa support · SOPs · LORs · 200+ partner universities · Italy · Germany · France · UK · Canada · USA · Australia · Malta · Dubai · MBBS Study Abroad
            </p>
          </div>

          <div className="mt-10 max-w-2xl mx-auto glass-strong rounded-full p-2 flex items-center shadow-cloud">
            <Search className="w-5 h-5 ml-4 text-ink-soft shrink-0" />
            <button
              type="button"
              onClick={onSearchOpen}
              className="flex-1 bg-transparent px-3 py-3 text-left outline-none text-sm md:text-base text-ink-soft"
            >
              Search countries, universities, courses...
            </button>
            <button
              type="button"
              onClick={onMatchOpen}
              className="hidden sm:inline-flex items-center gap-2 bg-ink text-background text-sm font-medium px-5 py-3 rounded-full hover:opacity-90 transition"
            >
              Find My Match <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Search"
              onClick={onSearchOpen}
              className="sm:hidden grid place-items-center w-11 h-11 rounded-full bg-ink text-background"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2 md:gap-3">
            {[
              { label: "Attend Webinar", icon: ArrowRight, primary: true, to: "/events", orderClass: "order-1 md:order-1" },
              { label: "WhatsApp Us", icon: MessageCircle, href: WHATSAPP_URL, external: true, orderClass: "order-2 md:order-3" },
              { label: "Explore Latest Blogs", to: "/blog", orderClass: "order-3 md:order-2" },
              { label: "Call Me", icon: Phone, to: "/#contact", orderClass: "order-4 md:order-4" },
            ].map((c, i) => (
              c.to ? (
                <Link
                  key={i}
                  to={c.to}
                  className={`inline-flex items-center gap-2 text-sm px-4 py-2.5 rounded-full transition ${c.orderClass || ""} ${
                    c.primary ? "bg-gradient-brand text-primary-foreground shadow-pill hover:opacity-95" : "glass text-ink hover:bg-white/80"
                  }`}
                >
                  {c.label}
                  {c.icon && <c.icon className="w-3.5 h-3.5" />}
                </Link>
              ) : c.href ? (
                <a
                  key={i}
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noopener noreferrer" : undefined}
                  className={`inline-flex items-center gap-2 text-sm px-4 py-2.5 rounded-full transition ${c.orderClass || ""} ${
                    c.primary ? "bg-gradient-brand text-primary-foreground shadow-pill hover:opacity-95" : "glass text-ink hover:bg-white/80"
                  }`}
                >
                  {c.label}
                  {c.icon && <c.icon className="w-3.5 h-3.5" />}
                </a>
              ) : (
                <button
                  key={i}
                  type="button"
                  className={`inline-flex items-center gap-2 text-sm px-4 py-2.5 rounded-full transition ${c.orderClass || ""} ${
                    c.primary ? "bg-gradient-brand text-primary-foreground shadow-pill hover:opacity-95" : "glass text-ink hover:bg-white/80"
                  }`}
                >
                  {c.label}
                  {c.icon && <c.icon className="w-3.5 h-3.5" />}
                </button>
              )
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
